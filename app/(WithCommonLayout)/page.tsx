import { Button } from '@/components/ui/button';


import React from 'react';
// import { TooltipDemo } from '../Pages/Tooltip';
import Link from 'next/link';

const page = () => {
    return (
        <div>
            This is Home page <br />
           <Link  href="/dashboard/admin-dashboard"><Button className='bg-red-500'> Go to dashboard</Button></Link>
           {/* <TooltipDemo /> */}
            
        </div>
    );
};

export default page;