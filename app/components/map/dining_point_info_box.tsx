import { Button } from "~/shadcn/components/ui/button";
import type { MockDiningPointInfoProps } from "~/interfaces"

export function DiningPointInfo({ selectedPoint, onClose }: MockDiningPointInfoProps) {
  if (!selectedPoint) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-xl w-full max-w-sm text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">{selectedPoint.name}</h3>
        <p className="text-gray-700 mt-2">{selectedPoint.description}</p>

        <div className="flex gap-2 justify-center mt-4">
          {selectedPoint.type === "restaurant" && (
             <Button
                onClick={() => alert(`View menu for ${selectedPoint.name}`)}
                className="bg-primary text-primary-foreground"
             >
                View Menu
             </Button>
          )}
          <Button
            onClick={onClose}
            className="bg-primary text-primary-foreground"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}