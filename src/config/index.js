const dotenv=require("dotenv");
const path=require("path");
dotenv.config({path : path.join(process.cwd(), '.env')});


const config ={
    database: process.env.DATABASE_URL,
    port: process.env.PORT,
    ip_address: process.env.IP,
    email: {
        from: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
        port: process.env.EMAIL_PORT,
        host: process.env.EMAIL_HOST,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expire_in: process.env.JWT_EXPIRE_IN,
    },
    bcrypt_salt_rounds: 12

}

module.exports = config;