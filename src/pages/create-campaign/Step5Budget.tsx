import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useCampaignStep } from "../../../src/pages/create-campaign/CampaignContext"; 

type BudgetType = "Onetime" | "lifetime";

const Step5Budget: React.FC = () => {
  // Step 5 data from campaign context
  const { stepData, updateStepData, isStepValid } = useCampaignStep(5);
  
  // Type assertion for TypeScript
  const step5Data = stepData as {
    budget: number;
    budget_type: 'daily' | 'lifetime';
    schedule: {
      startDate: string;
      endDate: string;
      isScheduled: boolean;
    };
    biddingStrategy: string;
    optimizationGoal: string;
  };

  // Local state for form inputs
  const [localBudget, setLocalBudget] = useState<number>(step5Data.budget);
  const [localBudgetType, setLocalBudgetType] = useState<'daily' | 'lifetime'>(step5Data.budget_type);
  const [localStartDate, setLocalStartDate] = useState<string>(step5Data.schedule.startDate);
  const [localEndDate, setLocalEndDate] = useState<string>(step5Data.schedule.endDate);
  const [localRunContinuously, setLocalRunContinuously] = useState<boolean>(step5Data.schedule.isScheduled);


  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };


  const getDefaultEndDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };


  useEffect(() => {
    if (!localStartDate) {
      const currentDate = getCurrentDate();
      setLocalStartDate(currentDate);
      updateStepData({
        schedule: {
          ...step5Data.schedule,
          startDate: currentDate
        }
      });
    }

    
    
    if (!localEndDate && !localRunContinuously) {
      const defaultEndDate = getDefaultEndDate();
      setLocalEndDate(defaultEndDate);
      updateStepData({
        schedule: {
          ...step5Data.schedule,
          endDate: defaultEndDate
        }
      });
    }
  }, []);


  useEffect(() => {
    console.log("🔄 Step5Budget: Context data updated", step5Data);
    setLocalBudget(step5Data.budget);
    setLocalBudgetType(step5Data.budget_type);
    setLocalStartDate(step5Data.schedule.startDate);
    setLocalEndDate(step5Data.schedule.endDate);
    setLocalRunContinuously(step5Data.schedule.isScheduled);
    
  
    logAllData();
  }, [step5Data]);


  const logAllData = () => {
    console.log("📊 Step5Budget - ALL DATA:", {
      budget: step5Data.budget,
      budget_type: step5Data.budget_type,
      schedule: step5Data.schedule,
      biddingStrategy: step5Data.biddingStrategy,
      optimizationGoal: step5Data.optimizationGoal,
      isValid: isStepValid()
    });
  };


  const updateCampaignData = (field: string, value: any) => {
    console.log(`📝 Step5Budget: Updating ${field} to`, value);
    
    if (field === 'budget') {
      updateStepData({ budget: value });
    } else if (field === 'budget_type') {
      updateStepData({ budget_type: value });
    } else if (field === 'startDate') {
      updateStepData({
        schedule: {
          ...step5Data.schedule,
          startDate: value
        }
      });
    } else if (field === 'endDate') {
      updateStepData({
        schedule: {
          ...step5Data.schedule,
          endDate: value
        }
      });
    } else if (field === 'isScheduled') {
      updateStepData({
        schedule: {
          ...step5Data.schedule,
          isScheduled: value,
          endDate: value ? '' : step5Data.schedule.endDate
        }
      });
    }
    
    
    setTimeout(() => {
      logAllData();
    }, 100);
  };


  const handleBudgetTypeChange = (type: BudgetType) => {
    setLocalBudgetType(type);
    updateCampaignData('budget_type', type);
  };


  const handleBudgetChange = (amount: number) => {
    setLocalBudget(amount);
    updateCampaignData('budget', amount);
  };

  // Handle start date change
  const handleStartDateChange = (date: string) => {
    setLocalStartDate(date);
    updateCampaignData('startDate', date);
  };

  // Handle end date change
  const handleEndDateChange = (date: string) => {
    setLocalEndDate(date);
    updateCampaignData('endDate', date);
  };


const handleRunContinuouslyToggle = () => {

  if (!localRunContinuously) return;


  setLocalRunContinuously(false);

  updateCampaignData('isScheduled', false);

  const defaultEndDate = getDefaultEndDate();
  setLocalEndDate(defaultEndDate);

  updateCampaignData('endDate', defaultEndDate);
};


  useEffect(() => {
    console.log("🚀 Step5Budget Component Mounted");
    console.log("📦 Step5Budget - Initial Data from Context:", step5Data);
    console.log("✅ Step5Budget - Initial Validation:", isStepValid());
    

    logAllData();
  }, []);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6">
  
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Budget & Schedule
        </h2>
        <p className="text-sm text-gray-500">
          Set your campaign budget and schedule
        </p>
      </div>

     
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Budget Type
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleBudgetTypeChange("daily")}
            className={`rounded-xl border p-4 text-left transition
              ${
                localBudgetType === "daily"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }
            `}
          >
            <p className="text-sm font-bold text-gray-900">Daily Budget</p>
            <p className="text-xs text-gray-500">Average amount per day</p>
          </button>

          <button
            type="button"
            onClick={() => handleBudgetTypeChange("lifetime")}
            className={`rounded-xl border p-4 text-left transition
              ${
                localBudgetType === "lifetime"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }
            `}
          >
            <p className="text-sm font-bold text-gray-900">Lifetime Budget</p>
            <p className="text-xs text-gray-500">Total for entire campaign</p>
          </button>
        </div>
      </div>

     
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          {localBudgetType === "daily" ? "Daily Budget" : "Lifetime Budget"}
        </label>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            $
          </span>
          <input
            type="number"
            value={localBudget}
            onChange={(e) => {
              const value = Number(e.target.value);
              handleBudgetChange(value);
            }}
            onBlur={(e) => {
              if (e.target.value === '' || Number(e.target.value) < 0) {
                handleBudgetChange(100);
              }
            }}
            className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="100"
            min="0"
            step="1"
          />
        </div>

        <p className="text-xs text-gray-400 mt-1">
          Recommended minimum: $20/day
        </p>
      </div>


      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Campaign Schedule
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={localStartDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              min={getCurrentDate()}
            />
          </div>

         
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={localEndDate}
              disabled={localRunContinuously}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className={`w-full rounded-lg border pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 cursor-pointer
                ${
                  localRunContinuously
                    ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                    : "border-gray-300 focus:ring-blue-500"
                }
              `}
              min={localStartDate || getCurrentDate()}
            />
          </div>
        </div>

   
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={localRunContinuously}
            onChange={handleRunContinuouslyToggle}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          Run continuously (no end date)
        </label>
      </div>

  
      <div className="rounded-xl border border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Budget Summary
            </p>
            <p className="text-xs text-gray-500">
              {localBudgetType === "daily" ? "Daily Budget" : "Lifetime Budget"}
            </p>
          </div>

          <p className="text-lg font-semibold text-gray-900">${localBudget}</p>
        </div>
      </div>

      
      
    </div>
  );
};

export default Step5Budget;