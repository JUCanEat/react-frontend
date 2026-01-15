import { TopBar } from "~/components/shared/top_bar";
import { BottomNav } from "~/components/shared/bottom_nav";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Restaurant {
    id: string;
    name: string;
    description?: string;
}

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
                const response = await fetch("http://localhost:8080/api/users/me", {
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
            <>
                <TopBar isLoginPage={false} />
                <div
                    className="w-full flex items-center justify-center"
                    style={{ height: "calc(100vh - 150px)" }}
                >
                    <p className="text-sm opacity-60">Loading profile…</p>
                </div>
                <BottomNav />
            </>
        );
    }

    if (!userData) {
        return (
            <>
                <TopBar isLoginPage={false} />
                <div
                    className="w-full flex items-center justify-center"
                    style={{ height: "calc(100vh - 150px)" }}
                >
                    <p className="text-sm opacity-60">Failed to load profile</p>
                </div>
                <BottomNav />
            </>
        );
    }

    const handleRestaurantSelect = (restaurantId: string) => {
        navigate(`/staff/menu-from-photo/${restaurantId}`);
    };

    return (
        <>
            <TopBar isLoginPage={false} />

            <div
                className="w-full flex flex-col items-center px-4 py-6"
                style={{ minHeight: "calc(100vh - 150px)" }}
            >
                <div className="w-full max-w-md">
                    <div className="mb-6 text-center">
                        <p className="text-lg font-semibold" style={{ color: '#1B1B1B' }}>
                            {userData.firstName} {userData.lastName}
                        </p>
                        <p className="text-sm opacity-80 mt-1" style={{ color: '#1B1B1B' }}>
                            {userData.email}
                        </p>
                        <p className="text-sm opacity-60" style={{ color: '#1B1B1B' }}>
                            @{userData.username}
                        </p>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4 text-center" style={{ color: '#1B1B1B' }}>
                            Your restaurants
                        </h2>

                        {!userData.ownedRestaurants || userData.ownedRestaurants.length === 0 ? (
                            <p className="text-center" style={{ color: '#1B1B1B' }}>
                                You don't have any restaurants yet.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {userData.ownedRestaurants.map((restaurant) => (
                                    <div
                                        key={restaurant.id}
                                        className="p-4 border rounded-lg"
                                        style={{ borderColor: '#1B1B1B' }}
                                    >
                                        <div className="mb-3">
                                            <p className="text-lg font-semibold" style={{ color: '#1B1B1B' }}>
                                                {restaurant.name}
                                            </p>
                                            {restaurant.description && (
                                                <p className="text-sm opacity-60 mt-1" style={{ color: '#1B1B1B' }}>
                                                    {restaurant.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                className="flex-1 px-3 py-2 rounded text-sm text-white font-medium"
                                                style={{ backgroundColor: '#009DE0' }}
                                                onClick={() => handleRestaurantSelect(restaurant.id)}
                                            >
                                                Add menu from photo
                                            </button>

                                            <button
                                                className="flex-1 px-3 py-2 rounded text-sm font-medium opacity-50"
                                                style={{
                                                    backgroundColor: 'white',
                                                    color: '#1B1B1B',
                                                    border: '1px solid #1B1B1B'
                                                }}
                                                disabled
                                            >
                                                Add manually (soon)
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BottomNav />
        </>
    );
}