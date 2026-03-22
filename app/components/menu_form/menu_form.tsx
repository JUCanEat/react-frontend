import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "~/shadcn/components/ui/card";
import { Button } from "~/shadcn/components/ui/button"
import { Input } from "~/shadcn/components/ui/input";
import { Label } from "~/shadcn/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "~/shadcn/components/ui/select";
import { Checkbox } from "~/shadcn/components/ui/checkbox";
import { Plus, Trash } from "lucide-react";
import {
    Alert,
    AlertTitle,
    AlertDescription
} from "~/shadcn/components/ui/alert";
import { type DishDTO } from "~/interfaces";
import { useUpdateDailyMenuWithToken } from "~/api/menu_service";
import { useRestaurantStore } from "~/store/restaurant_store";

const ALLERGENS = [
  "GLUTEN",
  "LACTOSE",
  "MEAT"
];

const CATEGORIES = ["SOUP", "MAIN_COURSE"];

export function DailyMenuForm({ restaurantId, userId, token }: { restaurantId: string; userId: string; token: string }) {
  const { menuFormSuccess, setMenuFormSuccess, setSelectedRestaurant } = useRestaurantStore();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (menuFormSuccess) {
      navigate(`/menu?restaurantId=${restaurantId}`);
      setMenuFormSuccess(false);
    }
  }, [menuFormSuccess, navigate, restaurantId, setMenuFormSuccess]);
  const [date, setDate] = useState("");
  const [dishes, setDishes] = useState<DishDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errorRef = React.useRef<HTMLDivElement>(null);
  const updateMenu = useUpdateDailyMenuWithToken(token);

  const addDish = () => {
    setDishes([
      ...dishes,
      { name: "", category: "", price: 0, allergens: [] },
    ]);
  };

  const updateDish = (index: number, field: keyof DishDTO, value: any) => {
    const updated = [...dishes];
    (updated[index] as any)[field] = value;
    setDishes(updated);
  };

  const toggleAllergen = (index: number, allergen: string) => {
    const updated = [...dishes];
    const exists = updated[index].allergens.includes(allergen);
    updated[index].allergens = exists
      ? updated[index].allergens.filter((a) => a !== allergen)
      : [...updated[index].allergens, allergen];
    setDishes(updated);
  };

  const removeDish = (index: number) => {
    const updated = dishes.filter((_, i) => i !== index);
    setDishes(updated);
  };

  const validateDishes = () => {
    if (!date) return "Please select a date.";
    if (dishes.length === 0) return "Please add at least one dish.";

    for (let i = 0; i < dishes.length; i++) {
      const d = dishes[i];

      if (!d.name.trim()) return `Dish ${i + 1}: Name is required.`;
      if (!d.category) return `Dish ${i + 1}: Category is required.`;
      if (!d.price || d.price <= 0) return `Dish ${i + 1}: Price must be greater than 0.`;
    }

    return null;
  };

  const handleSubmit = async () => {
      const validationError = validateDishes();

      if (validationError) {
        setError(validationError);
        setTimeout(() => errorRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        }), 50);
        return;
      }

      setError(null);
      setIsSubmitting(true);

      try {
        await updateMenu.mutateAsync({
          restaurantId,
          menu: {
            date,
            dishes
          }
        });
        // Reset form
        setDishes([]);
        setDate("");
        setSelectedRestaurant({ id: restaurantId }); 
        setMenuFormSuccess(true);
      } catch (err: any) {
        setError(err.message || "Failed to update menu.");
        setTimeout(() => errorRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        }), 50);
      } finally {
        setIsSubmitting(false);
      }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto p-4">
        <Button
          variant="outline"
          className="mb-6 w-fit bg-white text-gray-900 hover:bg-zinc-100 dark:bg-white dark:text- dark:hover:bg-zinc-200"
          onClick={() => navigate(-1)}
          >
           ← Go Back
        </Button>
        {error && (
          <div ref={errorRef}>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
        <Card className="shadow-md rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white">Create Daily Menu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label className="text-gray-900 dark:text-white">Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700" />
            </div>
            <div className="space-y-4">
              {dishes.map((dish, index) => (
                <Card key={index} className="p-4 border-2 border-[#009DE0] shadow-sm hover:shadow-md transition-shadow bg-gray-100 dark:bg-zinc-100/10">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Dish {index + 1}</h3>
                    <Button variant="destructive" size="icon" onClick={() => removeDish(index)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <Label className="text-gray-900 dark:text-white">Name</Label>
                      <Input
                        value={dish.name}
                        onChange={(e) => updateDish(index, "name", e.target.value)}
                        className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label className="text-gray-900 dark:text-white">Category</Label>
                      <Select
                        onValueChange={(v) => updateDish(index, "category", v)}
                        value={dish.category}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label className="text-gray-900 dark:text-white">Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={dish.price}
                        onChange={(e) => updateDish(index, "price", parseFloat(e.target.value))}
                        className="bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-900 dark:text-white">Allergens</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {ALLERGENS.map((a) => (
                        <label key={a} className="flex items-center space-x-2">
                          <Checkbox
                            checked={dish.allergens.includes(a)}
                            onCheckedChange={() => toggleAllergen(index, a)}
                          />
                          <span className="text-sm text-gray-900 dark:text-white">{a}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button onClick={addDish} className="w-full flex items-center gap-2" disabled={isSubmitting}>
              <Plus className="h-4 w-4" /> Add Dish
            </Button>
            <Button onClick={handleSubmit} className="w-full mt-2" variant="default" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Menu"}
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="fixed bottom-0 left-0 w-full z-50">
        {/* Navigation bar here if needed */}
      </div>
    </div>
  );
}