import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import "./index.css";
import { router } from "./Router";
import { store } from "./store";
import { Toaster } from "./components/ui/sonner";
import { CampaignProvider } from "../src/pages/create-campaign/CampaignContext"; 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <CampaignProvider> 
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </CampaignProvider> 
    </Provider>
  </StrictMode>
);