import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Allow time for fade out
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <div className="fixed right-5 top-5 z-50">
      <div
        className={`transform transition-opacity duration-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"} rounded-md bg-gray-800 px-4 py-2 text-white shadow-lg`}
      >
        {message}
      </div>
    </div>
  );
};

export default Toast;
