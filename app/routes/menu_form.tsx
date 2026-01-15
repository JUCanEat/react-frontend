import { TopBar } from "~/components/shared/top_bar"
import { DailyMenuForm } from "~/components/menu_form/menu_form"
import { useKeycloak } from "@react-keycloak/web"
import { useGetFirstOwnedRestaurant } from "~/api/user_service"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/shadcn/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function DailyMenuPage() {
  const { keycloak, initialized } = useKeycloak();
  const token = keycloak?.token;
  const userId = keycloak?.tokenParsed?.sub;
  const { data: restaurantId, isLoading, error } = useGetFirstOwnedRestaurant(token);

  if (!initialized) {
    return (
      <div className="dark:bg-zinc-950">
        <TopBar isLoginPage={false}></TopBar>
        <div className="w-full flex items-center justify-center dark:bg-zinc-950" style={{ height: "calc(100vh - 150px)"}}>
          <Loader2 className="h-6 w-6 animate-spin dark:text-white" />
          <span className="ml-2 text-sm dark:text-white">Loading authentication...</span>
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

  if (isLoading) {
    return (
      <div className="dark:bg-zinc-950">
        <TopBar isLoginPage={false}></TopBar>
        <div className="w-full flex items-center justify-center dark:bg-zinc-950" style={{ height: "calc(100vh - 150px)"}}>
          <Loader2 className="h-6 w-6 animate-spin dark:text-white" />
          <span className="ml-2 text-sm dark:text-white">Loading your restaurants...</span>
        </div>
      </div>
    );
  }

  if (error || !restaurantId) {
    return (
      <div className="dark:bg-zinc-950">
        <TopBar isLoginPage={false}></TopBar>
        <div className="max-w-3xl mx-auto p-4 dark:bg-zinc-950">
          <Alert variant="destructive">
            <AlertTitle>Error loading profile</AlertTitle>
            <AlertDescription>Could not load your profile. Please try logging in again.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!restaurantId) {
    return (
      <>
        <TopBar isLoginPage={false}></TopBar>
        <div className="max-w-3xl mx-auto p-4">
          <Alert variant="destructive">
            <AlertTitle>No restaurant found</AlertTitle>
            <AlertDescription>You don't own any restaurants. Please contact support.</AlertDescription>
          </Alert>
        </div>
      </>
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
