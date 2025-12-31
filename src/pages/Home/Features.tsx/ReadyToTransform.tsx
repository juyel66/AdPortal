import { Link } from "react-router-dom";

const ReadyToTransform = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-100 to-white py-24">
      {/* Soft glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-200/40 via-blue-100/30 to-transparent blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          Ready to{" "}
          <span className="text-blue-600">Transform</span>{" "}
          Your Ad Management?
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-slate-600">
          Join thousands of marketers who have streamlined their advertising
          workflow
        </p>

        {/* CTA */}
        <div className="mt-8">
          <Link
            to="/auth/signin"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 transition"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReadyToTransform;
