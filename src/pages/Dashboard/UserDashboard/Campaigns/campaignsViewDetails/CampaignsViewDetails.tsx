import AICampaignOptimization from "./AICampaignOptimization";
import AudienceAndPlacements from "./AudienceAndPlacements";
import CampaignsOverview from "./CampaignsOverview";
import CreativePerformance from "./CreativePerformance";


import { useEffect, useState } from "react";
import axios from "../../../../../../src/lib/axios";
import { useParams } from "react-router";

const CampaignsViewDetails = () => {
    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    // Get org_id from localStorage (selectedOrganization)
    function getOrgIdFromLocalStorage() {
        try {
            const org = localStorage.getItem('selectedOrganization');
            if (!org) return null;
            const parsed = JSON.parse(org);
            return parsed.id || null;
        } catch {
            return null;
        }
    }
    const org_id = getOrgIdFromLocalStorage();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!id) return;
        if (!org_id) return;
        axios
            .get(`/main/campaign/${id}/?org_id=${org_id}`)
            .then((res) => {
                setCampaign(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!campaign) return <div>No campaign found.</div>;

    return (
        <div className="mt-5">
            <CampaignsOverview campaign={campaign} />
            <div className="mt-5 mb-5">
                <CreativePerformance campaign={campaign} />
            </div>
            <AudienceAndPlacements campaign={campaign} />
            <div className="mt-5">
                <AICampaignOptimization campaign={campaign} />
            </div>
        </div>
    );
};

export default CampaignsViewDetails;