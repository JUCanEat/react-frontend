interface MenuActionButtonsProps {
  onApprove: () => void;
  onSaveDraft?: () => void;
  onCancel: () => void;
  isApproving: boolean;
  isSavingDraft?: boolean;
  isDisabled: boolean;
}

import { useTranslation } from 'react-i18next';

export function MenuActionButtons({
  onApprove,
  onSaveDraft,
  onCancel,
  isApproving,
  isSavingDraft = false,
  isDisabled,
}: MenuActionButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-6 flex gap-3">
      {onSaveDraft && (
        <button
          onClick={onSaveDraft}
          disabled={isApproving || isSavingDraft}
          className="flex-1 px-4 py-3 rounded font-medium text-lg disabled:opacity-50 border border-[#009DE0] bg-white text-[#009DE0] hover:bg-sky-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          {isSavingDraft ? t('menuForm.savingDraft') : t('menuForm.submitDraftMenu')}
        </button>
      )}

      <button
        onClick={onApprove}
        disabled={isApproving || isSavingDraft || isDisabled}
        className="flex-1 px-4 py-3 rounded text-white font-medium text-lg disabled:opacity-50 bg-[#009DE0] hover:bg-[#0089c4]"
      >
        {isApproving ? t('staff.approving') : t('staff.approveActivateMenu')}
      </button>

      <button
        onClick={onCancel}
        className="flex-1 px-4 py-3 rounded font-medium text-lg border border-gray-300 bg-white text-[#1B1B1B] hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        disabled={isApproving || isSavingDraft}
      >
        {t('common.goBack')}
      </button>
    </div>
  );
}
