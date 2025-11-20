// backend
export interface Restaurant {
    id: string;
    name: string;
    description: string;
    photoPath: string;
    location: {
        id: string;
        latitude: { value: number };
        longitude: { value: number };
    };
    openNow: boolean;
}

// mocks
export interface MockDiningPointInfoProps {
    selectedPoint: {
        name: string;
        description: string;
    } | null;
    onClose: () => void;
}