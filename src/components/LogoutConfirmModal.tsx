import React from 'react';
import { LogOut, X, AlertCircle, Loader2 } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  errorMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] rounded-2xl shadow-2xl p-6 text-center space-y-4 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          aria-label="Cancel logout"
          className="absolute top-4 right-4 p-1 rounded-lg text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4] hover:bg-[#ede5d8]/60 dark:hover:bg-[#202721] transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Heraldic Badge / Warning Icon */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-xs">
          <LogOut className="w-6 h-6" />
        </div>

        {/* Dialog Header & Text */}
        <div className="space-y-1.5">
          <h2 id="logout-dialog-title" className="text-base font-bold text-[#1c1917] dark:text-[#f5f5f4] tracking-tight">
            Sign Out of CadetVerse?
          </h2>
          <p className="text-xs text-[#78716c] dark:text-[#a8a29e] leading-relaxed">
            Are you sure you want to log out of your cadet account? Any unsaved post drafts will be discarded.
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#e2dacb] dark:border-[#2c362d] text-xs font-medium text-[#57534e] hover:bg-[#ede5d8] dark:text-[#a8a29e] dark:hover:bg-[#202721] hover:text-[#1c1917] dark:hover:text-[#f5f5f4] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-900/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
