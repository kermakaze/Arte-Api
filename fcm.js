const firebaseAdmin = require('firebase-admin');

const serviceAccount = require('./arte-1575604743184-firebase-adminsdk-jtn4j-48fb1dfaaa');

const  defaultApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});


module.exports = firebaseAdmin;