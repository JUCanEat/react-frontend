"use client";

import { Button } from "~/shadcn/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRestaurantStore } from "~/store/restaurant_store";
import type { FacilityInfoProps, Restaurant } from "~/interfaces";

export function FacilityInfo({ selectedPoint, onClose }: FacilityInfoProps) {
  const setSelectedRestaurant = useRestaurantStore((state) => state.setSelectedRestaurant);
  const navigate = useNavigate();

  if (!selectedPoint) return null;

  const isRestaurant = "name" in selectedPoint;

  const handleGoToDishes = () => {
    if (isRestaurant) {
      // ensure the store receives a Restaurant typed object
      setSelectedRestaurant(selectedPoint as Restaurant); // store globally
      // debug: confirm handler is invoked and what will be navigated to
      // (will appear in browser console)
      // eslint-disable-next-line no-console
      console.debug("FacilityInfo: navigating to /menu with", selectedPoint);
      navigate("/menu");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-xl w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{isRestaurant ? selectedPoint.name : "Vending machine"}</h3>
        </div>
        <p className="text-gray-700 mt-2">{selectedPoint.description}</p>

        {isRestaurant && (
          <div className="flex justify-end mt-8">
            <Button onClick={handleGoToDishes}>Go to {selectedPoint.name}</Button>
          </div>
        )}
      </div>
    </div>
  );
}