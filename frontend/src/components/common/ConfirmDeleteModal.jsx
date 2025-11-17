import React from "react";

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <dialog open className="modal">
      <div className="modal-box text-center">
        <h3 className="font-bold text-lg text-error">Delete?</h3>

        <p className="py-4">
          Are you sure you want to delete <b>"{itemName}"</b>? This action
          cannot be undone.
        </p>

        <div className="modal-action flex justify-center gap-3">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error text-white" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmDeleteModal;
