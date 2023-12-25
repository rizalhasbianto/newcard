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

    readHTMLFile(postsDirectory + '/email/invoice.html', function (err, html) {
        if (err) {
            console.log('error reading file', err);
            res.json({ status: 400, data: err });
            return;
        }
        const template = Handlebars.compile(html);
        const data = {
            name: bodyObject.name,
            companyName: bodyObject.companyName,
            orderNumber: bodyObject.orderNumber,
            poNumber: bodyObject.poNumber,
            checkoutUrl: bodyObject.checkoutUrl,
            quoteId: bodyObject.quoteId,
            domain:domain
        }
        const htmlEmail = template(data);
        const mailOptions = {
            from: 'Skratch B2B <dev@skratch.co>',
            to: bodyObject.email,
            subject: 'Invoice',
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