"use client";

import React from "react";

type DeleteModalProps = {
  projectName: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteModal: React.FC<DeleteModalProps> = ({
  projectName,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-primary p-8 border-[5px] border-black shadow-100 max-w-sm">
        <h2 className="text-2xl font-bold mb-4 uppercase">Confirm Deletion</h2>
        <p className="mb-6 text-lg">
          Are you sure you want to delete <strong>{projectName}</strong>?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-3 border-[5px] border-black bg-white text-black font-bold rounded-full shadow-100 hover:bg-black hover:text-white transition-all duration-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 border-[5px] border-black bg-white text-black font-bold rounded-full shadow-100 hover:bg-red-500 hover:text-white transition-all duration-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
