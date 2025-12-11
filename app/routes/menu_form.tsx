import { DailyMenuFormComponent } from "~/menu_form/menu_form";

export default function DailyMenuPage() {
  const restaurantId = "b2a5f4de-8f39-4e3e-a51e-8c527ce7e1a1"; // Replace with actual restaurant ID from context or props

  return <DailyMenuFormComponent restaurantId={restaurantId} />;
}

// TODO: the AI service fills out this form and allows for corrections