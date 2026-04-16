import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../lib/axios";

interface GoogleAdAccount {
  acc_id: string;
  resource_name: string;
}

interface GoogleAdAccountsResponse {
  data: GoogleAdAccount[];
}

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState({
    accounts: true,
    saving: false,
  });
  const [adAccounts, setAdAccounts] = useState<GoogleAdAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<GoogleAdAccount | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Get org_id from localStorage or URL params
  const getOrgId = (): string => {
    const urlOrgId = searchParams.get("state");
    if (urlOrgId) return urlOrgId;

    const localOrgId = localStorage.getItem("org_id");
    if (localOrgId) return localOrgId;

    const selectedOrg = localStorage.getItem("selectedOrganization");
    if (selectedOrg) {
      try {
        const org = JSON.parse(selectedOrg);
        if (org.id) return org.id;
      } catch (e) {
        console.error("Error parsing selectedOrganization", e);
      }
    }

    return "";
  };

  const org_id = getOrgId();

  useEffect(() => {
    if (org_id) {
      fetchAdAccounts();
    } else {
      setError("No organization ID found. Please select an organization first.");
      setLoading({ accounts: false, saving: false });
    }
  }, [org_id]);

  const fetchAdAccounts = async () => {
    try {
      setLoading((prev) => ({ ...prev, accounts: true }));
      const response = await api.get<GoogleAdAccountsResponse>(`/main/get-ad-profiles`, {
        params: {
          platform: "GOOGLE",
          org_id: org_id,
        },
      });
      setAdAccounts(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch Google ad accounts");
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, accounts: false }));
    }
  };

  const handleSave = async () => {
    if (!selectedAccount) {
      setError("Please select an ad account");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, saving: true }));
      setError(null);

      // Save Google ad account
      await api.post(`/main/select-ad-profile/?org_id=${org_id}`, {
        platform: "GOOGLE",
        acc_id: selectedAccount.acc_id,
      });

      setSaveSuccess(true);
      
      // Redirect to dashboard after successful save
      setTimeout(() => {
        window.location.href = "/user-dashboard/dashboard";
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save Google account");
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, saving: false }));
    }
  };

  // Format customer ID for display (extract number from resource_name)
  const formatCustomerId = (resourceName: string): string => {
    const match = resourceName.match(/customers\/(\d+)/);
    return match ? match[1] : resourceName;
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div
        className="animate-spin rounded-full h-8 w-8 border-2"
        style={{ borderColor: "#3B82F6", borderTopColor: "transparent" }}
      ></div>
    </div>
  );

  // Success state
  if (saveSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            <div className="bg-green-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">Success!</h3>
            <p className="text-sm text-gray-500 mb-4">
              Google account connected successfully. Redirecting to dashboard...
            </p>
            <div className="flex justify-center">
              <div
                className="animate-spin rounded-full h-4 w-4 border-2"
                style={{ borderColor: "#3B82F6", borderTopColor: "transparent" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !loading.accounts) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            <div className="bg-red-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">Error</h3>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 text-white text-sm rounded transition-colors"
              style={{ backgroundColor: "#3B82F6" }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No org state
  if (!org_id && !loading.accounts) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            <div className="bg-yellow-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-5 h-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">
              No Organization Selected
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Please select an organization to continue
            </p>
            <button
              onClick={() => (window.location.href = "/organizations")}
              className="px-3 py-1.5 text-white text-sm rounded transition-colors"
              style={{ backgroundColor: "#3B82F6" }}
            >
              Select Organization
            </button>
          </div>
        </div>
      </div>
    );
  }






  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
       
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="#4285F4"
              />
            </svg>
            <h1 className="text-2xl font-medium text-gray-900">
              Connect Google Account
            </h1>
          </div>
          <p className="text-sm text-gray-500 ml-11">
            Select your Google Ads account to connect
          </p>
        </div>

        {/* Ad Accounts Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Step 1
              </span>
              <h2 className="text-base font-medium text-gray-900">
                Ad Accounts
              </h2>
            </div>
            {loading.accounts && (
              <div className="flex items-center gap-1">
                <div
                  className="animate-spin rounded-full h-3 w-3 border-b"
                  style={{ borderColor: "#3B82F6" }}
                ></div>
                <span className="text-xs text-gray-500">Loading...</span>
              </div>
            )}
          </div>

          {loading.accounts ? (
            <LoadingSpinner />
          ) : adAccounts.length === 0 ? (
            <div className="border border-gray-200 rounded-lg p-8 text-center">
              <div className="bg-gray-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  ></path>
                </svg>
              </div>
              <p className="text-sm text-gray-500">No ad accounts found</p>
              <p className="text-xs text-gray-400 mt-1">
                Make sure you have a Google Ads account with proper access
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {adAccounts.map((account) => (
                <div
                  key={account.acc_id}
                  onClick={() => setSelectedAccount(account)}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all
                    ${
                      selectedAccount?.acc_id === account.acc_id
                        ? "border"
                        : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                  style={
                    selectedAccount?.acc_id === account.acc_id
                      ? { borderColor: "#3B82F6" }
                      : {}
                  }


                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Account ID</p>
                      <p className="text-sm font-medium text-gray-900 mt-0.5">
                        {account.acc_id}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Resource: {formatCustomerId(account.resource_name)}
                      </p>
                    </div>

                    {selectedAccount?.acc_id === account.acc_id && (
                      <svg
                        className="w-4 h-4"
                        style={{ color: "#3B82F6" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!selectedAccount || loading.saving || loading.accounts}
            className="px-6 py-2 text-white text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ backgroundColor: "#3B82F6" }}
          >
            {loading.saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Saving...</span>
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>

        {selectedAccount && !loading.saving && !loading.accounts && (
          <div className="mt-4 text-right text-xs text-gray-500 space-y-0.5">
            <div>Selected Account ID: {selectedAccount.acc_id}</div>
            <div className="text-green-600">Ready to save</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAuthCallback;