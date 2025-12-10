import { Button } from '@/components/ui/button';


import React from 'react';
import { TooltipDemo } from '../Pages/Tooltip';

const page = () => {
    return (
        <div>
            This is Home page <br />
           <Button className='bg-red-500'> hello</Button>
           <TooltipDemo />
            
        </div>
    );
};

export default page;