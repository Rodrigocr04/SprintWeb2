import React, { useEffect } from 'react';
import '../styles/Notification.css'; // We'll create this next

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount or change
  }, [onClose]);

  return (
    <div className={`notification notification-${type}`}>
      <p>{message}</p>
      <button onClick={onClose} className="notification-close-btn">
        &times; {/* Simple 'x' close button */}
      </button>
    </div>
  );
};

export default Notification; 