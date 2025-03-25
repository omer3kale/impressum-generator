import stripePackage from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

// Process a new payment
export const processPayment = async (amount, currency, paymentMethodId) => {
    try {
        if (!amount || !currency || !paymentMethodId) {
            throw new Error("Alle Zahlungsinformationen sind erforderlich.");
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            confirm: true
        });

        return { success: true, paymentIntent };
    } catch (error) {
        console.error("Fehler bei der Zahlung:", error);
        return { success: false, message: "Zahlung fehlgeschlagen", error: error.message };
    }
};

// Refund a payment
export const refundPayment = async (paymentIntentId) => {
    try {
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId
        });

        return { success: true, refund };
    } catch (error) {
        console.error("Fehler bei der Rückerstattung:", error);
        return { success: false, message: "Rückerstattung fehlgeschlagen", error: error.message };
    }
};

// Retrieve payment details
export const getPaymentDetails = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return { success: true, paymentIntent };
    } catch (error) {
        console.error("Fehler beim Abrufen der Zahlungsdetails:", error);
        return { success: false, message: "Zahlungsdetails konnten nicht abgerufen werden", error: error.message };
    }
};

export default { processPayment, refundPayment, getPaymentDetails };