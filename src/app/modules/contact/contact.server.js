const {StatusCodes} = require("http-status-codes");
const ApiError = require("../../../errors/ApiError");
const Contact = require("./contact.model");

exports.createContactToDB = async (payload) => {
  const check = await Contact.find({});

  if(check?.length > 0){
      return;
  }

  const createContact = await Contact.create(payload);
  if (!createContact) {
    throw new ApiError(StatusCodes.OK, "Failed to created Contact");
  }
  return createContact;
};

exports.getContactFromDB = async ()=> {
  return await Contact.find({});
};

exports.updateContactToDB = async (id, payload) => {
  const isContactExist = await Contact.findOneAndUpdate({ _id: id }, payload, {new: true});
  if(!isContactExist){
    throw new ApiError(404, "No Contact Found")
  }
  return await Contact.findOneAndUpdate({ _id: id }, payload, {new: true});
};
