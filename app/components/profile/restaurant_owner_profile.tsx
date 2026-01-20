import { TopBar } from "~/components/shared/top_bar";
import { BottomNav } from "~/components/shared/bottom_nav";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Restaurant } from "~/interfaces";

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    ownedRestaurants: Restaurant[];
}

export default function RestaurantOwnerProfile() {
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!keycloak.token) {
                console.log("No token available");
                return;
            }

            console.log("Fetching user data...");

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                });

                console.log("Response status:", response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log("User data:", data);
                    setUserData(data);
                } else {
                    const errorText = await response.text();
                    console.error("Failed to fetch user data. Status:", response.status, "Error:", errorText);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (initialized && keycloak.authenticated) {
            fetchUserData();
        }
    }, [initialized, keycloak.authenticated, keycloak.token]);

    if (!initialized || loading) {
        return (
            <div className="relative min-h-screen bg-white dark:bg-zinc-950">
                <TopBar isLoginPage={false} />
                <div
                    className="w-full flex items-center justify-center"
                    style={{ height: "calc(100vh - 150px)" }}
                >
                    <p className="text-sm opacity-60 text-gray-900 dark:text-gray-200">Loading profile…</p>
                </div>
                <div className="fixed bottom-0 left-0 w-full z-50">
                    <BottomNav />
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="relative min-h-screen bg-white dark:bg-zinc-950">
                <TopBar isLoginPage={false} />
                <div
                    className="w-full flex items-center justify-center"
                    style={{ height: "calc(100vh - 150px)" }}
                >
                    <p className="text-sm opacity-60 text-gray-900 dark:text-gray-200">Failed to load profile</p>
                </div>
                <div className="fixed bottom-0 left-0 w-full z-50">
                    <BottomNav />
                </div>
            </div>
        );
    }

    const handleRestaurantSelect = (restaurantId: string) => {
        navigate(`/staff/menu-from-photo/${restaurantId}`);
    };

    const handleMenuFormSelect = (restaurantId: string) => {
        navigate(`/staff/menu-from-form/${restaurantId}`);
    };

    return (
        <div className="relative min-h-screen bg-white dark:bg-zinc-950">
            <TopBar isLoginPage={false} />
            <div
                className="w-full flex flex-col items-center px-4 py-6"
                style={{ minHeight: "calc(100vh - 150px)" }}
            >
                <div className="w-full max-w-md">
                    <div className="mb-6 text-center">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {userData.firstName} {userData.lastName}
                        </p>
                        <p className="text-sm opacity-80 mt-1 text-gray-800 dark:text-gray-300">
                            {userData.email}
                        </p>
                        <p className="text-sm opacity-60 text-gray-700 dark:text-gray-400">
                            @{userData.username}
                        </p>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
                            Your restaurants
                        </h2>
                        {!userData.ownedRestaurants || userData.ownedRestaurants.length === 0 ? (
                            <p className="text-center text-gray-900 dark:text-gray-300">
                                You don't have any restaurants yet.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {userData.ownedRestaurants.map((restaurant) => (
                                    <div
                                        key={restaurant.id}
                                        className="p-4 border rounded-lg border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                                    >
                                        <div className="mb-3">
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {restaurant.name}
                                            </p>
                                            {restaurant.description && (
                                                <p className="text-sm opacity-60 mt-1 text-gray-700 dark:text-gray-400">
                                                    {restaurant.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="flex-1 px-3 py-2 rounded text-sm font-medium text-white bg-[#009DE0] hover:bg-[#007bb8] transition-colors"
                                                onClick={() => handleRestaurantSelect(restaurant.id)}
                                            >
                                                Add menu from photo
                                            </button>
                                            <button
                                                className="flex-1 px-3 py-2 rounded text-sm font-medium text-white bg-[#009DE0] hover:bg-[#007bb8] transition-colors"
                                                onClick={() => handleMenuFormSelect(restaurant.id)}
                                            >
                                                Add manually
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 w-full z-50">
                <BottomNav />
            </div>
        </div>
    );
}