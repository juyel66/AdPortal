
import AIMarketingTeam from "./AIMarketingTeam";
import CreateOnes from "./CreateOnce";
import FeaturesScale from "./FeaturesScale";
import HowItWorks from "./HowItWorks";
import PowerfulFeatures from "./PowerfulFeatures ";
import StatsBar from "./StatsBar";
import Trusted from "./Trusted";
import SubscriptionBillingHomePage from "./SubscriptionBillingHomePage";
import Frequently from "./Frequently";
import ReadyToTransform from "./ReadyToTransform";

const Features = () => {
    return (
        <div>
            <CreateOnes />
            <StatsBar />
            <Trusted />
            <FeaturesScale />
            <AIMarketingTeam />
            <PowerfulFeatures />
            <HowItWorks />
            <SubscriptionBillingHomePage />
            <Frequently />
            <ReadyToTransform />
            
        </div>
    );
};

export default Features;