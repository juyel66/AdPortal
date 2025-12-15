import React from "react";

interface PlacementItem {
  label: string;
  value: string;
  percent: number;
}

const placements: PlacementItem[] = [
  {
    label: "Meta - Feed",
    value: "125K",
    percent: 100,
  },
  {
    label: "Meta - Stories",
    value: "78K",
    percent: 62,
  },
  {
    label: "Google - Search",
    value: "42K",
    percent: 34,
  },
];

const AudienceAndPlacements: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* ================= Audience Targeting ================= */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Audience Targeting
        </h2>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-xs text-slate-500">Location</p>
            <p className="font-medium text-slate-900">
              United States, Canada, United Kingdom
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Age Range</p>
            <p className="font-medium text-slate-900">25-44</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Gender</p>
            <p className="font-medium text-slate-900">All</p>
          </div>

          <div>
            <p className="mb-2 text-xs text-slate-500">
              Interests
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Shopping",
                "Fashion",
                "Online Shopping",
                "Retail",
              ].map((interest) => (
                <span
                  key={interest}
                  className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= Placements ================= */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Placements
        </h2>

        <div className="space-y-5">
          {placements.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-slate-700">
                  {item.label}
                </span>
                <span className="text-slate-500">
                  {item.value}
                </span>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudienceAndPlacements;
