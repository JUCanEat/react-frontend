import { useState } from "react";
import { Heart } from "lucide-react";

export function ClickableHeart() {
  const [filled, setFilled] = useState(false);

  return (
    <div onClick={() => setFilled(!filled)} className="cursor-pointer">
      <Heart
        className="w-6 h-6 text-red-500 transition-all duration-200"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
      />
    </div>
  );
}

