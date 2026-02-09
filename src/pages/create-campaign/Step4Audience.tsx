import React, { useState, useMemo, useEffect } from "react";
import Icon from "../../assets/Icon.svg";
import { useCampaignStep } from "../../../src/pages/create-campaign/CampaignContext";

type GenderType = "all" | "male" | "female";

const Step4Audience: React.FC = () => {
  const { stepData, updateStepData, isStepValid } = useCampaignStep(4);
  
  // Type assertion for TypeScript
  const step4Data = stepData as {
    min_age: number;
    max_age: number;
    audienceAge: [number, number];
    audienceGender: string[];
    audienceInterests: string[];
    audienceLocation: string;
    audienceLanguages: string[];
    audienceBehaviors: string[];
  };

  // Local state
  const [minAge, setMinAge] = useState<number>(step4Data.min_age || 18);
  const [maxAge, setMaxAge] = useState<number>(step4Data.max_age || 65);
  const [gender, setGender] = useState<GenderType>(() => {
    if (step4Data.audienceGender.includes('all')) return 'all';
    if (step4Data.audienceGender.includes('male')) return 'male';
    if (step4Data.audienceGender.includes('female')) return 'female';
    return 'all';
  });
  const [location, setLocation] = useState<string>(step4Data.audienceLocation || "");
  const [interests, setInterests] = useState<string>(step4Data.audienceInterests.join(", ") || "");

  // Update local state when context data changes
  useEffect(() => {
    console.log("🔄 Step4Audience: Context data updated", step4Data);
    
    // ✅ min_age এবং max_age আলাদাভাবে সেট করুন
    setMinAge(step4Data.min_age || 18);
    setMaxAge(step4Data.max_age || 65);
    
    // Gender সেট
    if (step4Data.audienceGender.includes('all')) setGender('all');
    else if (step4Data.audienceGender.includes('male')) setGender('male');
    else if (step4Data.audienceGender.includes('female')) setGender('female');
    
    // Location এবং Interests সেট
    setLocation(step4Data.audienceLocation || "");
    setInterests(step4Data.audienceInterests.join(", ") || "");
    
    logAllData();
  }, [step4Data]);

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

  // Function to log all data
  const logAllData = () => {
    console.log("📊 Step4Audience - ALL DATA:", {
      min_age: minAge,
      max_age: maxAge,
      audienceGender: gender === 'all' ? ['all'] : [gender],
      audienceLocation: location,
      audienceInterests: interests.split(",").map(i => i.trim()).filter(i => i.length > 0),
      isValid: isStepValid()
    });
    
    // ✅ API-তে কী যাবে তা দেখান
    console.log("🎯 API-তে পাঠানো হবে:", {
      min_age: minAge,
      max_age: maxAge,
      gender: gender === 'all' ? 'all' : gender,
      locations: [location],
      keywords: interests
    });
  };

  // ✅ Handle changes for min_age
  const handleMinAgeChange = (age: number) => {
    setMinAge(age);
    setTimeout(() => {
      updateStepData({
        min_age: age,
        max_age: maxAge, // maxAge আগের মতো রাখুন
        audienceAge: [age, maxAge] // compatibility জন্য
      });
    }, 300);
  };

  // ✅ Handle changes for max_age
  const handleMaxAgeChange = (ageString: string) => {
    const age = ageString === "60+" ? 65 : parseInt(ageString);
    setMaxAge(age);
    setTimeout(() => {
      updateStepData({
        min_age: minAge, // minAge আগের মতো রাখুন
        max_age: age,
        audienceAge: [minAge, age] // compatibility জন্য
      });
    }, 300);
  };

  // Handle gender change
  const handleGenderChange = (g: GenderType) => {
    setGender(g);
    setTimeout(() => {
      updateStepData({
        audienceGender: g === 'all' ? ['all'] : [g]
      });
    }, 300);
  };

  // Handle location change
  const handleLocationChange = (loc: string) => {
    setLocation(loc);
    setTimeout(() => {
      updateStepData({
        audienceLocation: loc
      });
    }, 500);
  };

  // Handle interests change
  const handleInterestsChange = (interestStr: string) => {
    setInterests(interestStr);
    setTimeout(() => {
      updateStepData({
        audienceInterests: interestStr.split(",").map(i => i.trim()).filter(i => i.length > 0)
      });
    }, 500);
  };

  // Age options
  const minAgeOptions = [18, 19, 20, 21, 22, 23, 24, 25];
  const maxAgeOptions = ["30", "40", "50", "60+"];

  // Initial console log when component mounts
  useEffect(() => {
    console.log("🚀 Step4Audience Component Mounted");
    console.log("📦 Step4Audience - Initial Data from Context:", step4Data);
    console.log("✅ Step4Audience - Initial Validation:", isStepValid());
    
    // Log all data
    logAllData();
  }, []);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Target Audience</h2>
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
            onChange={(e) => handleMinAgeChange(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {minAgeOptions.map((age) => (
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
            value={maxAge === 65 ? "60+" : maxAge.toString()}
            onChange={(e) => handleMaxAgeChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {maxAgeOptions.map((age) => (
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
                type="button"
                onClick={() => handleGenderChange(g)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium border transition
                  ${
                    gender === g
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                {g === "all" ? "All Genders" : 
                 g === "male" ? "Male" : "Female"}
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
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Location</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="India">India</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
          </select>
         
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
          onChange={(e) => handleInterestsChange(e.target.value)}
          placeholder="e.g., Happy, Sad, Crazy, Technology, Sports"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
     
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

export default Step4Audience;