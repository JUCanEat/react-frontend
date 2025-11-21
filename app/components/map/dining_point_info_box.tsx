import { Button } from "~/shadcn/components/ui/button";
import type { MockDiningPointInfoProps } from "~/interfaces"

import {
    Route,
    DollarSign,
    Smile,
    X
} from "lucide-react"

import { useGetAllRestaurants } from "~/api/restaurant_service";

const GetDiningPointInfo = (id: string) => {
    fetch(`${rootQueryUrl}/${allRestaurantsEndpoint}/${id}`)
        .then(res => res.json())
        .then((data: Restaurant) => {
            const restaurantInfo = `Name: ${data.name}\nDescription: ${data.description}`;
            alert(restaurantInfo);
            return restaurantInfo;
        })
        .catch(err => {
            alert("Error: " + err.message);
        })
}

const GetDiningPointPricingIcon = (selectedPoint) => {
    return (
        <div className="flex items-center gap-1">
            <DollarSign className="-mr-2" size={14}/>
            <DollarSign size={14}/>
        </div>
    );
}

const GetCustomerSatisfactionComponent = (selectedPoint) => { {/* TODO feature - gather and calculate customer satisfaction */}
    return (
        <div className="flex items-center gap-1">
            <Smile size={14} />
            <p> 6.3 </p>
        </div>
    );
}

const GetOptionalGoToRestaurantButton = (selectedPoint) => {
    return (
        <Button
            onClick={() => alert(`View menu for ${selectedPoint.name}`)}
            className="text-primary-foreground text-white"
            variant="default"
            > Go to {selectedPoint.name}
        </Button>
    );
}



export function DiningPointInfo({ selectedPoint, onClose }: MockDiningPointInfoProps) {
  if (!selectedPoint) return null;

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
            <h3 className="text-lg font-semibold">{selectedPoint.name}</h3>
            {GetCustomerSatisfactionComponent(selectedPoint)}
            {GetDiningPointPricingIcon(selectedPoint)}
            {<div className="flex items-center gap-1">
                <Route size={13}/>
                <p size={10}>Navigate</p>
            </div>}
        </div>

        <p className="text-gray-700 mt-2">{selectedPoint.description}</p>

        <div className="flex gap-2 mt-8 justify-end">
            {GetOptionalGoToRestaurantButton(selectedPoint)}
        </div>
      </div>
    </div>
  );
}