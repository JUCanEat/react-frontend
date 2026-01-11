import { TopBar } from "~/components/shared/top_bar"
import { DailyMenuForm } from "~/components/menu_form/menu_form"

export default function DailyMenuPage() {
  const restaurantId = "b2a5f4de-8f39-4e3e-a51e-8c527ce7e1a1"; // TODO: replace with actual restaurantID when admin's add menu from form is integrated with add menu screen (with options form/picture) is merged

  return (
      <>
        <TopBar isLoginPage={false}></TopBar>
        <div className = "w-full" style={{ height: "calc(100vh - 150px)"}}>
            <DailyMenuForm restaurantId={restaurantId}></DailyMenuForm>
        </div>
      </>
    );
}
