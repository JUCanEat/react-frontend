import * as React from "react"

interface RestaurantTileProps {
    name: string
    description: string
    openNow: boolean
    onClick?: () => void
}

export function RestaurantTile({ name, description, openNow, onClick }: RestaurantTileProps) {
    return (
        <div onClick={onClick} className="w-[227px] h-[148px] rounded-xl overflow-hidden flex flex-col bg-black cursor-pointer">

            <div className="flex-1 bg-white" />

            <div className="bg-[#1B1B1B] px-3 py-2">

                <div className="flex items-center justify-between">
                    <h3 className="text-[10.5px] font-semibold leading-tight truncate text-white">
                        {name}
                    </h3>

                    <span
                        className={`text-[10.5px] font-semibold ${
                            openNow ? "text-[#2ECC71]" : "text-[#E74C3C]"
                        }`}
                    >
            {openNow ? "Open" : "Closed"}
          </span>
                </div>

                <p className="text-[8.3px] leading-snug line-clamp-2 text-white opacity-90 mt-1">
                    {description}
                </p>
            </div>

            <div className="bg-[#1B1B1B] px-3 py-[3px] flex items-center">
                <div className="w-full border-t border-dotted border-[#00000060]" />
            </div>

        </div>
    )
}
