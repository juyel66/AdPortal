import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-white px-6">
      <div className="max-w-xl text-center">
        {/* Big 404 */}
        <h1 className="text-[120px] font-extrabold text-blue-600 leading-none">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-slate-600">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>



        {/* Button */}
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
          >
             Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
