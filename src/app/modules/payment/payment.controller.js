const PaymentService = require("./payment.service");
const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const { StatusCodes } = require("http-status-codes");

exports.createConnectedAccount= catchAsync(async(req, res)=>{
    
    const user = req.user;

    //parse body data
    const bodyData = JSON.parse(req.body.data);
    const files = req.files.KYC;

    const result = await PaymentService.createConnectedAccount(user, bodyData, files);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Connected account created successfully",
        data: result
    })
});


exports.transferAndPayouts= catchAsync(async(req, res)=>{
    const id =req.params.id;
    const result = await PaymentService.transferAndPayouts(id);
    sendResponse(res, {
        statusCode : StatusCodes.OK,
        status: true,
        message: "Transfer and payouts successfully",
        data: result
    })
});