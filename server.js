if (process.env.NODE_ENV != 'production') {
    require('dotenv').config(); /* load() deprecated, use config() */
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

console.log(stripeSecretKey + " " + stripePublicKey)

const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(3000);

/* add library for store 15:44 */