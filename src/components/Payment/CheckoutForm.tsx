import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else if (paymentIntent?.status === "succeeded") {
      Swal.fire({
        title: "Payment Successful 🎉",
        text: "Your plan has been activated",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => navigate("/dashboard"));
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Stripe Card UI */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <PaymentElement />
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center"
      >
        {loading ? (
          <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
        ) : (
          "Pay Now"
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;