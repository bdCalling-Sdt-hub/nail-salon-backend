const crypto = require("crypto");
const QRCode = require("qrcode");

exports.cryptoToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
};

exports.qrCodeGenerate = async (token) => {
  const qrCode = await QRCode.toDataURL(token);
  const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
  return base64Data;
};
