if (process.env.NODE_ENV != 'production') {
    require('dotenv').config(); /* load() deprecated, use config() */
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

console.log(stripeSecretKey, stripePublicKey)

const express = require('express');
const app = express();
const fs = require('fs');
const stripe = require('stripe')(stripeSecretKey);
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));

app.get('/store', function(req, res) {
    fs.readFile('items.json', function(error, data) {
        if (error) {
            res.status(500).end();
        }
        else {
            res.render('store.ejs', {
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
            }); // how does compiler know which JSON to parse? is it because items: is stated? 
        }
    })
})

// BUG: not showing purchase messasge and not going through charges
app.post('/purchase', function(req, res) { // This does not actually go to a webpage. Is it hidden webpage that only the server has but the user cannot see?
    fs.readFile('items.json', function(error, data) {
        if (error) {
            res.status(500).end();
        }
        else {
            const itemsJson = JSON.parse(data);
            const itemsArray = itemsJson.music.concat(itemsJson.merch);
            let total = 0;
            req.body.items.forEach(function(item) {
                const itemJson = itemsArray.find(function(i) {
                    return i.id == item.id;
                })
                total += itemJson.price * item.quantity;
            })
 
            stripe.charges.create({
                amount: total,
                source: req.body.stripeTokenId,
                currency: 'usd'
            }).then(function() {
                console.log('Charge Successful');
                res.json({message: 'Successfully purchased items'});
            }).catch(function() {
                console.log('Charge Fail');
                res.status(500).end();
            })
        }
    })
})

app.listen(3000);

/* integrate stripe 43:42 */