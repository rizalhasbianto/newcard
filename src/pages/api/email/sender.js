var nodemailer = require('nodemailer');
var fs = require('fs');
import path from 'path'

export default async function addCompany(req, res) {

    var readHTMLFile = function (paths, callback) {
        fs.readFile(paths, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'rizalhasbianto@gmail.com',
            pass: 'lokdkjpslmtlnegf'
        }
    });
    const postsDirectory = path.join(process.cwd(), 'public')
console.log("path", postsDirectory)
    readHTMLFile(postsDirectory + '/email/forgotpass.html', function (err, html) {
        if (err) {
            console.log('error reading file', err);
            res.json({ status: 400, data: err });
            return;
        }
        var template = html;
        var mailOptions = {
            from: 'rizalhasbianto@gmail.com',
            to: 'rizalhasbiantopay@gmail.com',
            subject: 'Sending Email using Node.js',
            html: template
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.json({ status: 400, data: error });
            } else {
                console.log('Email sent: ' + info.response);
                res.json({ status: 200, data: info.response });
            }
        });
    });
}