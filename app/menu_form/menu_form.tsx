import { TopBar } from "~/components/overview/top_bar"
import { BottomNav } from "~/components/overview/bottom_nav"
import { DailyMenuForm } from "~/components/menu_form/menu_form"

export function DailyMenuFormComponent(restaurantId={restaurantId}) {
  return (
    <>
      <TopBar isLoginPage={false}></TopBar>
      <div className = "w-full" style={{ height: "calc(100vh - 150px)"}}>
          <DailyMenuForm restaurantId={restaurantId}></DailyMenuForm>
      </div>
    </>
  );
}