import { useAppSelector } from "@/hooks/reduxHooks";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Link } from "react-router";


const AdminNavbar = () => {

    // const {user } = useAppSelector((state) => state.auth);

    const {full_name, email} = useUserProfile();



    



    return (
        <div>

            <div className="navbar bg-base-100  border-b-2    ">
  <div className="navbar-start">
    <div className="dropdown">
     
      
    </div>
    
  </div>
  <div className="navbar-center hidden lg:flex">

  </div>
  <div className="navbar-end">
  <div className='flex items-center gap-4'>
    <Link to="notification">
        <img className='w-10 h-10 rounded-full' src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1766353699/Button_3_jqwyyc.png" alt="" />
    </Link>
     <div>
    <p className='text-xl'>{full_name}</p>
    <p className='text-gray-500'>{email}</p>
   </div>
  </div>
  </div>
</div>
            
        </div>
    );
};

export default AdminNavbar;