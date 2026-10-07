type ConfirmDialogProps = {
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div role="alertdialog" aria-label={message} className="confirm-dialog">
      <p>{message}</p>
      <div className="confirm-dialog-actions">
        <button type="button" className="action" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button type="button" className="action action-danger-solid" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
