import React, { useState } from "react";
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
import { motion } from "framer-motion";
import {
    Alert,
    AlertTitle,
    AlertDescription
} from "~/shadcn/components/ui/alert";
import { type DishDTO } from "~/interfaces";
import { useUpdateDailyMenu } from "~/api/menu_service";

const ALLERGENS = [
  "GLUTEN",
  "CRUSTACEANS",
  "EGGS",
  "FISH",
  "PEANUTS",
  "SOYBEANS",
  "MILK",
  "NUTS",
  "CELERY",
  "MUSTARD",
  "SESAME",
  "SULPHITES",
  "LUPIN",
  "MOLLUSCS",
];

const CATEGORIES = ["STARTER", "MAIN", "DESSERT", "DRINK"];

export function DailyMenuForm({ restaurantId }: { restaurantId: string }) {
  const [date, setDate] = useState("");
  const [dishes, setDishes] = useState<DishDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const errorRef = React.useRef<HTMLDivElement>(null);

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

  const updateMenu = useUpdateDailyMenu(restaurantId, { date, dishes });

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

      try {
        await updateMenu.refetch();
        alert("Menu updated successfully!");
      } catch (err: any) {
        setError(err.message || "Failed to update menu.");
        setTimeout(() => errorRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        }), 50);
      }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
    {error && (
      <div ref={errorRef}>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )}

      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Create Daily Menu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="space-y-4">
            {dishes.map((dish, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-xl space-y-4 bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Dish {index + 1}</h3>
                  <Button variant="destructive" size="icon" onClick={() => removeDish(index)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={dish.name}
                      onChange={(e) => updateDish(index, "name", e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label>Category</Label>
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
                    <Label>Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={dish.price}
                      onChange={(e) => updateDish(index, "price", parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Allergens</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {ALLERGENS.map((a) => (
                      <label key={a} className="flex items-center space-x-2">
                        <Checkbox
                          checked={dish.allergens.includes(a)}
                          onCheckedChange={() => toggleAllergen(index, a)}
                        />
                        <span className="text-sm">{a}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Button onClick={addDish} className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Dish
          </Button>

          <Button onClick={handleSubmit} className="w-full mt-2" variant="default">
            Submit Menu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
