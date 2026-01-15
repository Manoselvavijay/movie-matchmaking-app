"use client";

import { User } from "@supabase/supabase-js";
import { X, LogOut, Camera } from "lucide-react";
import { signout } from "@/app/login/actions";

interface ProfileModalProps {
    user: User;
    onClose: () => void;
}

export default function ProfileModal({ user, onClose }: ProfileModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#141414] rounded-lg shadow-2xl border border-white/10 p-8 transform transition-all scale-100">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center gap-6">
                    <h2 className="text-2xl font-bold text-white">Profile</h2>

                    {/* Avatar Placeholder */}
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-md bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        {/* Overlay for "Change Picture" visual */}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-md cursor-pointer">
                            <Camera className="text-white" size={24} />
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Email</p>
                        <p className="text-white text-lg font-medium">{user.email}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col w-full gap-3 mt-4">
                        <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded font-medium transition flex items-center justify-center gap-2">
                            <Camera size={18} />
                            Change Picture
                        </button>

                        <form action={signout} className="w-full">
                            <button
                                type="submit"
                                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition flex items-center justify-center gap-2"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
