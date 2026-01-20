import * as React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import { menuService } from "~/api/menu_service";
import type { DailyMenu, Dish, Allergen } from "~/interfaces";
import { LoadingSpinner } from "~/components/staff/common/loading_spinner";
import { ErrorState, EmptyState } from "~/components/staff/common/error_state";
import { StatusBanner } from "~/components/staff/common/status_banner";
import { DishEditor } from "~/components/staff/menu/dish_editor";
import { MenuActionButtons } from "~/components/staff/menu/menu_action_buttons";

interface StaffMenuDraftProps {
    restaurantId: string;
}

export function StaffMenuDraft({ restaurantId }: StaffMenuDraftProps) {
    const { keycloak } = useKeycloak();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [menu, setMenu] = React.useState<DailyMenu | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchDraft = async () => {
            if (!keycloak.token) return;

            try {
                const draft = await menuService.getMenuDraft(restaurantId, keycloak.token);
                setMenu(draft);
            } catch (error) {
                console.error("Failed to fetch draft:", error);
                setError("Failed to load menu draft");
            } finally {
                setLoading(false);
            }
        };

        fetchDraft();
    }, [keycloak.token, restaurantId]);

    const handleDishChange = (index: number, field: keyof Dish, value: any) => {
        if (!menu || !menu.dishes) return;

        const updatedDishes = [...menu.dishes];
        updatedDishes[index] = {
            ...updatedDishes[index],
            [field]: value,
        };

        setMenu({
            ...menu,
            dishes: updatedDishes,
        });
    };

    const handleAllergenToggle = (dishIndex: number, allergen: Allergen) => {
        if (!menu || !menu.dishes) return;

        const dish = menu.dishes[dishIndex];
        const allergens = dish.allergens || [];

        const updatedAllergens = allergens.includes(allergen)
            ? allergens.filter(a => a !== allergen)
            : [...allergens, allergen];

        handleDishChange(dishIndex, "allergens", updatedAllergens);
    };

    const handleRemoveDish = (index: number) => {
        if (!menu || !menu.dishes) return;

        const updatedDishes = menu.dishes.filter((_, i) => i !== index);
        setMenu({
            ...menu,
            dishes: updatedDishes,
        });
    };

    const handleApprove = async () => {
        if (!menu || !keycloak.token) return;

        setSaving(true);
        setError(null);

        try {
            await menuService.approveMenu(restaurantId, menu, keycloak.token);
            setTimeout(() => {
                navigate(`/menu?restaurantId=${restaurantId}`);
            }, 1500);
        } catch (error) {
            console.error("Failed to approve menu:", error);
            setError("Failed to approve menu. Please try again.");
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading draft..." />;
    }

    if (error && !menu) {
        return <ErrorState message={error} />;
    }

    if (!menu || !menu.dishes) {
        return <EmptyState message="No draft found" />;
    }

    return (
        <div className="w-full min-h-screen bg-white p-4">
            <div className="max-w-4xl mx-auto">
                {saving && <StatusBanner type="success" message="Approving menu..." showSpinner />}
                {error && menu && <StatusBanner type="error" message={error} />}

                <h1 className="text-2xl font-semibold mb-6" style={{ color: '#1B1B1B' }}>
                    Review Menu Draft
                </h1>

                <div className="space-y-4">
                    {menu.dishes.map((dish, index) => (
                        <DishEditor
                            key={index}
                            dish={dish}
                            index={index}
                            onDishChange={handleDishChange}
                            onAllergenToggle={handleAllergenToggle}
                            onRemove={handleRemoveDish}
                        />
                    ))}
                </div>

                <MenuActionButtons
                    onApprove={handleApprove}
                    onCancel={() => navigate("/profile")}
                    isApproving={saving}
                    isDisabled={menu.dishes.length === 0}
                />
            </div>
        </div>
    );
}