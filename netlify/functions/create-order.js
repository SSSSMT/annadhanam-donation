const Razorpay = require('razorpay');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const data = JSON.parse(event.body);

    // Initialize Razorpay with keys from Environment Variables
    const instance = new Razorpay({
        key_id: 'rzp_test_S0KRA9uxjQhX1T', // It's okay to hardcode Public Key here
        key_secret: process.env.RAZORPAY_KEY_SECRET // Loaded securely from Netlify
    });

    const options = {
        amount: data.amount * 100, // amount in the smallest currency unit (paise)
        currency: "INR",
        receipt: "receipt_order_" + Date.now(),
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
            body: JSON.stringify({ error: error.message }),
        };
    }
};