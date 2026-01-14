"use client";

import { Button } from "~/shadcn/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRestaurantStore } from "~/store/restaurant_store";
import type { FacilityInfoProps, Restaurant, Facility } from "~/interfaces";

import { Route, DollarSign, Smile } from "lucide-react";

function PricingIcon({ selectedPoint }: { selectedPoint: Facility }) {
  const isRestaurant = "name" in selectedPoint;
  return (
    <div className="flex items-center gap-1">
      <DollarSign className="-mr-2" size={14} />
      {isRestaurant && <DollarSign size={14} />}
    </div>
  );
}

function CustomerSatisfaction() {
  // TODO: wire real data
  return (
    <div className="flex items-center gap-1">
      <Smile size={14} />
      <p>6.3</p>
    </div>
  );
}

<<<<<<< HEAD
=======
const GetCustomerSatisfactionComponent = (selectedPoint) => { {/* TODO feature - gather and calculate customer satisfaction */}
    return (
        <div className="flex items-center gap-1">
            <Smile size={14} />
            <p> 6.3 </p>
        </div>
    );
}

const GetOptionalGoToRestaurantButton = (selectedPoint) => {
    if ("name" in selectedPoint) {
        return (
            <Button
                onClick={() => (window.location.href = "/dishes")}
                className="text-primary-foreground text-white"
                variant="default"
                > Go to {selectedPoint.name}
            </Button>
        );
    }
    return null;
}



>>>>>>> 95e0174 (Implement dish list page with mock data)
export function FacilityInfo({ selectedPoint, onClose }: FacilityInfoProps) {
  const navigate = useNavigate();
  const setSelectedRestaurant = useRestaurantStore((s) => s.setSelectedRestaurant);

  if (!selectedPoint) return null;

  const isRestaurant = "name" in selectedPoint;

  const handleGoToDishes = () => {
    if (!isRestaurant) return;
    setSelectedRestaurant(selectedPoint as Restaurant);
    navigate("/menu");
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
        <div className="flex w-full max-w-sm items-center justify-between">
          <h3 className="text-lg font-semibold">{isRestaurant ? (selectedPoint as Restaurant).name : "Vending machine"}</h3>
          <CustomerSatisfaction />
          <PricingIcon selectedPoint={selectedPoint} />
          <div className="flex items-center gap-1">
            <Route size={13} />
            <p className="text-sm">Navigate</p>
          </div>
        </div>

        <p className="text-gray-700 mt-2">{selectedPoint.description}</p>

        <div className="flex gap-2 mt-8 justify-end">
          {isRestaurant && (
            <Button onClick={handleGoToDishes} className="text-primary-foreground text-white" variant="default">
              Go to {(selectedPoint as Restaurant).name}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}