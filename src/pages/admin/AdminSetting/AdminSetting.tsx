import React, { useState } from "react";
import {
  ShieldCheck,
  Bell,
  Settings as SettingsIcon,
} from "lucide-react";
import General from "./General";
import Security from "./Security";
import SettingNotification from "./SettingNotification";



type AdminSettingsTab =
  | "general"
  | "security"
  | "notifications";


const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] =
    useState<AdminSettingsTab>("general");

  return (
    <div className="space-y-6 mt-5">
     
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Admin Settings
        </h1>
        <p className="text-sm text-slate-500">
          Configure platform-wide settings
        </p>
      </div>


      <div className="flex gap-2 rounded-xl border bg-white p-2 w-fit">
        <TabButton
          active={activeTab === "general"}
          icon={<SettingsIcon size={16} />}
          label="General"
          onClick={() => setActiveTab("general")}
        />

        <TabButton
          active={activeTab === "security"}
          icon={<ShieldCheck size={16} />}
          label="Security"
          onClick={() => setActiveTab("security")}
        />

        <TabButton
          active={activeTab === "notifications"}
          icon={<Bell size={16} />}
          label="Notifications"
          onClick={() => setActiveTab("notifications")}
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="rounded-xl border bg-white p-6">
        {activeTab === "general" && <General />}

        {activeTab === "security" && <Security />}

        {activeTab === "notifications" && (
          <SettingNotification />
        )}
      </div>
    </div>
  );
};

export default AdminSettings;


type TabButtonProps = {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const TabButton: React.FC<TabButtonProps> = ({
  active,
  icon,
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition
        ${
          active
            ? "bg-blue-50 text-blue-600"
            : "text-slate-500 hover:bg-slate-50"
        }`}
    >
      {icon}
      {label}
    </button>
  );
};
