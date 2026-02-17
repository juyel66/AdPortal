import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Trash2, Edit, MoreHorizontal, Eye } from "lucide-react";
import api from "@/lib/axios";

interface Campaign {
  id: number;
  name: string;
  status: string;
  platforms: string[];
  created_at: string;
  spend: number;
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    roas: number;
  };
}

interface CampaignsTableProps {
  campaigns?: Campaign[];
  onDelete?: (campaignId: number, campaignName: string) => void;
}

// Helper function to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Helper function to format large numbers
const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
};

export default function CampaignsTable({ campaigns = [], onDelete }: CampaignsTableProps) {
  const navigate = useNavigate();
  const [data, setData] = useState<Campaign[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const ICONS: Record<string, string> = {
    facebook:
      "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765492235/Container_3_rocwbl.png",
    google:
      "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765492235/Container_4_wtcxrl.png",
    tiktok:
      "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765492235/Container_5_aav4oy.png",
    META:
      "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765492235/Container_3_rocwbl.png",
    GOOGLE:
      "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765492235/Container_4_wtcxrl.png",
    TIKTOK:
      "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765492235/Container_5_aav4oy.png",
    edit: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765492235/Edit_idtp7y.png",
    trash:
      "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765492235/Trash_qeknyo.png",
    eye: "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765493531/Icon_10_gci7gl.png",
    cursor:
      "https://res.cloudinary.com/dqkczdjjs/image/upload/v1765493531/Icon_9_iwacr1.png",
  };

  useEffect(() => {
    setData(campaigns);
  }, [campaigns]);

  // Get org_id from localStorage
  const getOrgId = (): string => {
    try {
      const selectedOrg = localStorage.getItem("selectedOrganization");
      if (selectedOrg) {
        const orgData = JSON.parse(selectedOrg);
        if (orgData && orgData.id) {
          return orgData.id;
        }
      }
    } catch (error) {
      console.error("Error parsing organization data:", error);
    }
    return "";
  };

  const handleEdit = (campaignId: number) => {
    navigate(`/user-dashboard/campaigns-update/${campaignId}`);
  };

  const handleDelete = async (campaign: Campaign) => {
    if (onDelete) {
      onDelete(campaign.id, campaign.name);
    }
  };

  const handleSelectAll = () => {
    if (selectedCampaigns.length === data.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(data.map(c => c.id));
    }
  };

  const handleSelectCampaign = (campaignId: number) => {
    setSelectedCampaigns(prev =>
      prev.includes(campaignId)
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedCampaigns.length === 0) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedCampaigns.length} selected campaigns?`);
    if (!confirmed) return;

    const orgId = getOrgId();
    if (!orgId) {
      toast.error('No organization selected');
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const campaignId of selectedCampaigns) {
      try {
        await api.delete(`/main/campaign/${campaignId}/?org_id=${orgId}`);
        successCount++;
      } catch (error) {
        console.error(`Failed to delete campaign ${campaignId}:`, error);
        failCount++;
      }
    }

    if (successCount > 0) {
      setData(prev => prev.filter(c => !selectedCampaigns.includes(c.id)));
      setSelectedCampaigns([]);
      
      toast.success(`${successCount} campaign${successCount > 1 ? 's' : ''} deleted successfully`, {
        duration: 3000,
        position: 'top-center',
      });
    }

    if (failCount > 0) {
      toast.error(`Failed to delete ${failCount} campaign${failCount > 1 ? 's' : ''}`, {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  function truncateTitle(t: string) {
    if (!t) return "";
    return t.length > 25 ? t.slice(0, 25) + "..." : t;
  }

  function getStatusColor(status: string) {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-700';
      case 'PAUSED':
        return 'bg-yellow-100 text-amber-700';
      case 'DRAFT':
        return 'bg-slate-100 text-slate-600';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  }

  const displayedData = showAll ? data : data.slice(0, 4);

  return (
    <div className="w-full mx-auto mt-5">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Recent Campaigns
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Track your active campaign performance
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedCampaigns.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedCampaigns.length})
              </button>
            )}
            <button
              onClick={() => setShowAll((s) => !s)}
              className="text-sm text-sky-600 hover:underline"
            >
              {showAll ? "View less" : "View all"} →
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col style={{ width: "48px" }} />
              <col style={{ width: "35%" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "140px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "140px" }} />
              <col style={{ width: "100px" }} />
            </colgroup>

            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-extrabold text-slate-700">
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedCampaigns.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="p-4">Campaign</th>
                <th className="p-4">Status</th>
                <th className="p-4">Platforms</th>
                <th className="p-4">Spend</th>
                <th className="p-4">Performance</th>
                <th className="pr-9 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {displayedData.length > 0 ? (
                displayedData.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      selectedCampaigns.includes(row.id) ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <td className="p-4 align-middle">
                      <input
                        type="checkbox"
                        checked={selectedCampaigns.includes(row.id)}
                        onChange={() => handleSelectCampaign(row.id)}
                        className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500"
                      />
                    </td>

                    <td
                      className="p-4 align-middle text-slate-800 font-medium"
                      title={row.name}
                    >
                      {truncateTitle(row.name)}
                    </td>

                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>

                    {/* Platforms */}
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        {row.platforms && row.platforms.map((p) => (
                          <div
                            key={p}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm"
                            title={p}
                          >
                            <img
                              src={ICONS[p] || ICONS.facebook}
                              alt={p}
                              className="w-5 h-5 object-contain"
                            />
                          </div>
                        ))}
                        {(!row.platforms || row.platforms.length === 0) && (
                          <span className="text-xs text-gray-400">No platforms</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 align-middle text-slate-800 font-medium">
                      {formatCurrency(row.spend)}
                    </td>

                    {/* Performance icons */}
                    <td className="p-4 align-middle text-slate-600">
                      <div className="flex items-center gap-6">
                        {/* Eye icon - impressions */}
                        <div className="flex items-center gap-2 group relative">
                          <img
                            src={ICONS.eye}
                            alt="impressions"
                            className="w-4 h-4 object-contain"
                          />
                          <span>{formatNumber(row.performance?.impressions || 0)}</span>
                          <span className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                            Impressions
                          </span>
                        </div>

                        {/* Cursor icon - CTR */}
                        <div className="flex items-center gap-2 group relative">
                          <img
                            src={ICONS.cursor}
                            alt="ctr"
                            className="w-4 h-4 object-contain"
                          />
                          <span>{(row.performance?.ctr || 0).toFixed(2)}%</span>
                          <span className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                            Click-through rate
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 align-middle text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/user-dashboard/campaigns-update/${row.id}`}
                          className="p-2 bg-white rounded-md shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors group relative"
                          title="Edit campaign"
                        >
                          <img src={ICONS.edit} alt="edit" className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(row)}
                          disabled={deleteLoading === row.id}
                          className="p-2 bg-white rounded-md shadow-sm border border-slate-100 hover:bg-slate-50 hover:border-red-200 transition-colors group relative disabled:opacity-50"
                          title="Delete campaign"
                        >
                          {deleteLoading === row.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <img src={ICONS.trash} alt="delete" className="w-4 h-4" />
                          )}
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      
                      <p className="text-lg font-medium">No campaigns found</p>
                      <p className="text-sm text-gray-400">Create your first campaign to get started</p>
                      <Link
                        to="/user-dashboard/campaigns-create/step-1"
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Create Campaign
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}