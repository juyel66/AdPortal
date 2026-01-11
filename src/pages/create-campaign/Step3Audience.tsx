import React, { useState, useMemo } from "react";
import Icon from "../../assets/Icon.svg";

type GenderType = "all" | "male" | "female";

const Step3Audience: React.FC = () => {
  const [minAge, setMinAge] = useState<number>(19);
  const [maxAge, setMaxAge] = useState<string>("60+");
  const [gender, setGender] = useState<GenderType>("all");
  const [location, setLocation] = useState<string>("United States");
  const [interests, setInterests] = useState<string>("");


  const estimatedReach = useMemo(() => {
    let baseMin = 630;
    let baseMax = 960;

    if (gender !== "all") {
      baseMin -= 50;
      baseMax -= 80;
    }

    if (interests.length > 10) {
      baseMin += 150;
      baseMax += 290;
    }

    return {
      min: `${baseMin}K`,
      max: `${baseMax}K`,
      progress: Math.min(90, Math.max(40, baseMin / 10)),
    };
  }, [gender, interests]);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Target Audience
        </h2>
        <p className="text-sm text-gray-500">
          Define who you want to reach with your campaign
        </p>
      </div>

  

      {/* Age Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Minimum Age
          </label>
          <select
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[18, 19, 20, 21, 22, 23].map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Maximum Age
          </label>
          <select
            value={maxAge}
            onChange={(e) => setMaxAge(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {["40", "50", "60+"].map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gender + Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Gender */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Gender
          </label>
          <div className="flex gap-2">
            {(["all", "male", "female"] as GenderType[]).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium border transition
                  ${
                    gender === g
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Locations
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Separate multiple locations with commas
          </p>
        </div>
      </div>

      {/* Interests */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Interests & Behaviors
        </label>
        <input
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="e.g., fitness, technology, fashion, online shopping"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          Enter interests separated by commas
        </p>
      </div>

      {/* Estimated Reach */}
      <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-gray-500">Estimated Daily Reach</p>
            <p className="text-lg font-semibold text-gray-900">
              {estimatedReach.min} - {estimatedReach.max}
            </p>
          </div>

          <div
            className="
              w-16 h-16 rounded-2xl flex items-center justify-center
              bg-gradient-to-b from-blue-500 to-blue-300 shadow-md
            "
          >
            <img src={Icon} alt="icon" className="w-8 h-8" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${estimatedReach.progress}%` }}
          />
        </div>

        <p className="text-xs text-gray-500">
          ✓ Your audience size is optimal for this campaign
        </p>
      </div>
    </div>
  );
};

export default Step3Audience;
