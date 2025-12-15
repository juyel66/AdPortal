import { Button } from "@/components/ui/button";
import { Link } from "react-router";


const Home = () => {
    return (
        <div className=" ">
   
   <div>
   <Link to="/user-dashboard/dashboard"> <Button  >Go to Dashboard</Button></Link>
   </div>

            
        </div>
    );
};

export default Home;