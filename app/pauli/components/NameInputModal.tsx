"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface NameInputModalProps {
  onSubmit: (name: string) => Promise<void> | void;
  onClose: () => void;
  error: string | null;
}

export default function NameInputModal({
  onSubmit,
  onClose,
  error,
}: NameInputModalProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(name.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60] backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="name-modal-title"
    >
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-xl">
        <h2 id="name-modal-title" className="text-2xl font-bold mb-6">
          Selamat! 🎉
        </h2>
        <p className="text-gray-600 mb-6">
          Masukkan namamu untuk masuk papan peringkat.
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan namamu"
          id="player-name"
          name="player-name"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-100"
          maxLength={50}
          disabled={isSubmitting}
          aria-label="Nama pemain"
        />
        {error && (
          <p className="text-red-500 mb-6" role="alert">
            {error}
          </p>
        )}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Lewati
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
            className="flex-1 py-2 bg-ink text-white rounded-lg hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2
                  className="animate-spin h-5 w-5 text-white"
                  aria-hidden="true"
                />
                Mengirim...
              </>
            ) : (
              "Kirim"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
