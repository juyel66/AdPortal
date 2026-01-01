// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperOptions } from "swiper/types";

import morganLogo from "../../../assets/morganLogo.svg";
import potaka from "../../../assets/potaka.svg";
import citi from "../../../assets/citi.svg";
import ibm from "../../../assets/ibm.svg";
import jmorgan from "../../../assets/jmorgan.svg";
import sales from "../../../assets/sales.svg";
import agun from "../../../assets/agun.svg";
import pampers from "../../../assets/pampers.svg";

import "swiper/css";


import { Autoplay } from "swiper/modules";

type TrustedByLogo = string;

const logos: TrustedByLogo[] = [
  morganLogo,
  potaka,
  citi,
  ibm,
  jmorgan,
  sales,
  agun,
  pampers,
  

];

const swiperBreakpoints: SwiperOptions["breakpoints"] = {
  640: { slidesPerView: 3 },
  768: { slidesPerView: 5 },
  1024: { slidesPerView: 7 },
};

const TrustedSlider: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white py-16">
      <div>
        {/* Title */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-blue-600">
            Trusted <span className="text-black">By</span>
          </h2>
          <p className="mt-2 text-slate-600">
            Helping teams run smarter ad campaigns
          </p>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          speed={1500}
          loop
          spaceBetween={30}
          slidesPerView={2}
          breakpoints={swiperBreakpoints}
        >
          {logos.map((logo, index) => (
            <SwiperSlide key={index}>
              <div className="flex items-center justify-center h-24 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
                <img
                  src={logo}
                  alt={`Brand ${index + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder.png";
                  }}
                  className="h-12 object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TrustedSlider;
