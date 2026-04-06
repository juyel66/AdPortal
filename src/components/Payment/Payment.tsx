import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import api from "@/lib/axios";

const stripePromise = loadStripe(
  import.meta.env.VITE_payment_gateway_key as string
);

// ✅ SAME LOGIC AS DASHBOARD
const getOrgId = (): string => {
  try {
    const selectedOrg = localStorage.getItem("selectedOrganization");
    if (selectedOrg) {
      const orgData = JSON.parse(selectedOrg);
      if (orgData?.id) return orgData.id;
    }

    const orgs = localStorage.getItem("organizations");
    if (orgs) {
      const orgsData = JSON.parse(orgs);
      if (Array.isArray(orgsData) && orgsData[0]?.[0]) {
        return orgsData[0][0];
      }
    }
  } catch (error) {
    console.error("Org parse error:", error);
  }
  return "";
};

type CheckoutResponse = {
  clientSecret: string;
};

const Payment = ({ planId, planKey }: { planId: string; planKey: string }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const org_id = getOrgId();

  useEffect(() => {
    const createPayment = async () => {
      try {
        if (!org_id) {
          setError("No organization found");
          return;
        }

        setLoading(true);

        const res = await api.post<CheckoutResponse>(
          `/finance/buy-plan/?org_id=${org_id}`,
          {
            plan_id: planId,
            plan_key: planKey,
          }
        );

        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error(err);
        setError("Payment initialization failed");
      } finally {
        setLoading(false);
      }
    };

    createPayment();
  }, [org_id, planId, planKey]);

  const options: StripeElementsOptions | undefined = clientSecret
    ? { clientSecret, appearance: { theme: "stripe" } }
    : undefined;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        
        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Complete Payment 💳
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Secure & encrypted payment via Stripe
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* STRIPE FORM */}
        {clientSecret && options && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Payment;