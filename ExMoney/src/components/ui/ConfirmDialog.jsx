import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p style={{ marginBottom: 'var(--space-6)' }}>{message}</p>
      <div className="flex justify-between gap-3" style={{ justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onClose}>{cancelText}</Button>
        <Button variant={isDanger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
