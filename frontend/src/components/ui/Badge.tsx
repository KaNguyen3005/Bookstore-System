import React from 'react';
import './ui.css';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'teal' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  return (
    <span className={`ui-badge ui-badge-${variant} ${className}`}>
      {children}
    </span>
  );
};
