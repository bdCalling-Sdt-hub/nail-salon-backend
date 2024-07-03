exports.emailVerification = (values) => {
    const data = {
        to: values.email,
        subject: 'Account Activation Email',
        html: `
            <h1>Hello, ${values?.name}</h1>
            <p>Your email verified code is <h3>${values?.otp}</h3> to verify your email</p>
            <small>This Code is valid for 3 minutes</small>
        ` 
    };
    return data;
};


exports.forgetPassword = (values) => {
    const data = {
        to: values.email,
        subject: 'Reset your password',
        html: `
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
                <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <img src="https://i.postimg.cc/CxR60Th4/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px;" />
                    <div style="text-align: center;">
                        <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Hello, ${values?.name}</p>
                        <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
                        <div style="background-color: #12354E; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
                        <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
                    </div>
                    <div style="font-size: 14px; color: #999; text-align: center; ">
                        <p>&copy; 2024 Nail Salon. All rights reserved.</p>
                    </div>
                </div>
            </body>
        `
    };
    return data;
};