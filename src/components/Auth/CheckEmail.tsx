
import { Link } from "react-router-dom";
import { OTP } from "./OTP";

const CheckEmail: React.FC = () => {
  // const [role, setRole] = useState<"user" | "admin">("user");



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔐 API Ready Payload
    // const payload = {
    //   ...form,
    //   role,
    // };

    // console.log("LOGIN PAYLOAD 👉", payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      
        <div>
          <div className="flex items-center gap-3 mb-6">
            <img
              src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1765309106/Rectangle_ktqcsy.png"
              alt="AdPortal Logo"
              className="h-20"
            />
          
          </div>

          <h1 className="text-3xl font-semibold text-slate-900 leading-snug">
          The Only Platform You Need for Multi-Channel Ads
          </h1>

          <p className="mt-4 max-w-md text-sm text-slate-500 leading-relaxed">
          Create once, publish everywhere. Let AI handle your ad campaigns across Meta, Google Ads, and TikTok from one unified dashboard.
          </p>
        </div>

     
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-slate-900">
             Check your Email
            </h2>
            <p className="text-sm text-slate-500 mb-6">
             We sent a verification code to <span className="font-semibold">user@company.com</span> . Enter the code below.
            </p>


          <div className="p-2 mb-4">


              <OTP  />


          </div>



         

           
      
            {/* SIGN IN */}
            <Link to="/auth/new-password"
              type="submit"
              className="mb-4 w-full flex justify-center  rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Verify OTP
            </Link>

           
     

           
            <p className="text-center text-xs text-slate-500">
             Didn't received the email{" "}
              <button
                
                className="text-blue-600"
              >
                Click to resent
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;


