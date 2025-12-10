// src/app/(WithDashboardLayout)/dashboard/page.tsx
import Link from "next/link";

const Page = () => {
  return (
    <div>
      <p>This is a dashboard page</p>
      <br />
      <Link href="/service">Go to Service Page</Link>
    </div>
  );
};

export default Page;
