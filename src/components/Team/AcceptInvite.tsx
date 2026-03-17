import api from "@/lib/axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const AcceptInvite = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link");
      setLoading(false);
      return;
    }

    const storageKey = `invite_accepted_${token}`;

    // If already accepted before (persisted), wait 2s then show success
    if (localStorage.getItem(storageKey) === "true") {
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
      return;
    }

    const acceptInvite = async () => {
      try {
        setLoading(true);

        const [result] = await Promise.allSettled([
          api.post(`/main/accept-invitation/${token}/`),
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);

        if (result.status === "rejected") {
          throw result.reason;
        }

       
        localStorage.setItem(storageKey, "true");

        setSuccess(true);
        toast.success("Invitation accepted successfully!");
      } catch (err: any) {
        console.error("Accept invite error:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "Failed to accept invitation";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    acceptInvite();
  }, [token]);

  // Trigger fade-in animation once loading finishes
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const cardBase =
    "transition-all duration-500 ease-out " +
    (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4");

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Checking Invitation
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your invitation...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
        <div className={`max-w-md w-full ${cardBase}`}>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Invitation Accepted!
            </h2>
            <p className="text-gray-600 mb-8">
              Your invitation has been successfully accepted.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
        <div className={`max-w-md w-full ${cardBase}`}>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Invitation Failed
            </h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AcceptInvite;