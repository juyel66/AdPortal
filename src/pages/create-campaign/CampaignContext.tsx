import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Type definitions for platforms
export type PlatformKey = "facebook" | "google" | "tiktok" | "instagram" | "linkedin" | "twitter" | "pinterest";

export interface PlatformItem {
  key: PlatformKey;
  name: string;
  description: string;
  connected: boolean;
  logo: string;
}

// Step-specific interfaces
interface Step1Data {
  campaignName: string;
}

interface Step2Data {
  platforms: PlatformItem[];
  selectedPlatforms: PlatformKey[];
}

interface Step3Data {
  objective: string;
  targetAudience: string;
  kpis: string[];
}

interface Step4Data {
  min_age: number;           // ✅ নতুন: API-তে পাঠানোর জন্য
  max_age: number;           // ✅ নতুন: API-তে পাঠানোর জন্য
  audienceAge: [number, number]; // পুরানো (compatibility জন্য)
  audienceGender: string[];
  audienceInterests: string[];
  audienceLocation: string;
  audienceLanguages: string[];
  audienceBehaviors: string[];
}

interface Step5Data {
  budget: number;
  budgetType: 'daily' | 'lifetime';
  schedule: {
    startDate: string;
    endDate: string;
    isScheduled: boolean;
  };
  biddingStrategy: string;
  optimizationGoal: string;
}

interface Step6Data {
  creativeType: 'image' | 'video' | 'carousel' | 'collection';
  creativeAssets: string[];
  headline: string;
  description: string;
  callToAction: string;
  destinationUrl: string;
  brandName: string;
  primaryText: string;
  adName: string;           // ✅ নতুন: API-তে পাঠানোর জন্য
  product: string;          // ✅ নতুন: AI জেনারেট করার জন্য
  audience: string;         // ✅ নতুন: AI জেনারেট করার জন্য
  benefits: string;         // ✅ নতুন: AI জেনারেট করার জন্য
  tone: string;            // ✅ নতুন: AI জেনারেট করার জন্য
  uploadedFile: string;    // ✅ নতুন: আপলোড করা ফাইল
}

interface Step7Data {
  reviewNotes: string;
  termsAccepted: boolean;
  campaignStatus: 'draft' | 'ready' | 'published';
  publishDate?: string;
}

// API ফরম্যাটের জন্য Type
export interface ApiCampaignData {
  platforms: string[];
  campaign_name: string;
  objective: string;
  budgets: Array<{
    platform: string;
    budget_type: string;
    start_date: string;
    end_date: string;
    budget: number;
    run_continuously: boolean;
  }>;
  min_age: number;
  max_age: number;
  gender: string;
  locations: string[];
  keywords: string;
  ad_name: string;
  headline: string;
  primary_text: string;
  description: string;
  call_to_action: string;
  destination_url: string;
}

// Main Campaign Data interface
interface CampaignData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;
  step6: Step6Data;
  step7: Step7Data;
  metadata: {
    createdAt: string;
    updatedAt: string;
    campaignId?: string;
    userId?: string;
    totalSteps: number;
    currentStep: number;
  };
}

