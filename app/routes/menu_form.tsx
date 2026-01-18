import { TopBar } from "~/components/shared/top_bar"
import { DailyMenuForm } from "~/components/menu_form/menu_form"
import { useKeycloak } from "@react-keycloak/web"
import { useParams } from "react-router"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/shadcn/components/ui/alert"

export default function DailyMenuPage() {
  const { keycloak, initialized } = useKeycloak();
  const token = keycloak?.token;
  const userId = keycloak?.tokenParsed?.sub;
  const { restaurantId } = useParams<{ restaurantId: string }>();

  if (!initialized) {
    return (
      <div className="dark:bg-zinc-950">
        <TopBar isLoginPage={false}></TopBar>
        <div className="w-full flex items-center justify-center dark:bg-zinc-950" style={{ height: "calc(100vh - 150px)"}}>
          <div className="animate-spin dark:text-white">Loading authentication...</div>
        </div>
      </div>
    );
  }

  if (!keycloak.token) {
    return (
      <div className="dark:bg-zinc-950">
        <TopBar isLoginPage={false}></TopBar>
        <div className="max-w-3xl mx-auto p-4 dark:bg-zinc-950">
          <Alert variant="destructive">
            <AlertTitle>Authentication required</AlertTitle>
            <AlertDescription>Please log in to add a menu.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!restaurantId) {
    return (
      <div className="dark:bg-zinc-950">
        <TopBar isLoginPage={false}></TopBar>
        <div className="max-w-3xl mx-auto p-4 dark:bg-zinc-950">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>No restaurant specified. Please try again from your restaurant page.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
      <div className="dark:bg-zinc-950">
        <TopBar isLoginPage={false}></TopBar>
        <div className = "w-full dark:bg-zinc-950" style={{ height: "calc(100vh - 150px)"}}>
            <DailyMenuForm restaurantId={restaurantId} userId={userId || ""} token={keycloak.token}></DailyMenuForm>
        </div>
      </div>
    );
}
