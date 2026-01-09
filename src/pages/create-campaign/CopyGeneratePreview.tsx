import React from "react";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,

  Music,
} from "lucide-react";
import type { CopyGeneratePreviewData } from "../../types/copyGeneratePreview";

interface Props {
  data: CopyGeneratePreviewData;
}

const CopyGeneratePreview: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 space-y-10">
      {/* ================= COPY INPUT PREVIEW ================= */}
      <div className="space-y-4">
        <Field label="Headline" value={data.headline} limit={40} />
        <Field
          label="Primary Text"
          value={data.primaryText}
          limit={125}
          textarea
        />
        <Field
          label="Description (Optional)"
          value={data.description}
          limit={30}
        />
        <Field label="Call to Action" value={data.cta} limit={30} />
      </div>

      {/* ================= FACEBOOK ================= */}
      <Section title="Facebook Ad Preview">
        <div className="border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40"
                className="w-9 h-9 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold">Club Doggo</p>
                <p className="text-xs text-gray-500">Sponsored · <img src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1767917543/Vertical_container_kwvzmk.png" alt="" /></p>
              </div>
            </div>
            <MoreHorizontal size={18} />
          </div>

          {/* Text */}
          <div className="px-3 pb-2 text-sm text-gray-700">
            {data.primaryText}
          </div>

          {/* Media */}
          {data.isVideo ? (
            <video
              src={data.mediaUrl}
              controls
              className="w-full h-[360px] object-cover"
            />
          ) : (
            <img
              src={data.mediaUrl}
              className="w-full h-[360px] object-cover"
            />
          )}

          {/* Headline Bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-100">
            <p className="text-sm font-semibold">{data.headline}</p>
            <button className="px-3 py-2 font-bold bg-gray-300 text-xs rounded">
              {data.cta}
            </button>
          </div>

          {/* Reactions */}
          <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
            <img src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1767917683/Container_14_masz7i.png" alt="" />
               <span>507</span>
            </div>
            <div>12 Comments · 8 Shares</div>
          </div>

          {/* Actions */}
          <div className="border-t flex justify-between px-6 py-2 text-sm text-gray-600">
            <button className="flex items-center gap-1">
              <ThumbsUp size={16} /> Like
            </button>
            <button className="flex items-center gap-1">
              <MessageCircle size={16} /> Comment
            </button>
            <button className="flex items-center gap-1">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </Section>

      {/* ================= GOOGLE ================= */}
      <Section title="Google Ad Preview">
        <div className="border rounded-lg p-4 flex gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <img
                src="https://i.pravatar.cc/32"
                className="w-6 h-6 rounded-full"
              />
              <p className="text-xs text-gray-500">Club Doggo · Sponsored</p>
                   <img  src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1767917950/Horizontal_container_dq8wfb.png" alt="" />
            </div>

      <div className="flex items-center gap-2 mb-2">
            <div>
              <p className="text-sm font-semibold mb-1">{data.headline}</p>
            <p className="text-xs text-gray-600 mb-2">{data.primaryText}</p>
          </div>
            <div>
              <button className="px-3 py-2 font-bold bg-gray-300 text-xs rounded">
                Shop Now
              </button>
            </div>
      </div>


         {data.isVideo ? (
            <video
              
              src={data.mediaUrl}
              className="lg:w-4/12 h-72 rounded object-cover"
            />
          ) : (
            <img
              src={data.mediaUrl}
              className="lg:w-4/12 h-72 rounded object-cover"
            />
          )}

          
          </div>

       
        </div>
      </Section>

      {/* ================= TIKTOK ================= */}
      <Section title="Tiktok Ad Preview">
        <div className="relative w-[240px] h-[440px] bg-black rounded-xl overflow-hidden">
          {/* Media */}
          {data.isVideo ? (
            <video
              src={data.mediaUrl}
              autoPlay
              loop
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <img
              src={data.mediaUrl}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Top */}
          <div className="absolute top-2 left-0 right-0 text-center text-white text-xs">
            Following · <span className="font-semibold">For You</span>
          </div>

          {/* Right actions */}
          <div className="absolute right-2 bottom-24 flex flex-col gap-4 items-center text-white text-xs">
           <img src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1767916526/Avatar_nhfhwe.png" alt="" />
            <div className="flex flex-col items-center">
              <img src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1767916689/Vector_6_n1tznf.png" alt="" />
               1.3M
            </div>
           
            <div className="flex flex-col items-center">
              <img src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1767916689/Group_2_3_yst4yy.png" alt="" />
              
               30.9K
            </div>
            <Music size={20} />
          </div>

          {/* Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <p className="text-xs mb-1">@JaneFisher</p>
            <p className="text-xs mb-2">{data.description}</p>

            <button className="w-full bg-red-500 text-white text-xs py-3 rounded">
              Learn More
            </button>

            <span className="absolute  right-4 bottom-5 bg-white/30 text-white font-semibold text-[10px] px-3 py-[4px] rounded">

              Ad
            </span>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default CopyGeneratePreview;

/* ================= HELPERS ================= */

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <h3 className="text-sm font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

const Field: React.FC<{
  label: string;
  value: string;
  limit: number;
  textarea?: boolean;
}> = ({ label, value, limit, textarea }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    {textarea ? (
      <textarea
        value={value}
        readOnly
        className="w-full rounded-lg border px-3 py-2 text-sm bg-gray-50"
      />
    ) : (
      <input
        value={value}
        readOnly
        className="w-full rounded-lg border px-3 py-2 text-sm bg-gray-50"
      />
    )}
    <p className="text-xs text-gray-400">
      {value.length}/{limit} characters
    </p>
  </div>
);