// Context interface
interface CampaignContextType {
  campaignData: CampaignData;
  updateCampaignData: <K extends keyof CampaignData>(step: K, data: Partial<CampaignData[K]>) => void;
  updateCampaignMetadata: (metadata: Partial<CampaignData['metadata']>) => void;
  getAllCampaignData: () => CampaignData;
  getStepData: <K extends keyof CampaignData>(step: K) => CampaignData[K];
  clearCampaignData: () => void;
  loadCampaignData: (data: Partial<CampaignData>) => void;
  isStepValid: (step: keyof CampaignData) => boolean;
  validateAllSteps: () => Record<keyof CampaignData, boolean>;
  exportCampaignData: () => string;
  importCampaignData: (jsonString: string) => boolean;
  getApiFormattedData: () => ApiCampaignData; // ✅ নতুন: API ফরম্যাটে ডেটা পাওয়ার জন্য
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

// Platform definitions
const defaultPlatforms: PlatformItem[] = [
  {
    key: "facebook",
    name: "Meta (Facebook)",
    description: "Reach billions of users across Facebook and Instagram",
    connected: true,
    logo: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_10_m3mnnq.png",
  },
  {
    key: "google",
    name: "Google Ads",
    description: "Show ads on Google Search, YouTube, and Display Network",
    connected: true,
    logo: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_11_bdja1x.png",
  },
  {
    key: "tiktok",
    name: "TikTok Ads",
    description: "Engage with Gen Z and millennials on TikTok",
    connected: true,
    logo: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765754457/Container_12_siwhfp.png",
  },
  {
    key: "linkedin",
    name: "LinkedIn Ads",
    description: "Reach professionals and B2B audiences",
    connected: false,
    logo: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
  },
  {
    key: "twitter",
    name: "Twitter (X) Ads",
    description: "Engage with real-time conversations and trends",
    connected: false,
    logo: "https://cdn-icons-png.flaticon.com/512/124/124021.png",
  },
];

// Initial data structure
const initialCampaignData: CampaignData = {
  step1: { 
    campaignName: '' 
  },
  step2: { 
    platforms: defaultPlatforms,
    selectedPlatforms: ["google", "tiktok"]
  },
  step3: { 
    objective: '',
    targetAudience: '',
    kpis: []
  },
  step4: { 
    min_age: 18,                    
    max_age: 65,                     
    audienceAge: [18, 65],
    audienceGender: ['all'],
    audienceInterests: [],
    audienceLocation: '',
    audienceLanguages: ['en'],
    audienceBehaviors: []
  },
  step5: { 
    budget: 100,
    budgetType: 'daily',
    schedule: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isScheduled: false
    },
    biddingStrategy: 'lowest_cost',
    optimizationGoal: 'conversions'
  },
  step6: { 
    creativeType: 'image',
    creativeAssets: [],
    headline: '',
    description: '',
    callToAction: 'Shop now',
    destinationUrl: '',
    brandName: '',
    primaryText: '',
    adName: '',            
    product: '',           
    audience: '',          
    benefits: '',          
    tone: 'Professional',  
    uploadedFile: ''       
  },
  step7: { 
    reviewNotes: '',
    termsAccepted: false,
    campaignStatus: 'draft',
    publishDate: undefined
  },
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    campaignId: undefined,
    userId: undefined,
    totalSteps: 7,
    currentStep: 1
  }
};

