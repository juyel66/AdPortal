import { useUserProfile } from "@/hooks/useUserProfile";
import NotificationBell from "@/Notification/NotificationBell";


const AdminNavbar = () => {
    const { full_name, is_admin } = useUserProfile();

    return (
        <div>
            <div className="navbar bg-base-100 border-b-2">
                <div className="navbar-start">
                    <div className="dropdown"></div>
                </div>
                
                <div className="navbar-center hidden lg:flex"></div>
                
                <div className="navbar-end">
                    <div className='flex items-center gap-4'>
                        
                         <div className="lg:flex hidden"><NotificationBell /></div>
                        
                        {/* <Link to="notification">
                            <img 
                                className='w-10 h-10 rounded-full' 
                                src="https://res.cloudinary.com/dqkczdjjs/image/upload/v1766353699/Button_3_jqwyyc.png" 
                                alt="notification" 
                            />
                        </Link> */}
                        
                        <div className='flex flex-col bg-gray-200 pr-3 pl-3 rounded-xl'>
                            <p className='text-xl whitespace-nowrap font-semibold'>{full_name}</p>
                            <p className='text-gray-900 '>{is_admin ? 'Admin' : 'User'}</p>
                        </div>
                        <div className=" pr-2 lg:hidden ">
                           <NotificationBell />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNavbar;