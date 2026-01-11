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
      <>
        <TopBar isLoginPage={false}></TopBar>
        <div className="w-full flex items-center justify-center" style={{ height: "calc(100vh - 150px)"}}>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-sm">Loading authentication...</span>
        </div>
      </>
    );
  }

  if (!keycloak.token) {
    return (
      <>
        <TopBar isLoginPage={false}></TopBar>
        <div className="max-w-3xl mx-auto p-4">
          <Alert variant="destructive">
            <AlertTitle>Authentication required</AlertTitle>
            <AlertDescription>Please log in to add a menu.</AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <TopBar isLoginPage={false}></TopBar>
        <div className="w-full flex items-center justify-center" style={{ height: "calc(100vh - 150px)"}}>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-sm">Loading your restaurants...</span>
        </div>
      </>
    );
  }

  if (error || !restaurantId) {
    return (
      <>
        <TopBar isLoginPage={false}></TopBar>
        <div className="max-w-3xl mx-auto p-4">
          <Alert variant="destructive">
            <AlertTitle>Error loading profile</AlertTitle>
            <AlertDescription>Could not load your profile. Please try logging in again.</AlertDescription>
          </Alert>
        </div>
      </>
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
      <>
        <TopBar isLoginPage={false}></TopBar>
        <div className = "w-full" style={{ height: "calc(100vh - 150px)"}}>
            <DailyMenuForm restaurantId={restaurantId} userId={userId || ""} token={keycloak.token}></DailyMenuForm>
        </div>
      </>
    );
}
