import { UserButton } from "@clerk/nextjs";

import MobileSidebar from "@/components/mobile-sidebar";
import { getApiLimitCount, getUserMaxApiCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const Navbar = async () => {
    const apiLimitCount = await getApiLimitCount();
    const userMaxApiCount = await getUserMaxApiCount();
    const isPro = await checkSubscription();
    return ( 
        <div className="flex items-center p-4">
            <MobileSidebar isPro={isPro} apiLimitCount = {apiLimitCount} userMaxApiCount = {userMaxApiCount}/>
            <div className="flex w-full justify-end">
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
     );
}
 
export default Navbar;