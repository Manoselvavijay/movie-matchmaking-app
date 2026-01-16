"use client";

import { AlertTriangle } from "lucide-react";

interface LeaveModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export default function LeaveModal({ onConfirm, onCancel }: LeaveModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 max-w-md w-full text-center shadow-2xl">
                <div className="mx-auto w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="text-red-500" size={24} />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Leave Game?</h3>
                <p className="text-gray-400 mb-6">
                    If you leave, your friend will also be forced to leave the game. This action cannot be undone.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
                    >
                        Leave Anyway
                    </button>
                </div>
            </div>
        </div>
    );
}
