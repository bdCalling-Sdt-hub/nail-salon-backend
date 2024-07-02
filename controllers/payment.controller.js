const sendResponse = require("../shared/sendResponse");
const ApiError = require("../errors/ApiError");
const httpStatus = require("http-status");
const fs = require("fs");
const User = require("../models/user.model");
const Token = require("../models/token.model");
const Order = require("../models/order.model");
const catchAsync = require("../shared/catchAsync");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//create payment intent
exports.createPaymentIntent = catchAsync(async (req, res) => {
  const { price } = req.body;
  const amount = parseInt(price * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "eur",
    payment_method_types: ["card"],
  });

  const paymentIntentAmount = paymentIntent.amount / 100;

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment created successfully",
    data: {
      clientSecret: paymentIntent.client_secret,
      transactionId: paymentIntent.id,
      price: paymentIntentAmount,
    },
  });
});

//create connected account
exports.createConnectedAccount = catchAsync(async (req, res) => {
  const user = req.user;
  //user check
  const isExistUser = await User.isExistUser(user._id);
  if (!isExistUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does't exist!");
  }

  //check already account exist;
  if (await User.isAccountCreated(user._id)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Your account already exist,Please skip this"
    );
  }

  //parse body data
  const bodyData = JSON.parse(req.body.data);
  const { dateOfBirth, phoneNumber, address, bank_info, business_profile } =
    bodyData;
  const dob = new Date(dateOfBirth);

  console.log(bodyData);

  if (
    !dateOfBirth &&
    !phoneNumber &&
    !address &&
    !bank_info &&
    !business_profile
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please provide the required information: date of birth, phone number, address, bank information, and business profile."
    );
  }

  //process of kyc
  const files = req.files.KYC;
  if (!files && files.length < 2) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Two kyc files are required!");
  }

  //file upload on stipe
  const frontFilePart = await stripe.files.create({
    purpose: "identity_document",
    file: {
      data: fs.readFileSync(files[0].path),
      name: files[0].filename,
      type: files[0].mimetype,
    },
  });

  const backFilePart = await stripe.files.create({
    purpose: "identity_document",
    file: {
      data: fs.readFileSync(files[0].path),
      name: files[0].filename,
      type: files[0].mimetype,
    },
  });

  //create token
  const token = await stripe.tokens.create({
    account: {
      individual: {
        dob: {
          day: dob.getDate(),
          month: dob.getMonth() + 1,
          year: dob.getFullYear(),
        },
        first_name: isExistUser?.firstName,
        last_name: isExistUser?.lastName,
        email: isExistUser?.email,
        phone: phoneNumber,
        address: {
          city: address.city,
          country: address.country,
          line1: address.line1,
          postal_code: address.postal_code,
        },
        verification: {
          document: {
            front: frontFilePart.id,
            back: backFilePart.id,
          },
        },
      },
      business_type: "individual",
      tos_shown_and_accepted: true,
    },
  });

  //account created
  const account = await stripe.accounts.create({
    type: "custom",
    account_token: token.id,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_profile: {
      mcc: "5970",
      name: business_profile.business_name || isExistUser.firstName,
      url: business_profile.website || "www.example.com",
    },
    external_account: {
      object: "bank_account",
      account_holder_name: bank_info.account_holder_name,
      account_holder_type: bank_info.account_holder_type,
      account_number: bank_info.account_number,
      country: bank_info.country,
      currency: bank_info.currency,
    },
  });

  //save to the DB
  if (account.id && account.external_accounts.data.length) {
    isExistUser.accountInformation.stripeAccountId = account.id;
    isExistUser.accountInformation.externalAccountId =
      account.external_accounts?.data[0].id;
    isExistUser.accountInformation.status = true;
    await isExistUser.save();
  }

  // Create account link for onboarding
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "https://example.com/reauth",
    return_url: "https://example.com/return",
    type: "account_onboarding",
    collect: "eventually_due",
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Connected account created successfully",
    data: accountLink,
  });
});

exports.transferAndPayouts = catchAsync(async (req, res) => {
  const user = req.user;
  const { QRdata } = req.body;
  //artist check
  const isExistUser = await User.isExistUser(user._id);
  if (!isExistUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Artist doesn't exist!");
  }

  //check bank account
  if (!(await User.isAccountCreated(user._id))) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Sorry, you didn't provide your bank information. Please create an account first, then scan again"
    );
  }

  //body data token check
  if (!QRdata) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "QR code scan data is missing from the request."
    );
  }

  //token check from db
  const isExistToken = await Token.isExistToken(QRdata);
  if (!isExistToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You provided Invalid QR Data");
  }

  //check order data
  const isExistOrder = await Order.isOrderExist(isExistToken.orderId);
  if (!isExistOrder) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User has not completed the payment."
    );
  }

  //check completed payment and artist transfer
  if (
    isExistOrder.orderStatus === "completed" &&
    isExistOrder.paymentStatus === "transferred_to_artist"
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "The payment has already been transferred to your account."
    );
  }

  const { stripeAccountId, externalAccountId } = isExistUser.accountInformation;
  const { price } = isExistOrder;

  const charge = (parseInt(price) * 10) / 100;
  const amount = parseInt(price) - charge;

  const transfer = await stripe.transfers.create({
    amount: amount * 100,
    currency: "eur",
    destination: stripeAccountId,
  });

  const payouts = await stripe.payouts.create(
    {
      amount: amount * 100,
      currency: "eur",
      destination: externalAccountId,
    },
    {
      stripeAccount: stripeAccountId,
    }
  );

  if (transfer.id && payouts.id) {
    isExistOrder.orderStatus = "completed";
    isExistOrder.paymentStatus = "transferred_to_artist";
    isExistOrder.payoutPrice = payouts.amount / 100;
    await isExistOrder.save();

    //real time response
    const artist = await User.findById(isExistOrder.artist).select(
      "_id firstName lastName color profession image"
    );

    io.emit(`scan-confirm::${isExistOrder.user}`, {
      message:
        "Transaction Completed: The payment has been successfully transferred.",
      data: artist,
      gigId: isExistOrder?.gigId,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Transfer and payouts successfully",
    data: {
      transfer: {
        id: transfer.id,
        transactionId: transfer.balance_transaction,
        amount: transfer.amount / 100,
      },
      payouts: {
        id: payouts.id,
        transactionId: payouts.balance_transaction,
        amount: payouts.amount / 100,
      },
    },
  });
});
