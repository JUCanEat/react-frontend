import { TopBar } from "~/components/shared/top_bar";
import { LoginCard } from "~/components/login/login_card";
import { BottomNav } from "~/components/shared/bottom_nav";

export default function LoginComponent() {
    return (
        <>
            <TopBar isLoginPage={true}></TopBar>
            <div className="w-full flex flex-col items-center" style={{ height: "calc(100vh - 150px)"}}>
                <div className="h-1/10"></div>
                <LoginCard></LoginCard>
            </div>
            <BottomNav></BottomNav>
        </>
    )
}