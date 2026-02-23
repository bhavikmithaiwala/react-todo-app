export function Toast({
  message,
  onDismiss,
  onUndo,
}: {
  message: string
  onDismiss: () => void
  onUndo?: () => void
}) {
  return (
    <div className="toast">
      <span role="status">{message}</span>
      {onUndo && <button onClick={onUndo}>Undo</button>}
      <button aria-label="Dismiss notification" onClick={onDismiss}>
        ×
      </button>
    </div>
  )
}
