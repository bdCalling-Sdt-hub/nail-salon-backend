const nodemailer=require("nodemailer");
const config=require("../config")

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: true,  // true for 465, false for other ports
    auth:{
        user: config.email.from,
        pass: config.email.pass
    }
});

const sendMail = async(values)=>{
    const info = await transporter.sendMail({
        from: `"Nail Salon" ${config.email.from}`,
        to: values?.to,
        subject: values?.subject,
        html: values?.html
    });
    console.log('Mail', info.response)
}

module.exports = sendMail;