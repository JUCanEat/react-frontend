interface MenuActionButtonsProps {
    onApprove: () => void;
    onCancel: () => void;
    isApproving: boolean;
    isDisabled: boolean;
}

export function MenuActionButtons({
                                      onApprove,
                                      onCancel,
                                      isApproving,
                                      isDisabled
                                  }: MenuActionButtonsProps) {
    return (
        <div className="mt-6 flex gap-3">
            <button
                onClick={onApprove}
                disabled={isApproving || isDisabled}
                className="flex-1 px-4 py-3 rounded text-white font-medium text-lg disabled:opacity-50"
                style={{ backgroundColor: '#009DE0' }}
            >
                {isApproving ? "Approving..." : "Approve & Activate Menu"}
            </button>

            <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 rounded font-medium text-lg"
                disabled={isApproving}
                style={{
                    backgroundColor: 'white',
                    color: '#1B1B1B',
                    border: '1px solid #1B1B1B',
                    opacity: isApproving ? 0.5 : 1
                }}
            >
                Cancel
            </button>
        </div>
    );
}