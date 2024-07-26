const  BankService = require("./bank.service");
const sendResponse = require("../../../shared/sendResponse");
const catchAsync = require("../../../shared/catchAsync");
const {StatusCodes} = require("http-status-codes");

exports.createBank = catchAsync(async (req, res) => {
    const user = req.user._id;
    
    const data = {
        ...req.body,
        user,
    };
  
    const result = await BankService.createBank(user, data);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bank Account Data Added successfully",
        data: result,
    });

});

exports.updateBank = catchAsync(async (req, res) => {
    const user = req.user._id;
    
    const data = {
        ...req.body,
        user,
    };
  
    const result = await BankService.updateBank(user, data);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bank Account Data Updated successfully",
        data: result,
    });

});