// Local Storage key
const CAMPAIGN_STORAGE_KEY = 'campaign_builder_data';

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from localStorage on initial render
  const [campaignData, setCampaignData] = useState<CampaignData>(() => {
    try {
      const savedData = localStorage.getItem(CAMPAIGN_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('📂 Campaign Context: Data loaded from localStorage');
        
        // Merge with initial data, ensuring all fields exist
        const mergedData = {
          ...initialCampaignData,
          step1: { ...initialCampaignData.step1, ...parsedData.step1 },
          step2: { 
            ...initialCampaignData.step2, 
            platforms: parsedData.step2?.platforms || initialCampaignData.step2.platforms,
            selectedPlatforms: parsedData.step2?.selectedPlatforms || initialCampaignData.step2.selectedPlatforms
          },
          step3: { ...initialCampaignData.step3, ...parsedData.step3 },
          step4: { 
            ...initialCampaignData.step4, 
            ...parsedData.step4,
            // ✅ min_age এবং max_age সেট করুন যদি না থাকে
            min_age: parsedData.step4?.min_age || initialCampaignData.step4.min_age,
            max_age: parsedData.step4?.max_age || initialCampaignData.step4.max_age
          },
          step5: { 
            ...initialCampaignData.step5, 
            ...parsedData.step5,
            schedule: {
              ...initialCampaignData.step5.schedule,
              ...parsedData.step5?.schedule
            }
          },
          step6: { 
            ...initialCampaignData.step6, 
            ...parsedData.step6,
            // ✅ নতুন ফিল্ডগুলো সেট করুন
            adName: parsedData.step6?.adName || initialCampaignData.step6.adName,
            product: parsedData.step6?.product || initialCampaignData.step6.product,
            audience: parsedData.step6?.audience || initialCampaignData.step6.audience,
            benefits: parsedData.step6?.benefits || initialCampaignData.step6.benefits,
            tone: parsedData.step6?.tone || initialCampaignData.step6.tone,
            uploadedFile: parsedData.step6?.uploadedFile || initialCampaignData.step6.uploadedFile
          },
          step7: { ...initialCampaignData.step7, ...parsedData.step7 },
          metadata: {
            ...initialCampaignData.metadata,
            ...parsedData.metadata,
            updatedAt: new Date().toISOString()
          }
        };
        
        console.log('📦 Campaign Context: Merged data:', mergedData);
        return mergedData;
      }
    } catch (error) {
      console.error('❌ Campaign Context: Error loading from localStorage:', error);
    }
    return initialCampaignData;
  });

  // Save to localStorage whenever campaignData changes
  useEffect(() => {
    try {
      localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(campaignData));
      console.log('💾 Campaign Context: Data saved to localStorage');
      console.log('📋 Campaign Context: Current data structure:', campaignData);
    } catch (error) {
      console.error('❌ Campaign Context: Error saving to localStorage:', error);
    }
  }, [campaignData]);

  const updateCampaignData = <K extends keyof CampaignData>(step: K, data: Partial<CampaignData[K]>) => {
    setCampaignData(prev => {
      const updatedData = {
        ...prev,
        [step]: { ...prev[step], ...data },
        metadata: {
          ...prev.metadata,
          updatedAt: new Date().toISOString()
        }
      };

      console.log(`🔄 Campaign Context: Updated ${step}`, data);
      console.log('📦 Campaign Context: Full data after update:', updatedData);
      
      // Specifically log Step5 data if it's step5
      if (step === 'step5') {
        console.log('💰 Step5 Data Details:', updatedData.step5);
      }
      
      return updatedData;
    });
  };

  const updateCampaignMetadata = (metadata: Partial<CampaignData['metadata']>) => {
    setCampaignData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        ...metadata,
        updatedAt: new Date().toISOString()
      }
    }));
    console.log('🔄 Campaign Context: Updated metadata', metadata);
  };

  const getAllCampaignData = () => {
    console.log('📋 Campaign Context: Getting all campaign data');
    console.log('📋 Campaign Context: Full data dump:', campaignData);
    return campaignData;
  };

  const getStepData = <K extends keyof CampaignData>(step: K) => {
    console.log(`📋 Campaign Context: Getting step ${step} data:`, campaignData[step]);
    return campaignData[step];
  };

  const clearCampaignData = () => {
    console.log('🗑️ Campaign Context: Clearing all campaign data');
    setCampaignData(initialCampaignData);
    localStorage.removeItem(CAMPAIGN_STORAGE_KEY);
  };

  const loadCampaignData = (data: Partial<CampaignData>) => {
    console.log('📥 Campaign Context: Loading external campaign data:', data);
    setCampaignData(prev => ({
      ...prev,
      ...data,
      metadata: {
        ...prev.metadata,
        ...data.metadata,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  const isStepValid = (step: keyof CampaignData): boolean => {
    const stepData = campaignData[step];
    console.log(`✅ Campaign Context: Validating step ${step}`, stepData);
    
    switch (step) {
      case 'step1':
        const isValid1 = (stepData as Step1Data).campaignName.trim().length > 0;
        console.log(`✅ Step1 validation: ${isValid1 ? 'VALID' : 'INVALID'}`);
        return isValid1;
      
      case 'step2':
        const isValid2 = (stepData as Step2Data).selectedPlatforms.length > 0;
        console.log(`✅ Step2 validation: ${isValid2 ? 'VALID' : 'INVALID'}`);
        return isValid2;
      
      case 'step3':
        const isValid3 = (stepData as Step3Data).objective.trim().length > 0;
        console.log(`✅ Step3 validation: ${isValid3 ? 'VALID' : 'INVALID'}`);
        return isValid3;
      
      case 'step4':
        const step4Data = stepData as Step4Data;
        // ✅ min_age এবং max_age validation
        const isMinAgeValid = step4Data.min_age >= 18 && step4Data.min_age <= 65;
        const isMaxAgeValid = step4Data.max_age >= step4Data.min_age && step4Data.max_age <= 100;
        const isLocationValid = step4Data.audienceLocation.trim().length > 0;
        
        const isValid4 = isMinAgeValid && isMaxAgeValid && isLocationValid;
        console.log(`✅ Step4 validation: ${isValid4 ? 'VALID' : 'INVALID'}`);
        console.log(`   Min Age: ${step4Data.min_age} (valid: ${isMinAgeValid})`);
        console.log(`   Max Age: ${step4Data.max_age} (valid: ${isMaxAgeValid})`);
        console.log(`   Location: "${step4Data.audienceLocation}" (valid: ${isLocationValid})`);
        return isValid4;
      
      case 'step5':
        const isValid5 = (stepData as Step5Data).budget > 0;
        console.log(`✅ Step5 validation: ${isValid5 ? 'VALID' : 'INVALID'}`);
        console.log(`✅ Step5 budget value: ${(stepData as Step5Data).budget}`);
        return isValid5;
      
      case 'step6':
        const step6Data = stepData as Step6Data;
        const isValid6 = step6Data.headline.trim().length > 0 && 
               step6Data.description.trim().length > 0;
        console.log(`✅ Step6 validation: ${isValid6 ? 'VALID' : 'INVALID'}`);
        return isValid6;
      
      case 'step7':
        const isValid7 = (stepData as Step7Data).termsAccepted === true;
        console.log(`✅ Step7 validation: ${isValid7 ? 'VALID' : 'INVALID'}`);
        return isValid7;
      
      default:
        console.log(`❌ Step ${step} validation: UNKNOWN STEP`);
        return false;
    }
  };

  const validateAllSteps = () => {
    const steps = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7'] as const;
    const validationResults: Record<keyof CampaignData, boolean> = {} as Record<keyof CampaignData, boolean>;
    
    console.log('✅ Campaign Context: Starting validation of all steps');
    
    steps.forEach(step => {
      validationResults[step] = isStepValid(step);
    });
    
    console.log('✅ Campaign Context: Step validation results', validationResults);
    return validationResults;
  };

  const exportCampaignData = (): string => {
    const exportData = {
      ...campaignData,
      metadata: {
        ...campaignData.metadata,
        exportedAt: new Date().toISOString()
      }
    };
    console.log('📤 Campaign Context: Exporting data', exportData);
    return JSON.stringify(exportData, null, 2);
  };

  const importCampaignData = (jsonString: string): boolean => {
    try {
      const importedData = JSON.parse(jsonString);
      console.log('📤 Campaign Context: Importing data', importedData);
      loadCampaignData(importedData);
      console.log('📤 Campaign Context: Data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Campaign Context: Error importing data:', error);
      return false;
    }
  };

  // ✅ নতুন: API ফরম্যাটে ডেটা কনভার্ট করার ফাংশন
  const getApiFormattedData = (): ApiCampaignData => {
    console.log("🎯 Campaign Context: Converting to API format");
    
    // Platform mapping
    const platformMapping: Record<string, string> = {
      "facebook": "META",
      "google": "GOOGLE",
      "tiktok": "TIKTOK",
      "instagram": "META",
      "linkedin": "LINKEDIN",
      "twitter": "TWITTER",
      "pinterest": "PINTEREST"
    };

    // Objective mapping
    const objectiveMapping: Record<string, string> = {
      "conversions": "CONVERSIONS",
      "traffic": "TRAFFIC",
      "awareness": "AWARENESS",
      "engagement": "ENGAGEMENT",
      "lead_generation": "LEAD_GENERATION",
      "app_promotion": "APP_PROMOTION"
    };

    // Budget type mapping
    const budgetTypeMapping: Record<string, string> = {
      "daily": "DAILY",
      "lifetime": "ONETIME"
    };

    // Gender mapping
    const genderMapping: Record<string, string> = {
      "all": "all",
      "male": "male",
      "female": "female"
    };

    // Step4-এর audienceGender array থেকে প্রথম gender নিন
    const selectedGender = campaignData.step4.audienceGender.length > 0 
      ? campaignData.step4.audienceGender[0] 
      : "all";

    const apiData: ApiCampaignData = {
      platforms: campaignData.step2.selectedPlatforms.map(
        (p: string) => platformMapping[p] || p.toUpperCase()
      ),
      campaign_name: campaignData.step1.campaignName,
      objective: objectiveMapping[campaignData.step3.objective] || 
                campaignData.step3.objective.toUpperCase(),
      budgets: campaignData.step2.selectedPlatforms.map((platform: string) => ({
        platform: platformMapping[platform] || platform.toUpperCase(),
        budget_type: budgetTypeMapping[campaignData.step5.budgetType] || "ONETIME",
        start_date: campaignData.step5.schedule.startDate,
        end_date: campaignData.step5.schedule.isScheduled ? "" : campaignData.step5.schedule.endDate,
        budget: campaignData.step5.budget,
        run_continuously: campaignData.step5.schedule.isScheduled
      })),
      // ✅ min_age এবং max_age আলাদা ফিল্ড হিসেবে
      min_age: campaignData.step4.min_age,
      max_age: campaignData.step4.max_age,
      gender: genderMapping[selectedGender] || "all",
      locations: campaignData.step4.audienceLocation 
        ? [campaignData.step4.audienceLocation]
        : [],
      keywords: campaignData.step4.audienceInterests.join(", "),
      ad_name: campaignData.step6.adName || campaignData.step6.headline,
      headline: campaignData.step6.headline,
      primary_text: campaignData.step6.primaryText,
      description: campaignData.step6.description,
      call_to_action: campaignData.step6.callToAction,
      destination_url: campaignData.step6.destinationUrl
    };

    console.log("📤 API Formatted Data:", apiData);
    return apiData;
  };

  const contextValue: CampaignContextType = {
    campaignData,
    updateCampaignData,
    updateCampaignMetadata,
    getAllCampaignData,
    getStepData,
    clearCampaignData,
    loadCampaignData,
    isStepValid,
    validateAllSteps,
    exportCampaignData,
    importCampaignData,
    getApiFormattedData // ✅ নতুন মেথড যোগ করুন
  };

  return (
    <CampaignContext.Provider value={contextValue}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within CampaignProvider');
  }
  return context;
};

// Custom hooks for specific steps
export const useCampaignStep = (stepNumber: number) => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaignStep must be used within CampaignProvider');
  }
  
  const stepKey = `step${stepNumber}` as keyof CampaignData;
  
  console.log(`🔍 useCampaignStep(${stepNumber}): Accessing ${stepKey}`, context.campaignData[stepKey]);
  
  return {
    stepData: context.campaignData[stepKey],
    updateStepData: (data: Partial<CampaignData[typeof stepKey]>) => {
      console.log(`🔧 useCampaignStep(${stepNumber}): Updating ${stepKey}`, data);
      return context.updateCampaignData(stepKey, data);
    },
    isStepValid: () => {
      const isValid = context.isStepValid(stepKey);
      console.log(`✅ useCampaignStep(${stepNumber}): Step ${stepNumber} validity: ${isValid}`);
      return isValid;
    },
    ...context
  };
};

// Hook for step navigation
export const useCampaignNavigation = () => {
  const { updateCampaignMetadata, campaignData } = useCampaign();
  
  const goToStep = (step: number) => {
    if (step >= 1 && step <= campaignData.metadata.totalSteps) {
      console.log(`🚀 Campaign Navigation: Moving to step ${step}`);
      updateCampaignMetadata({ currentStep: step });
    }
  };
  
  const nextStep = () => {
    if (campaignData.metadata.currentStep < campaignData.metadata.totalSteps) {
      goToStep(campaignData.metadata.currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (campaignData.metadata.currentStep > 1) {
      goToStep(campaignData.metadata.currentStep - 1);
    }
  };
  
  return {
    currentStep: campaignData.metadata.currentStep,
    totalSteps: campaignData.metadata.totalSteps,
    goToStep,
    nextStep,
    prevStep,
    canGoNext: campaignData.metadata.currentStep < campaignData.metadata.totalSteps,
    canGoPrev: campaignData.metadata.currentStep > 1
  };
};