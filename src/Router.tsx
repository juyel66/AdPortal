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


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
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
]);
