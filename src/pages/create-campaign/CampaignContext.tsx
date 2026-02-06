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
  audienceAge: [number, number];
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
}

interface Step7Data {
  reviewNotes: string;
  termsAccepted: boolean;
  campaignStatus: 'draft' | 'ready' | 'published';
  publishDate?: string;
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
    audienceAge: [18, 65],
    audienceGender: ['male', 'female'],
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
    callToAction: 'Learn More',
    destinationUrl: '',
    brandName: '',
    primaryText: ''
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
        return {
          ...initialCampaignData,
          ...parsedData,
          metadata: {
            ...initialCampaignData.metadata,
            ...parsedData.metadata,
            updatedAt: new Date().toISOString()
          }
        };
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
      
      console.log(`📝 Campaign Context: Updated ${step}`, data);
      console.log('📊 Campaign Context: Full data after update:', updatedData);
      
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
  };

  const getAllCampaignData = () => {
    console.log('📋 Campaign Context: Getting all campaign data');
    return campaignData;
  };

  const getStepData = <K extends keyof CampaignData>(step: K) => {
    return campaignData[step];
  };

  const clearCampaignData = () => {
    console.log('🗑️ Campaign Context: Clearing all campaign data');
    setCampaignData(initialCampaignData);
    localStorage.removeItem(CAMPAIGN_STORAGE_KEY);
  };

  const loadCampaignData = (data: Partial<CampaignData>) => {
    console.log('📥 Campaign Context: Loading external campaign data');
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
    
    switch (step) {
      case 'step1':
        return (stepData as Step1Data).campaignName.trim().length > 0;
      
      case 'step2':
        return (stepData as Step2Data).selectedPlatforms.length > 0;
      
      case 'step3':
        return (stepData as Step3Data).objective.trim().length > 0;
      
      case 'step4':
        return (stepData as Step4Data).audienceLocation.trim().length > 0;
      
      case 'step5':
        return (stepData as Step5Data).budget > 0;
      
      case 'step6':
        const step6Data = stepData as Step6Data;
        return step6Data.headline.trim().length > 0 && 
               step6Data.description.trim().length > 0;
      
      case 'step7':
        return (stepData as Step7Data).termsAccepted === true;
      
      default:
        return false;
    }
  };

  const validateAllSteps = () => {
    const steps = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7'] as const;
    const validationResults: Record<keyof CampaignData, boolean> = {} as Record<keyof CampaignData, boolean>;
    
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
    return JSON.stringify(exportData, null, 2);
  };

  const importCampaignData = (jsonString: string): boolean => {
    try {
      const importedData = JSON.parse(jsonString);
      loadCampaignData(importedData);
      console.log('📤 Campaign Context: Data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Campaign Context: Error importing data:', error);
      return false;
    }
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
    importCampaignData
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
  
  return {
    stepData: context.campaignData[stepKey],
    updateStepData: (data: Partial<CampaignData[typeof stepKey]>) => 
      context.updateCampaignData(stepKey, data),
    isStepValid: () => context.isStepValid(stepKey),
    ...context
  };
};

// Hook for step navigation
export const useCampaignNavigation = () => {
  const { updateCampaignMetadata, campaignData } = useCampaign();
  
  const goToStep = (step: number) => {
    if (step >= 1 && step <= campaignData.metadata.totalSteps) {
      updateCampaignMetadata({ currentStep: step });
      console.log(`🚀 Campaign Navigation: Moving to step ${step}`);
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