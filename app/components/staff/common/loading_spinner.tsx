interface LoadingSpinnerProps {
    message: string;
    subMessage?: string;
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
    darkBackground?: boolean;
}

export function LoadingSpinner({
                                   message,
                                   subMessage,
                                   size = 'md',
                                   fullScreen = false,
                                   darkBackground = false
                               }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };

    const textColor = darkBackground ? '#009DE0' : '#1B1B1B';
    const spinnerColor = darkBackground ? '#009DE0' : '#009DE0';

    const content = (
        <div className="text-center">
            <div className="mb-4">
                <div
                    className={`animate-spin rounded-full border-t-4 border-b-4 mx-auto ${sizeClasses[size]}`}
                    style={{ borderColor: spinnerColor }}
                />
            </div>
            <p
                className={`${size === 'lg' ? 'text-xl' : 'text-base'} font-medium`}
                style={{ color: textColor }}
            >
                {message}
            </p>
            {subMessage && (
                <p className="text-sm mt-2" style={{ color: '#666' }}>
                    {subMessage}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div
                className="flex w-full h-screen justify-center items-center"
                style={{ backgroundColor: darkBackground ? 'black' : 'white' }}
            >
                {content}
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-screen">
            {content}
        </div>
    );
}