import * as React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";
import { menuService } from "~/api/menu_service";
import { LoadingSpinner } from "~/components/staff/common/loading_spinner";
import { MenuUploadSection } from "~/components/staff/menu/menu_upload_section";
import { CategoryGrid } from "~/components/staff/menu/category_grid";

interface StaffMenuFromPhotoProps {
    restaurantId: string;
}

export function StaffMenuFromPhoto({ restaurantId }: StaffMenuFromPhotoProps) {
    const { keycloak } = useKeycloak();
    const navigate = useNavigate();
    const [uploading, setUploading] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);

    console.log("Restaurant ID:", restaurantId);

    React.useEffect(() => {
        if (!processing || !keycloak.token) return;

        const interval = setInterval(async () => {
            try {
                const draft = await menuService.getMenuDraft(restaurantId, keycloak.token!);
                console.log("Draft menu found:", draft);

                setProcessing(false);
                clearInterval(interval);
                navigate(`/staff/menu-draft/${restaurantId}`);
            } catch (error) {
                console.log("Draft not ready yet, checking again in 3s...");
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [processing, keycloak.token, restaurantId, navigate]);

    const handleUploadImage = async (file: File) => {
        if (!keycloak.token) {
            alert("You are not logged in");
            return;
        }

        setUploading(true);

        try {
            await menuService.uploadMenuImage(restaurantId, file, keycloak.token);
            setUploading(false);
            setProcessing(true);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed: " + error);
            setUploading(false);
        }
    };

    const handleManualCategoryClick = (categoryId: string) => {
        console.log("Manual category clicked:", categoryId);
    };

    if (processing || uploading) {
        return (
            <LoadingSpinner
                message={uploading ? "Uploading image..." : "Processing menu with AI..."}
                subMessage="This may take a few moments"
                size="lg"
                fullScreen
                darkBackground
            />
        );
    }

    return (
        <div className="flex w-full justify-center bg-black">
            <div className="flex w-full max-w-md flex-col px-4 pt-6 pb-24">
                <MenuUploadSection onFileSelect={handleUploadImage} />
                <CategoryGrid onCategoryClick={handleManualCategoryClick} />
            </div>
        </div>
    );
}