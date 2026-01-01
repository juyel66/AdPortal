import { useState } from "react";

const faqs = [
  {
    question: "What is AdPortal?",
    answer:
      "AdPortal is an AI-powered advertising platform that helps you create, manage, and optimize ads across multiple platforms from one dashboard.",
  },
  {
    question: "Is it safe to connect my ad accounts?",
    answer:
      "Yes. We use official APIs and secure authentication to protect your data and ad accounts.",
  },
  {
    question: "Can AdPortal create ads for me?",
    answer:
      "Yes. Our AI can generate ad copy, creatives, and suggestions tailored to your audience and goals.",
  },
  {
    question: "Does it optimize my ads automatically?",
    answer:
      "Yes. AdPortal continuously monitors performance and automatically optimizes budgets and targeting.",
  },
  {
    question: "Which platforms are supported?",
    answer:
      "We currently support Meta (Facebook & Instagram), Google Ads, and TikTok Ads.",
  },
];

const Frequently = () => {
  const [activeIndex, setActiveIndex] = useState(1); // 👈 default open

  const toggleFAQ = (index: any) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-white py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* LEFT TITLE */}
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
              Frequently Asked
              <br />
              <span className="text-blue-600">Questions</span>
            </h2>
          </div>

          {/* RIGHT FAQ */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isActive = activeIndex === index;

              return (
                
                <div
                  key={index}
                  className={`rounded-xl p-5 cursor-pointer transition-all duration-300 border ${
    isActive
      ? "bg-gradient-to-b from-[#0A1B4D] to-[#123A8F] text-white border-blue-400/40 shadow-[0_0_0_1px_rgba(59,111,245,0.4)]"
      : "bg-white border-slate-200 text-slate-900 hover:border-blue-300"
  }`}



                  onClick={() => toggleFAQ(index)}
                >
                  {/* Question */}
                  <div className="flex items-center justify-between font-semibold text-base">
                    {faq.question}
                    <span
                      className={`transition-transform duration-300 ${
                        isActive ? "rotate-180" : ""
                      }`}
                    >
                      ⌄
                    </span>
                  </div>

                  {/* Answer */}
                  {isActive && (
                    <p className="mt-3 text-sm text-blue-100">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Frequently;
