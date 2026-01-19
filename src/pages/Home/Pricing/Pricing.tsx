import Frequently from "../Features.tsx/Frequently";
import ReadyToTransform from "../Features.tsx/ReadyToTransform";
import SubscriptionBillingHomePage from "../Features.tsx/SubscriptionBillingHomePage";

const Pricing = () => {
  return (
    <section id="pricing">
      <SubscriptionBillingHomePage />

      <div className="mt-10">
        <Frequently />
      </div>

      <ReadyToTransform />
    </section>
  );
};

export default Pricing;
