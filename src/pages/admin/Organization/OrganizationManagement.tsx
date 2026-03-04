import React, { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  Users,
  Briefcase,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
  X,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../../lib/axios";

import type {
  Organization,
  OrganizationsResponse,
  OrganizationsFilters,
} from "./organizations";

// API function to fetch organizations
const fetchOrganizations = async (
  page: number = 1,
  search?: string
): Promise<OrganizationsResponse> => {
  let url = `/admin/organizations/?page=${page}`;
  
  if (search && search.trim()) {
    url += `&search=${encodeURIComponent(search.trim())}`;
  }
  
  const response = await api.get(url);
  return response.data;
};

// Helper function to format display values
const formatDisplayValue = (value: string | null): string => {
  if (!value || value.trim() === "") return "—";
  return value;
};

// Helper function to get industry badge color
const getIndustryColor = (industry: string | null): string => {
  if (!industry) return "bg-slate-100 text-slate-600";
  
  const colors: Record<string, string> = {
    saas: "bg-blue-100 text-blue-700",
    ecommerce: "bg-green-100 text-green-700",
    finance: "bg-purple-100 text-purple-700",
    healthcare: "bg-red-100 text-red-700",
    education: "bg-yellow-100 text-yellow-700",
    technology: "bg-indigo-100 text-indigo-700",
    marketing: "bg-pink-100 text-pink-700",
    consulting: "bg-orange-100 text-orange-700",
  };
  
  return colors[industry.toLowerCase()] || "bg-slate-100 text-slate-600";
};

// Helper function to get company size badge
const getCompanySizeColor = (size: string | null): string => {
  if (!size) return "bg-slate-100 text-slate-600";
  
  const colors: Record<string, string> = {
    "1-10": "bg-emerald-100 text-emerald-700",
    "11-50": "bg-cyan-100 text-cyan-700",
    "51-200": "bg-blue-100 text-blue-700",
    "201-500": "bg-indigo-100 text-indigo-700",
    "501-1000": "bg-purple-100 text-purple-700",
    "1000+": "bg-violet-100 text-violet-700",
  };
  
  return colors[size] || "bg-slate-100 text-slate-600";
};

const Organizations: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<OrganizationsFilters>({
    industry: "",
    companySize: "",
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInputValue);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInputValue]);

  // Fetch organizations when page, search, or filters change
  useEffect(() => {
    loadOrganizations();
  }, [currentPage, searchTerm, filters]);

  const loadOrganizations = async () => {
    setLoading(true);
    try {
      const data = await fetchOrganizations(currentPage, searchTerm);
      
      // Filter results based on selected filters
      let filteredResults = data.results;
      
      if (filters.industry) {
        filteredResults = filteredResults.filter(
          org => org.industry?.toLowerCase() === filters.industry.toLowerCase()
        );
      }
      
      if (filters.companySize) {
        filteredResults = filteredResults.filter(
          org => org.company_size === filters.companySize
        );
      }
      
      setOrganizations(filteredResults);
      setTotalCount(data.count);
      setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 items per page
    } catch (error: any) {
      console.error("Failed to fetch organizations:", error);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to view organizations.");
      } else {
        toast.error("Failed to load organizations");
      }
      
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
  };

  const clearSearch = () => {
    setSearchInputValue("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const resetFilters = () => {
    setFilters({
      industry: "",
      companySize: "",
    });
    setCurrentPage(1);
  };

  // Get unique industries for filter dropdown
  const uniqueIndustries = React.useMemo(() => {
    const industries = new Set<string>();
    organizations.forEach(org => {
      if (org.industry) industries.add(org.industry);
    });
    return Array.from(industries).sort();
  }, [organizations]);

  // Get unique company sizes for filter dropdown
  const uniqueCompanySizes = React.useMemo(() => {
    const sizes = new Set<string>();
    organizations.forEach(org => {
      if (org.company_size) sizes.add(org.company_size);
    });
    return Array.from(sizes).sort();
  }, [organizations]);

  return (
    <div className="space-y-6 mt-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Organizations</h1>
          <p className="text-sm text-slate-500">
            Manage and view all organizations on the platform
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="rounded-xl border bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search organizations by name, website, or industry..."
              value={searchInputValue}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-slate-300 pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchInputValue && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
              showFilters || filters.industry || filters.companySize
                ? "border-blue-300 bg-blue-50 text-blue-600"
                : "border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Filter size={16} />
            Filters
            {(filters.industry || filters.companySize) && (
              <span className="ml-1 rounded-full bg-blue-600 w-5 h-5 text-xs text-white flex items-center justify-center">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-700">Filters</h3>
              {(filters.industry || filters.companySize) && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Clear all filters
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Industry Filter */}
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Industry
                </label>
                <select
                  value={filters.industry}
                  onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Industries</option>
                  {uniqueIndustries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry.charAt(0).toUpperCase() + industry.slice(1)}
                    </option>
                  ))}
                </select>
              </div>


              {/* Company Size Filter */}
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Company Size
                </label>
                <select
                  value={filters.companySize}
                  onChange={(e) => setFilters(prev => ({ ...prev, companySize: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sizes</option>
                  {uniqueCompanySizes.map(size => (
                    <option key={size} value={size}>
                      {size} employees
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Loading organizations...
              </span>
            ) : (
              <>
                Showing {organizations.length} of {totalCount} organizations
                {searchTerm && ` for "${searchTerm}"`}
              </>
            )}
          </span>
          {searchTerm && !loading && (
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-700"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Organizations Table */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Organization</th>
                <th className="px-6 py-4 text-left font-medium">Website</th>
                <th className="px-6 py-4 text-left font-medium">Industry</th>
                <th className="px-6 py-4 text-left font-medium">Company Size</th>
                <th className="px-6 py-4 text-left font-medium">Snowflake ID</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 size={32} className="animate-spin text-blue-600 mb-3" />
                      <p className="text-sm text-slate-500">Loading organizations...</p>
                    </div>
                  </td>
                </tr>
              ) : organizations.length > 0 ? (
                organizations.map((org) => (
                  <tr key={org.snowflake_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Building2 size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {formatDisplayValue(org.name)}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            {org.snowflake_id.slice(0, 8)}...{org.snowflake_id.slice(-4)}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {org.website ? (
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <Globe size={14} />
                          <span className="text-sm truncate max-w-[150px]">
                            {org.website.replace(/^https?:\/\//, '')}
                          </span>
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      {org.industry ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIndustryColor(org.industry)}`}>
                          <Briefcase size={12} className="mr-1" />
                          {org.industry.charAt(0).toUpperCase() + org.industry.slice(1)}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      {org.company_size ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCompanySizeColor(org.company_size)}`}>
                          <Users size={12} className="mr-1" />
                          {org.company_size}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-slate-500">
                        {org.snowflake_id}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Building2 size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="text-sm text-slate-500 mb-2">No organizations found</p>
                    {searchTerm && (
                      <p className="text-xs text-slate-400">
                        Try adjusting your search or filters
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && organizations.length > 0 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={14} />
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <span className="text-xs text-slate-400">
                (Total: {totalCount} organizations)
              </span>
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizations;