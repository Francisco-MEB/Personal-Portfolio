'use strict'

const express = require('express');
const nodemailer = require('nodemailer');
const multiparty = require('multiparty');
require('dotenv').config();

const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'page')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.HOST_PASS,
    },
});

transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Connection has been verified');
    }
});

app.post('/send', (req, res) => {
    let form = new multiparty.Form();

    form.parse(req, function(err, fields) {
        if (err) {
            console.log(`Error parsing form: ${err}`);
            return res.status(500).json({message: 'Error parsing form'});
        }
        let data = {};
        Object.keys(fields).forEach(function (property) {
            data[property] = fields[property][0];
        });

        const mail = {
            from: process.env.HOST_EMAIL,
            to: process.env.HOST_EMAIL,
            subject: data.subject,
            text: `${data.fullName} <${data.email}> \n${data.emailMessage}`,
        };

        transporter.sendMail(mail, (err, info) => {
            if (err) {
                console.log(err);
                return res.status(500).json({message: 'Try again.'});
            } else {
                console.log('Email successfully sent');
                return res.status(200).json({message: 'Email successfully sent!'});
            }
        });
    });
});