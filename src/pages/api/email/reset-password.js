var nodemailer = require('nodemailer');
var fs = require('fs');
import path from 'path'
import Handlebars from "handlebars";

export default async function addCompany(req, res) {
    const bodyObject = req.body;
    const domain = process.env.NEXTAUTH_DOMAIN

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
            user: 'dev@skratch.co',
            pass: 'kniibqqnfeyshtjt'
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
            userId: bodyObject.userId,
            domain:domain
        }
        const htmlEmail = template(data);
        const mailOptions = {
            from: 'Skratch B2B <dev@skratch.co>',
            to: data.email,
            subject: 'Reset password link',
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