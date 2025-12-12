import * as React from "react"
import { Camera, Upload } from "lucide-react"

import { UploadOptionCard } from "~/components/staff/upload_option_card"
import { MealCategoryCard } from "~/components/staff/meal_category_card"

import MainIcon from "~/assets/food_category_icons/main.svg"
import SoupsIcon from "~/assets/food_category_icons/soups.svg"
import PizzaIcon from "~/assets/food_category_icons/pizza.svg"
import DessertsIcon from "~/assets/food_category_icons/desserts.svg"
import DrinksIcon from "~/assets/food_category_icons/drinks.svg"

const categories = [
    { id: "main", label: "Main Courses", icon: MainIcon, color: "#445142" },
    { id: "soups", label: "Soups", icon: SoupsIcon, color: "#7592A1" },
    { id: "pizza", label: "Pizza", icon: PizzaIcon, color: "#503E62" },
    { id: "desserts", label: "Desserts", icon: DessertsIcon, color: "#AEA572" },
    { id: "drinks", label: "Drinks", icon: DrinksIcon, color: "#325C55" },
]

export function StaffMenuFromPhoto() {
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleTakePicture = () => {
        console.log("Take a picture clicked");
    };

    const handleUploadFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        console.log("Selected image (not uploaded):", file);

        alert("Image selected. Upload functionality will be added later.");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleManualCategoryClick = (categoryId: string) => {
        console.log("Manual category clicked:", categoryId);
    };

    const rows = [];
    for (let i = 0; i < categories.length; i += 2) {
        rows.push(categories.slice(i, i + 2));
    }

    return (
        <div className="flex w-full justify-center bg-black">
            <div className="flex w-full max-w-md flex-col px-4 pt-6 pb-24">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />

                <div className="mb-10 grid grid-cols-[auto_auto] justify-center gap-0">
                    <UploadOptionCard
                        Icon={Camera}
                        label="Take a Picture"
                        onClick={handleTakePicture}
                    />

                    <UploadOptionCard
                        Icon={Upload}
                        label="Upload File"
                        onClick={handleUploadFileClick}
                    />
                </div>

                <div className="mb-6 text-center">
                    <p className="text-[20px] font-medium text-[#009DE0]">
                        Change Manually
                    </p>
                </div>

                <div className="flex flex-col items-center gap-y-[30px]">
                    {rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-[30px]">
                            {row.map((category) => (
                                <MealCategoryCard
                                    key={category.id}
                                    icon={category.icon}
                                    label={category.label}
                                    color={category.color}
                                    onClick={() => handleManualCategoryClick(category.id)}
                                />
                            ))}

                            {row.length === 1 && (
                                <div className="h-[150px] w-[150px] invisible" />
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}
