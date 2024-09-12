const nodemailer=require("nodemailer");
const config=require("../config");
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: true,  // true for 465, false for other ports
    auth:{
        user: config.email.from,
        pass: config.email.pass
    }
});

exports.sendMail = async(values)=>{
    const info = await transporter.sendMail({
        from: `"Nail Salon" ${config.email.from}`,
        to: values?.to,
        subject: values?.subject,
        html: values?.html
    });
    console.log('Mail', info.response)
}

exports.bookingConfirmation = async(values)=>{
    const templatePath = path.join(__dirname, '../app/ejs/confirmBooking.ejs');
    const html = await ejs.renderFile(templatePath, {
        name: values?.name,
        salon: values?.salon,
        email: values?.email,
        contact: values?.contact,
        date: values?.date,
        time: values?.time,
        services: values?.services
    });

  try {
    const info = await transporter.sendMail({
      from: `"NiFi" ${config.email.from}`,
      to: values.to,
      subject: "Booking Confirmation",
      html: html,
    });

    console.log("Mail send successfully", info?.accepted)
  } catch (error) {
    console.log("Email", error)
  }
}

// module.exports = {bookingConfirmation, sendMail};