import { TopBar } from "~/components/overview/top_bar"
import { BottomNav } from "~/components/overview/bottom_nav"

export default function Profile() {
    return (
        <>
          <TopBar></TopBar>
          <div className = "w-full" style={{ height: "calc(100vh - 150px)"}}>
              Profile
          </div>
          <BottomNav />
        </>
      );
    }
