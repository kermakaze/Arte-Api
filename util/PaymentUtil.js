// jshint esversion: 6
const axios = require('axios');
// const Ravepay = require('ravepay');
// require('dotenv').config();

function getKey(seckey) {
    var md5 = require('md5');
    var keymd5 = md5(seckey);
    var keymd5last12 = keymd5.substr(-12);

    var seckeyadjusted = seckey.replace('FLWSECK-', '');
    var seckeyadjustedfirst12 = seckeyadjusted.substr(0, 12);

    return seckeyadjustedfirst12 + keymd5last12;
}

// This is the encryption function that encrypts your payload by passing the stringified format and your encryption Key.
function encrypt(key, text) {
    var CryptoJS = require('crypto-js');
    var forge = require('node-forge');
    var utf8 = require('utf8');
    var cipher = forge.cipher.createCipher('3DES-ECB', forge.util.createBuffer(key));
    cipher.start({ iv: '' });
    cipher.update(forge.util.createBuffer(text, 'utf-8'));
    cipher.finish();
    var encrypted = cipher.output;
    return (forge.util.encode64(encrypted.getBytes()));
}
module.exports = {
    randomAlphaString(len) {
        let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < len; i++) {
            let randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString.toUpperCase();
    },
    async getPaymentLink(referenceNumber, userEmail, amountGHS) {

        try {
            const res =
                await axios.post(process.env.FWAVE_TEST_URL, {
                    txref: referenceNumber,
                    PBFPubKey: process.env.FWAVE_PUBLIC_KEY_TEST,
                    customer_email: userEmail,
                    amount: amountGHS, //* 66.19,//Just for testing since test api only accepts naira
                    currency: "GHS",
                    country: "GH",
                    redirect_url: "http://success.com"
                });
            const link = res.data.data.link;

            return link;

        } catch (err) {
            console.error(err.response);
            return null;
        }
    }
};