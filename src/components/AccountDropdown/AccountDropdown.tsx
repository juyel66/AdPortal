import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Business = {
  id: string;
  name: string;
  assets: number;
  initial: string;
};



const businesses: Business[] = [
  { id: "1", name: "AdPortal", assets: 0, initial: "A" },
  { id: "2", name: "BrandHub", assets: 0, initial: "B" },
  { id: "3", name: "ClientConnect", assets: 0, initial: "C" },
];

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative px-4 mt-2 ">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center cursor-pointer justify-between rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
      >
        <div className="flex items-center gap-2 ">
          <img
            src="https://avatars.githubusercontent.com/u/155250069?v=4"
            alt="user"
            className="h-7 w-7 rounded-full"
          />
          <span>Account</span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-4 right-4 top-[52px] z-50 rounded-xl   bg-white  shadow-xl">
          {/* Search */}
          {/* <div className="mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-500">
            <Search className="h-4 w-4" />
            <input
              placeholder="Search for a business asset..."
              className="w-full outline-none"
            />
          </div> */}

          {/* Business Portfolios */}
          <div className="bg-[#EBF3FE] p-2 rounded-b-xl   ">
            <div className="mb-2 text-lg font-semibold text-gray-700">
              Business portfolios
            </div>

            <div className="space-y-1 ">
              {businesses.map((b) => (
                <div
                  key={b.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-100"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                    {b.initial}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">
                      {b.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {b.assets} business assets
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
                <p className="mt-2 font-semibold">Your Account </p>
            </div>

            {/* Current Account */}
            <div className="mt-1 rounded-xl bg-[#0F2A55] px-3 py-2 text-white">
              <div className="flex items-center gap-3">
                <img
                  src="https://avatars.githubusercontent.com/u/155250069?v=4"
                  className="h-8 w-8 rounded-full"
                />
                <div>
                  <div className="text-sm font-medium">ClientConnect</div>
                  <div className="text-xs text-blue-200">1 business assets</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
