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
        <div className="border rounded-lg p-4" style={{ borderColor: '#1B1B1B' }}>
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold" style={{ color: '#1B1B1B' }}>
                    Dish {index + 1}
                </h3>
                <button
                    onClick={() => onRemove(index)}
                    className="px-3 py-1 rounded text-sm text-white"
                    style={{ backgroundColor: '#1B1B1B' }}
                >
                    Remove
                </button>
            </div>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#1B1B1B' }}>
                        Name
                    </label>
                    <input
                        type="text"
                        value={dish.name}
                        onChange={(e) => onDishChange(index, "name", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        style={{ borderColor: '#1B1B1B' }}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#1B1B1B' }}>
                        Category
                    </label>
                    <select
                        value={dish.category || ""}
                        onChange={(e) => onDishChange(index, "category", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        style={{ borderColor: '#1B1B1B' }}
                    >
                        {CATEGORY_OPTIONS.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#1B1B1B' }}>
                        Price (PLN)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={dish.price}
                        onChange={(e) => onDishChange(index, "price", parseFloat(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                        style={{ borderColor: '#1B1B1B' }}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#1B1B1B' }}>
                        Allergens
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {ALLERGEN_OPTIONS.map(allergen => (
                            <button
                                key={allergen}
                                type="button"
                                onClick={() => onAllergenToggle(index, allergen)}
                                className="px-3 py-1 rounded text-sm"
                                style={{
                                    backgroundColor: (dish.allergens || []).includes(allergen)
                                        ? '#009DE0'
                                        : '#F5F5F5',
                                    color: (dish.allergens || []).includes(allergen)
                                        ? 'white'
                                        : '#1B1B1B'
                                }}
                            >
                                {allergen}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}