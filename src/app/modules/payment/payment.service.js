const User = require("../user/user.model");
const Booking = require("../booking/booking.model");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const Notification = require("../notifications/notification.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const fs = require("fs");
const ApiError = require("../../../errors/ApiError");

//create connected account
exports.createConnectedAccount = async (user, bodyData, files) => {

    //user check
    const isExistUser = await User.isExistUser(user._id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User does't exist!");
    }
  
    //check already account exist;
    if (await User.isAccountCreated(user._id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Your account already exist,Please skip this");
    }
  
    
    const { dateOfBirth, phoneNumber, address, bank_info, business_profile } = bodyData;
    const dob = new Date(dateOfBirth);
  
    if (!dateOfBirth && !phoneNumber && !address && !bank_info && !business_profile) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Please provide the required information: date of birth, phone number, address, bank information, and business profile.");
    }
  
    //process of kyc
    if (!files && files?.length < 2) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Two kyc files are required!");
    }
  
    //file upload on stipe
    const frontFilePart = await stripe.files.create({
        purpose: "identity_document",
        file: {
            data: fs.readFileSync(files[0].path),
            name: files[0].filename,
            type: files[0].mimetype,
        }
    });
  
    const backFilePart = await stripe.files.create({
        purpose: "identity_document",
        file: {
            data: fs.readFileSync(files[0].path),
            name: files[0].filename,
            type: files[0].mimetype,
        }
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
        }
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
        }
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
  
    return accountLink;
};

// transfer and payout
exports.transferAndPayouts = async (id) => {


    //booking check
    const isExistBooking = await Booking.findById(id);
    if (!isExistBooking) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Booking doesn't exist!");
    }

    //check bank account
    const isExistUser = await User.isAccountCreated(new mongoose.Types.ObjectId(isExistBooking?.salon))
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Sorry, Salon didn't provide bank information. Please tell the salon owner to create a bank account");
    }
  
    //check completed payment and artist transfer
    if (isExistBooking.status === "Complete") {
        throw new ApiError(StatusCodes.BAD_REQUEST, "The payment has already been transferred to your account.");
    }


  
    const { stripeAccountId, externalAccountId } = isExistUser.accountInformation;
    const { price } = isExistBooking;
  
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
        isExistBooking.status = "Completed";
        isExistBooking.payoutPrice = payouts.amount / 100;
        await isExistBooking.save();
  
        const data ={
            title: "Payment Received",
            text: `Your Have Received Payment for service successfully`,
            user: isExistUser?._id,
        }

        const result =  await Notification.create(data)
        io.emit(`get-notification::${isExistUser?._id}`, result);
    }

    return {
        transfer,
        payouts
    }
};
  