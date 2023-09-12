


export default async function addCompany(req, res) {
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      host: 'gmail',
      auth: {
        user: 'rizalhasbianto@gmail.com',
        pass: 'lokdkjpslmtlnegf'
      }
    });
    
    var mailOptions = {
      from: 'rizalhasbianto@gmail.com',
      to: 'rizalhasbiantopay@gmail.com',
      subject: 'Sending Email using Node.js',
      text: 'Welcome to B2B app!'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        res.json({ status: 200, data: error });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ status: 200, data: info.response });
      }
    });
    
}