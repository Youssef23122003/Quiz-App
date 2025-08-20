import React from 'react';
import { FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import deleteimg from "../../assets/Delete-DKXDOf48.png";

interface DeleteModalProps {
  show: boolean;
  onClose: () => void;
  onDeleteConfirm: () => void;
  title: string;
  message: string; // الرسالة المخصصة
  loading: boolean;
}

export default function DeleteModal({
  show,
  onClose,
  onDeleteConfirm,
  title,
  message,
  loading
}: DeleteModalProps) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-black">{title}</h3>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onDeleteConfirm}
              disabled={loading}
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaCheck className="text-xl" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 h-[300px] flex flex-col items-center justify-center text-center text-gray-700">
          <img src={deleteimg} alt="Delete" className="w-60 h-60 mb-1" />
          <p className="text-lg font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}
