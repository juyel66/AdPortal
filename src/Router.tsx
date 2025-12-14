import { createBrowserRouter, Navigate } from "react-router-dom";

import Home from "./pages/Home/Home";



// pages
import UserDashboard from "./pages/Dashboard/UserDashboard/UserDashboard/Dashboard";
import DashboardLayout from "./DashboardLayout";
import Campaigns from "./pages/Dashboard/UserDashboard/Campaigns/Campaigns";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
        element: <Campaigns />
      },
      {
      }



    ],
  },





]);
