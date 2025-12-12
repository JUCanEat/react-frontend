import { Button } from "~/shadcn/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRestaurantStore } from "~/store/restaurant_store";

export function FacilityInfo({ selectedPoint, onClose }) {
  const setSelectedRestaurant = useRestaurantStore((state) => state.setSelectedRestaurant);
  const navigate = useNavigate();

  if (!selectedPoint) return null;

  const isRestaurant = "name" in selectedPoint;

  const handleGoToDishes = () => {
    if (isRestaurant) {
      setSelectedRestaurant(selectedPoint); // store globally
      navigate("/dishes");
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
