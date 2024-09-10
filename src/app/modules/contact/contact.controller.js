const  ContactService = require("./contact.server");
const sendResponse = require("../../../shared/sendResponse");
const catchAsync = require("../../../shared/catchAsync");
const {StatusCodes} = require("http-status-codes");

exports.createContact = catchAsync(async (req, res) => {
    const contactData = req.body;
    const result = await ContactService.createContactToDB(contactData);

  
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Contact crated successfully",
        data: result,
    });
});
  
exports.updateContact = catchAsync(async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await ContactService.updateContactToDB(id, payload);
  
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Contact updated successfully",
        data: result,
    });
});

exports.getContact = catchAsync(async (req, res) => {

    const result = await ContactService.getContactFromDB();
  
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Contact Retrieved successfully",
        data: result,
    });
});