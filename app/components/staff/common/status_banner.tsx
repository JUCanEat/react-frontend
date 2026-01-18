interface StatusBannerProps {
    type: 'success' | 'error';
    message: string;
    showSpinner?: boolean;
}

export function StatusBanner({ type, message, showSpinner = false }: StatusBannerProps) {
    const styles = {
        success: {
            backgroundColor: '#E3F2FD',
            borderColor: '#009DE0',
            textColor: '#009DE0',
            spinnerColor: '#009DE0'
        },
        error: {
            backgroundColor: '#FFE5E5',
            borderColor: '#FF6B6B',
            textColor: '#D32F2F',
            spinnerColor: '#D32F2F'
        }
    };

    const style = styles[type];

    return (
        <div
            className="mb-6 p-4 rounded-lg"
            style={{ backgroundColor: style.backgroundColor, border: `1px solid ${style.borderColor}` }}
        >
            <div className="flex items-center gap-3">
                {showSpinner && (
                    <div
                        className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2"
                        style={{ borderColor: style.spinnerColor }}
                    />
                )}
                <p className="font-medium" style={{ color: style.textColor }}>
                    {message}
                </p>
            </div>
        </div>
    );
}