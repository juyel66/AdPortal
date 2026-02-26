


const Success = () => {
    return (
        <div className="flex items-center  justify-center min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-blue-100">
                <div className="flex justify-center mb-4">
                    <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#d8e7fa" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold mb-2 text-blue-700">Payment Successful!</h1>
                <p className="text-gray-600 mb-4">
                    Your payment was processed successfully. Thank you for your purchase!
                </p>
                <p className="text-gray-500 text-sm mb-6">
                    If you have any questions or need help, please contact our support team.
                </p>
                <a href="/" className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition">Go to Dashboard</a>
            </div>
        </div>
    );
};

export default Success;