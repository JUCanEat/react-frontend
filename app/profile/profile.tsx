import { TopBar } from "~/components/overview/top_bar";
import { LoginCard } from "~/components/profile/login_card";
import { BottomNav } from "~/components/overview/bottom_nav";

export default function ProfileComponent() {
    return (
        <>
            <TopBar isProfilePage={true}></TopBar>
            <div className="w-full flex flex-col items-center" style={{ height: "calc(100vh - 150px)"}}>
                <div className="h-1/10"></div>
                <LoginCard></LoginCard>
            </div>
            <BottomNav></BottomNav>
        </>
    )
}