import AICampaignOptimization from "./AICampaignOptimization";
import AudienceAndPlacements from "./AudienceAndPlacements";
import CampaignsOverview from "./CampaignsOverview";
import CreativePerformance from "./CreativePerformance";


const CampaignsViewDetails = () => {
    return (
        <div className="mt-5">
            <CampaignsOverview />
          <div className="mt-5 mb-5">
              <CreativePerformance />
          </div>
            <AudienceAndPlacements />

         <div className="mt-5">
               <AICampaignOptimization />
         </div>
            
        </div>
    );
};

export default CampaignsViewDetails;