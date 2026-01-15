import * as React from "react"
import { Card } from "~/shadcn/components/ui/card"

type MealCategoryCardProps = {
    icon: string
    label: string
    color: string
    onClick: () => void
}

export function MealCategoryCard({ icon, label, color, onClick }: MealCategoryCardProps) {
    return (
        <button
            type="button"
            className="flex flex-col items-center"
            onClick={onClick}
        >
            <Card
                className="flex h-[150px] w-[150px] items-center justify-center
                           rounded-[10px] shadow-md border-0"
                style={{ backgroundColor: color }}
            >
                <img
                    src={icon}
                    alt={label}
                    className="h-[125px] w-[125px]"
                />
            </Card>

            <span className="mt-0 font-normal tekst-[20px] text-white">
                {label}
            </span>
        </button>
    )
}

