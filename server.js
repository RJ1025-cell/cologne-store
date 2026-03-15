const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51TBGq6E11JSM1MhDwvHP32Hi9rPv8SISwFFu6m8TwJVhzaLX2mpXCVEda24gq4KKOROXLcXmIncClQObiKIOUz0o00oTUMPoM5'); // Replace with your secret key

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  const lineItems = items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: Math.round(item.price * 100), // Stripe expects cents
    },
    quantity: item.quantity || 1,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 500, // $5.00 in cents
              currency: 'usd',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
      success_url: 'http://localhost:3000/success.html',
      cancel_url: 'http://localhost:3000/index.html',
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));