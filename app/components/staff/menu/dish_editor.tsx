import * as React from "react";
import type { Dish, Allergen } from "~/interfaces";

const ALLERGEN_OPTIONS: Allergen[] = ["GLUTEN", "LACTOSE", "MEAT", "NUTS"];
const CATEGORY_OPTIONS = ["SOUP", "MAIN_COURSE"];

interface DishEditorProps {
    dish: Dish;
    index: number;
    onDishChange: (index: number, field: keyof Dish, value: any) => void;
    onAllergenToggle: (index: number, allergen: Allergen) => void;
    onRemove: (index: number) => void;
}

export function DishEditor({ dish, index, onDishChange, onAllergenToggle, onRemove }: DishEditorProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Dish {index + 1}
                </h3>
                <button
                    onClick={() => onRemove(index)}
                    className="px-3 py-1 rounded text-sm text-white bg-[#009DE0] hover:bg-[#007bb8] transition-colors"
                >
                    Remove
                </button>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                        Name
                    </label>
                    <input
                        type="text"
                        value={dish.name}
                        onChange={(e) => onDishChange(index, "name", e.target.value)}
                        className="w-full border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                        Category
                    </label>
                    <select
                        value={dish.category || ""}
                        onChange={(e) => onDishChange(index, "category", e.target.value)}
                        className="w-full border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    >
                        {CATEGORY_OPTIONS.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                        Price (PLN)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={dish.price}
                        onChange={(e) => onDishChange(index, "price", parseFloat(e.target.value))}
                        className="w-full border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                        Allergens
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {ALLERGEN_OPTIONS.map(allergen => {
                            const selected = (dish.allergens || []).includes(allergen);
                            return (
                                <button
                                    key={allergen}
                                    type="button"
                                    onClick={() => onAllergenToggle(index, allergen)}
                                    className={`px-3 py-1 rounded text-sm border transition-colors ${selected ? 'bg-[#009DE0] text-white border-[#009DE0]' : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700'}`}
                                >
                                    {allergen}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}