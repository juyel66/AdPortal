import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";


import "./index.css";

import { store } from "./store";
import { Toaster } from "./components/ui/sonner";
import { CampaignProvider } from "../src/pages/create-campaign/CampaignContext"; 
import { RootWraper } from "./wrapper";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <CampaignProvider> 
        <RootWraper />

        <Toaster position="top-center" />
      </CampaignProvider> 
    </Provider>
  </StrictMode>
);