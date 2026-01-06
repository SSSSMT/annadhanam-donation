const Razorpay = require('razorpay');

exports.handler = async function(event, context) {
    // 1. Log that the function started (Helps debug)
    console.log("Function create_order started");

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const data = JSON.parse(event.body);

        // 2. Check if Secret Key is loaded
        if (!process.env.RAZORPAY_KEY_SECRET) {
            console.error("ERROR: RAZORPAY_KEY_SECRET is missing in Netlify!");
            throw new Error("Secret Key missing");
        }

        const instance = new Razorpay({
            key_id: 'rzp_test_S0KRA9uxjQhX1T',
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const options = {
            amount: data.amount * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        // 3. Create Order
        const order = await instance.orders.create(options);
        console.log("Order Created Successfully:", order.id);

        return {
            statusCode: 200,
            body: JSON.stringify(order),
        };

    } catch (error) {
        // 4. PRINT THE ERROR TO THE LOGS
        console.error("RAZORPAY FAILED:", error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};