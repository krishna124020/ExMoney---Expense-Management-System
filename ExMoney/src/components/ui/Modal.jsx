import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import './ui.css';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center" style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
          <h3 className="h3">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
        <div style={{ padding: 'var(--space-4)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
