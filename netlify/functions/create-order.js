const Razorpay = require('razorpay');

exports.handler = async function(event, context) {
    // Only allow POST requests from your frontend
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const data = JSON.parse(event.body);

    // Securely initialize Razorpay using Netlify Environment Variables
    const instance = new Razorpay({
        key_id: 'rzp_test_S0KRA9uxjQhX1T',           // Public Key ID
        key_secret: process.env.RAZORPAY_KEY_SECRET  // Secret Key (Stored in Netlify)
    });

    const options = {
        amount: data.amount * 100, // Razorpay expects amount in paise (100 paise = ₹1)
        currency: "INR",
        receipt: "receipt_" + Math.floor(Math.random() * 1000000),
    };

    try {
        const order = await instance.orders.create(options);
        return {
            statusCode: 200,
            body: JSON.stringify(order),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to create order: " + error.message }),
        };
    }
};