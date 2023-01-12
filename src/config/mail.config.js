let nodemailer = require('nodemailer');

const mail = {
    user: 'fi.ulift@gmail.com',
    password: 'aprgomokkorhwdkg'
}

let transporter = nodemailer.createTransport({
    host: 'smtp.gmai.com',
    port: 587,
    tls:{
        rejectUnauthorized: false
    },
    service: 'Gmail',
    auth: {
      user: mail.user,
      pass: mail.password
    }
  });

const sendEmail = async (email, subject,name,url) => {
    try{
        await transporter.sendMail({
            from: `U-Lift <${email.user}>`,
            to: email,
            subject,
            text: 'Autenticación de Usuario',
            html: `
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <title>Test Email</title>
            </head>
        
            <div id="email-content">
                <h1>
                    Confirmacion de Usuario
                </h1>
                <h2> Hola ${name} </h2>
                <a href="${url}"> Click Aqui para Confirmar</a>
            </div>`,
        });
    } catch (error) {
        console.log('Algo no va bien');
    }
}

module.exports = {
    sendEmail
}