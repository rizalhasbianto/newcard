var nodemailer = require('nodemailer');
var fs = require('fs');
import path from 'path'
import Handlebars from "handlebars";

export default async function addCompany(req, res) {
    const bodyObject = req.body;
console.log("bodyObject", bodyObject)
    const readHTMLFile = function (paths, callback) {
        fs.readFile(paths, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'rizalhasbianto@gmail.com',
            pass: 'lokdkjpslmtlnegf'
        }
    });
    const postsDirectory = path.join(process.cwd(), 'public')

    readHTMLFile(postsDirectory + '/email/resetpassword.html', function (err, html) {
        if (err) {
            console.log('error reading file', err);
            res.json({ status: 400, data: err });
            return;
        }
        const template = Handlebars.compile(html);
        const data = {
            email: bodyObject.email,
            userId: bodyObject.userId
        }
        const htmlEmail = template(data);
        const mailOptions = {
            from: 'rizalhasbianto@gmail.com',
            to: data.email,
            subject: 'Welcome email for set password',
            html: htmlEmail
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.json({ status: 400, data: error });
            } else {
                res.json({ status: 200, data: info.response });
            }
        });
    });
}