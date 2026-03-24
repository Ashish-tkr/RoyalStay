import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import { createRazorpayInstance } from "../utils/razorpay.js";

const razorpayInstance = createRazorpayInstance();

export const createOrder = async (req, res) => {

    const { propertyID, amount } = req.body;

    const options = {
        amount: amount * 100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "receipt#1"
    };

    try {
        razorpayInstance.orders.create(options, (err, order) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Kuch to galat hai",
                    error: err.message
                 });
            }
            return res.status(200).json({ order });
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: "Kuch to galat hai bhai"
        });
    }
};

export const verifyPayment = async (req, res) => {
    const { payment_Id, order_Id, signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    //create hmac object
    const hmac = crypto.createHmac("sha256", secret);   
    hmac.update(`${order_Id}|${payment_Id}`);
    const generatedSignature = hmac.digest("hex");
    if (generatedSignature === signature) {
        //db operations
        return res.status(200).json({ 
            success: true, 
            message: "Payment verified successfully" });
    }else {
        return res.status(400).json({
            success: false,
            message: "Payment verification failed"
        });
    }



        // Verify the payment signature ----
    try {
        const response = await axios.post(`${process.env.RAZORPAY_API_URL}/payments/${payment_Id}/capture`, {
            amount: amount,
            currency: "INR"
        }, {
            headers: {
                "Authorization": `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64")}`
            }
        });

        
        return res.status(200).json({ success: true, message: "Payment verified successfully", data: response.data });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Kuch to galat hai",
            error: error.message
        });
    }
};