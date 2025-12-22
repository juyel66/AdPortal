import { createBrowserRouter, Navigate } from "react-router-dom";


// Dashboard
import UserDashboard from "./pages/Dashboard/UserDashboard/UserDashboard/Dashboard";
import DashboardLayout from "./DashboardLayout";

// Campaign pages
import Campaigns from "./pages/Dashboard/UserDashboard/Campaigns/Campaigns";

// Create Campaign (NEW)
import CreateCampaignLayout from "./pages/create-campaign/CreateCampaignLayout";
import Step1Platforms from "./pages/create-campaign/Step1Platforms";
import Step2Objective from "./pages/create-campaign/Step2Objective";
import Step3Audience from "./pages/create-campaign/Step3Audience";
import Step4Budget from "./pages/create-campaign/Step4Budget";
import Step5Creative from "./pages/create-campaign/Step5Creative";
import Step6Review from "./pages/create-campaign/Step6Review";
import CampaignsViewDetails from "./pages/Dashboard/UserDashboard/Campaigns/campaignsViewDetails/CampaignsViewDetails";
import Root from "./pages/Root";
import Home from "./pages/Home/Home";
import AiTools from "./components/AITools/AiTools";
import Analytics from "./components/Analytics/Analytics";
import Reports from "./components/Reports/Reports";
import Subscriptions from "./components/Analytics/Subscriptions/Subscriptions";
import Team from "./components/Team/Team";
import Settings from "./components/Settings/UserSettings";
import AdminDashboard from "./pages/admin/AdminDashboard/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement/UserManagement";
import CampaignMonitoring from "./pages/admin/CampaignMonitoring/CampaignMonitoring";
import ContentModeration from "./pages/admin/ContentModeration/ContentModeration";
import  Finance from "./pages/admin/Finance/Finance";
import PlatformAnalytics from "./pages/admin/PlatformAnalytics/PlatformAnalytics";
import AdminSetting from "./pages/admin/AdminSetting/AdminSetting";


import Location from "./Location/Location";
import AdminReports from "./pages/admin/AdminReport/AdminReports";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import ForgetPassword from "./components/Auth/ForgetPassword";
import CheckEmail from "./components/Auth/CheckEmail";
import NewPassword from "./components/Auth/NewPassword";
import HowItWorksPage from "./pages/Home/HowItWorksPage/HowItWorksPage";
import Pricing from "./pages/Home/Pricing/Pricing";
import FeaturesPage from "./pages/Home/Features.tsx/FeaturesPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";




export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "features",
        element: <FeaturesPage />,
      },
      {
        path: "how-it-works",
        element: <HowItWorksPage />,
      },
      {
        path: "pricing",
        element: <Pricing />,
      }
     
    ],
  },


    {
    path: "/auth",
    children: [
      {
        index: true,
        element: <Navigate to="signin" replace />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "forgot-password",
        element: <ForgetPassword />

      },
      {
        path: "check-email",
        element: <CheckEmail />
      },
      {
        path: "new-password",
        element: <NewPassword />
      },
      {
        path: "location",
        element: <Location></Location>
      }
    ],

    

  },

  {
    path: "/user-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <UserDashboard />,
      },
      {
        path: "campaigns",
        element: <Campaigns />,
      },
      {
        path: "campaigns-view-details",
        element: <CampaignsViewDetails />,
      },
      {
        path: "ai-tools",
        element: <AiTools />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "subscriptions",
        element: <Subscriptions />,
      },
      {
        path: "team",
        element: <Team />,
      },
      {
        path: "settings",
        element: <Settings />,
      },

    
      {
        path: "campaigns-create",
        element: <CreateCampaignLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="step-1" replace />,
          },
          {
            path: "step-1",
            element: <Step1Platforms />,
          },
          {
            path: "step-2",
            element: <Step2Objective />,
          },
          {
            path: "step-3",
            element: <Step3Audience />,
          },
          {
            path: "step-4",
            element: <Step4Budget />,
          },
          {
            path: "step-5",
            element: <Step5Creative />,
          },
          {
            path: "step-6",
            element: <Step6Review />,
          },
        ],
      },
    ],
  },


  {
    path: "/admin-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "campaigns-monitoring",
        element: <CampaignMonitoring />,
      },
      {
        path: "content-moderation",
        element: <ContentModeration />,
      },
      {
        path: "finance",
        element: <Finance />
      },
      {
        path: "platform-analytics",
        element: <PlatformAnalytics />
      },
      {
        path: "settings",
        element: <AdminSetting />
      },
      {
        path: "reports",
        element: <AdminReports />
      }
    ],
  },

]);
