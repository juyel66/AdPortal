import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import { toast } from "sonner";

const BusinessInfo: React.FC = () => {
  const [form, setForm] = useState({
    companyName: "",
    website: "",
    industry: "",
    companySize: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState(false);
  const [initialForm, setInitialForm] = useState({
    companyName: "",
    website: "",
    industry: "",
    companySize: "",
  });

  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    const getOrgIdFromLocalStorage = () => {
      const selectedOrg = localStorage.getItem("selectedOrganization");
      if (selectedOrg) {
        try {
          const parsed = JSON.parse(selectedOrg);
          if (parsed?.id) {
            setOrganizationId(parsed.id);
            return parsed.id;
          }
        } catch (error) {
          console.error("Error parsing selected organization:", error);
        }
      }
      return null;
    };

    const orgId = getOrgIdFromLocalStorage();
    if (orgId) {
      fetchOrganizationData(orgId);
    }
  }, []);

  const fetchOrganizationData = async (orgId: string) => {
    try {
      setFetching(true);
      const response = await api.get(`/main/organization?org_id=${orgId}`);
     
      
      const orgData = response.data;
      
      const formattedData = {
        companyName: orgData.name || "",
        website: orgData.website || "",
        industry: orgData.industry || "",
        companySize: orgData.company_size || "",
      };
      
      setForm(formattedData);
      setInitialForm(formattedData);
    } catch (error) {
      console.error("Error fetching organization data:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!organizationId) return;
    
    try {
      setLoading(true);
      
      const updateData = {
        name: form.companyName,
        website: form.website,
        industry: form.industry,
        company_size: form.companySize,
      };

      await api.patch(`/main/organization/?org_id=${organizationId}`, updateData);
      
      setEditing(false);
      setInitialForm(form);
      toast.success("Business information updated successfully!");
      
    } catch (error) {
      console.error("Error updating organization data:", error);
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditing(false);
  };

  const hasChanges = () => {
    return (
      form.companyName !== initialForm.companyName ||
      form.website !== initialForm.website ||
      form.industry !== initialForm.industry ||
      form.companySize !== initialForm.companySize
    );
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  if (fetching) {
    return (
      <div className="rounded-xl bg-white p-6">
        <div className="flex justify-center items-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-slate-900">
          Business Information
        </h2>
        
        {!editing && (
          <button
            onClick={handleEditClick}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Edit Business Info
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            disabled={!editing}
            className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Website
          </label>
          <input
            type="url"
            name="website"
            placeholder="https://yourcompany.com"
            value={form.website}
            onChange={handleChange}
            disabled={!editing}
            className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Industry
          </label>
          <select
            name="industry"
            value={form.industry}
            onChange={handleChange}
            disabled={!editing}
            className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <option value="" disabled>
              Select industry
            </option>
            <option value="ecommerce">E-Commerce</option>
            <option value="saas">SaaS</option>
            <option value="agency">Agency</option>
            <option value="education">Education</option>
            <option value="finance">Finance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Company Size
          </label>
          <select
            name="companySize"
            value={form.companySize}
            onChange={handleChange}
            disabled={!editing}
            className="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <option value="" disabled>
              Select company size
            </option>
            <option value="1-10">1–10 employees</option>
            <option value="11-50">11–50 employees</option>
            <option value="51-200">51–200 employees</option>
            <option value="201-500">201–500 employees</option>
            <option value="500+">500+ employees</option>
          </select>
        </div>
      </div>

      {editing && (
        <>
          <div className="my-6 border-t" />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading || !hasChanges()}
              className={`rounded-lg px-5 py-2 text-sm font-medium transition flex items-center gap-2 ${
                hasChanges() 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              {loading && (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
              )}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessInfo;