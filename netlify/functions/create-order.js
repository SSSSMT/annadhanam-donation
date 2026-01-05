const Razorpay = require('razorpay');

exports.handler = async function (event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { amount } = JSON.parse(event.body);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: order.id,
        currency: order.currency,
        amount: order.amount,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};