import * as React from "react";
import { Camera, Upload } from "lucide-react";
import { UploadOptionCard } from "~/components/staff/menu/upload_option_card";

interface MenuUploadSectionProps {
    onFileSelect: (file: File) => void;
}

export function MenuUploadSection({ onFileSelect }: MenuUploadSectionProps) {
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const cameraInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleTakePicture = () => {
        cameraInputRef.current?.click();
    };

    const handleUploadFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        if (cameraInputRef.current) {
            cameraInputRef.current.value = "";
        }
    };

    return (
        <>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={cameraInputRef}
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
        </>
    );
}