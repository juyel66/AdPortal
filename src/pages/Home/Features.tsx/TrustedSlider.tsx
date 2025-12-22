// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperOptions } from "swiper/types";

import "swiper/css";
import "swiper/css/free-mode";

import { FreeMode, Autoplay } from "swiper/modules";

type TrustedByLogo = string;

const logos: TrustedByLogo[] = [
  "https://res.cloudinary.com/dqkczdjjs/image/upload/v1766433714/Logo_3_ek3m4b.png",
  "https://res.cloudinary.com/dqkczdjjs/image/upload/v1766433713/Logo_4_y3u3an.png",
  "https://res.cloudinary.com/dqkczdjjs/image/upload/v1766433710/Logo_7_bk1xns.png",
  "https://res.cloudinary.com/dqkczdjjs/image/upload/v1766433710/Logo_5_gv5zxt.png",
  "https://res.cloudinary.com/dqkczdjjs/image/upload/v1766433710/Logo_8_lix3lb.png",
  "https://res.cloudinary.com/dqkczdjjs/image/upload/v1766433710/Logo_6_akvmlj.png",
  "https://res.cloudinary.com/dqkczdjjs/image/upload/v1766433710/Logo_9_h7exsk.png",
  "https://res.cloudinary.com/dqkczdjjs/image/upload/v1766433709/Logo_10_jgzugy.png",
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
          modules={[FreeMode, Autoplay]}
          freeMode
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          loop
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={swiperBreakpoints}
        >
          {logos.map((logo: TrustedByLogo, index: number) => (
            <SwiperSlide key={index}>
              <div className="flex items-center justify-center h-24 rounded-2xl border bg-white shadow-sm hover:shadow-md transition">
                <img
                  src={logo}
                  alt={`Brand ${index + 1}`}
                  className="h-15 object-contain"
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
