import { useState, useEffect } from "react";
import Swal from "sweetalert2";

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

export default function CampaignsTable({ campaigns = [] }: CampaignsTableProps) {
  const [data, setData] = useState<Campaign[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [form, setForm] = useState<{
    name: string;
    status: string;
    spend: string;
    platforms: string[];
  }>({ name: "", status: "DRAFT", spend: "", platforms: [] });

  useEffect(() => {
    setData(campaigns);
  }, [campaigns]);

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

  function openEdit(item: Campaign) {
    setEditing(item);
    setForm({
      name: item.name,
      status: item.status,
      spend: item.spend.toString(),
      platforms: item.platforms,
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (!editing) {
      Swal.fire("Disabled", "Creating campaigns is disabled", "info");
      return;
    }
    if (!form.name.trim()) {
      Swal.fire("Validation", "Campaign name is required", "warning");
      return;
    }
    setData((d) =>
      d.map((it) => (it.id === editing.id ? { 
        ...it, 
        ...form, 
        spend: parseFloat(form.spend) || 0
      } : it))
    );
    Swal.fire("Updated", "Campaign updated successfully", "success");

    setModalOpen(false);
    setEditing(null);
    setForm({ name: "", status: "DRAFT", spend: "", platforms: [] });
  }

  function handleDelete(item: Campaign) {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete ${item.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    }).then((res) => {
      if (res.isConfirmed) {
        setData((d) => d.filter((i) => i.id !== item.id));
        Swal.fire("Deleted", "Campaign deleted successfully", "success");
      }
    });
  }

  function togglePlatform(p: string) {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p)
        ? f.platforms.filter((x) => x !== p)
        : [...f.platforms, p],
    }));
  }

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
              <col style={{ width: "38%" }} />
              <col style={{ width: "120px" }} />
              <col style={{ width: "160px" }} />
              <col style={{ width: "120px" }} />
              <col style={{ width: "160px" }} />
              <col style={{ width: "120px" }} />
            </colgroup>

            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-extrabold text-slate-700 ">
                <th className="p-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-200"
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
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 align-middle">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-200"
                      />
                    </td>

                    <td
                      className="p-4 align-middle text-slate-800"
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

                    <td className="p-4 align-middle text-slate-800">
                      {formatCurrency(row.spend)}
                    </td>

                    {/* Performance icons */}
                    <td className="p-4 align-middle text-slate-600">
                      <div className="flex items-center gap-6">
                        {/* Eye icon - impressions */}
                        <div className="flex items-center gap-2">
                          <img
                            src={ICONS.eye}
                            alt="views"
                            className="w-4 h-4 object-contain"
                          />
                          <span>{formatNumber(row.performance?.impressions || 0)}</span>
                        </div>

                        {/* Cursor icon - CTR */}
                        <div className="flex items-center gap-2">
                          <img
                            src={ICONS.cursor}
                            alt="ctr"
                            className="w-4 h-4 object-contain"
                          />
                          <span>{(row.performance?.ctr || 0).toFixed(2)}%</span>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 align-middle text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEdit(row)}
                          className="p-2 bg-white rounded-md shadow-sm border border-slate-100"
                        >
                          <img src={ICONS.edit} alt="edit" className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(row)}
                          className="p-2 bg-white rounded-md shadow-sm border border-slate-100"
                        >
                          <img
                            src={ICONS.trash}
                            alt="delete"
                            className="w-4 h-4"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No campaigns found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl p-6 z-10">
            <h3 className="text-lg font-semibold mb-3">Edit Campaign</h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-600">Name</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border rounded-md p-2"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PAUSED">PAUSED</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-600">Spend</label>
                <input
                  type="number"
                  value={form.spend}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, spend: e.target.value }))
                  }
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">Platforms</label>
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => togglePlatform("META")}
                    className={`px-3 py-1 rounded-md border ${form.platforms.includes("META") ? "bg-blue-50 border-blue-300" : "bg-white"}`}
                  >
                    <img
                      src={ICONS.META}
                      alt="meta"
                      className="w-4 h-4"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePlatform("GOOGLE")}
                    className={`px-3 py-1 rounded-md border ${form.platforms.includes("GOOGLE") ? "bg-blue-50 border-blue-300" : "bg-white"}`}
                  >
                    <img src={ICONS.GOOGLE} alt="google" className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePlatform("TIKTOK")}
                    className={`px-3 py-1 rounded-md border ${form.platforms.includes("TIKTOK") ? "bg-blue-50 border-blue-300" : "bg-white"}`}
                  >
                    <img src={ICONS.TIKTOK} alt="tiktok" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setEditing(null);
                  }}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}