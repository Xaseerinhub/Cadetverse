import React, { useState } from 'react';
import {
  KeyRound,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { CrestLogo } from './CrestLogo';
import { useAuth, validateNewPasswordInput } from '../lib/authContext';

interface RecoveryScreenProps {
  onRecoveryComplete: () => void;
  onReturnToSignIn: () => void;
}

export const RecoveryScreen: React.FC<RecoveryScreenProps> = ({
  onRecoveryComplete,
  onReturnToSignIn,
}) => {
  const {
    user,
    session,
    isPasswordRecovery,
    recoveryError,
    updateUserPassword,
    sendPasswordResetEmail,
    signOut,
    clearRecoveryMode,
    clearRecoveryError,
  } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetEmail, setResetEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const hasValidRecoverySession = Boolean(isPasswordRecovery && session && !recoveryError);

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const validationError = validateNewPasswordInput(newPassword, confirmPassword);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await updateUserPassword(newPassword);
      if (error) {
        setFormError(error.message || 'Unable to update your password. Please try again.');
        return;
      }

      setNewPassword('');
      setConfirmPassword('');
      setFormSuccess('Your password has been updated. Redirecting to sign in...');
      onRecoveryComplete();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'An unexpected error occurred while updating your password.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestNewLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!resetEmail.trim()) {
      setFormError('Please enter your account email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await sendPasswordResetEmail(resetEmail);
      if (error) {
        setFormError(error.message || 'Failed to send password recovery email.');
      } else {
        setFormSuccess(
          'A new password recovery link has been sent to your email address. Please check your inbox.'
        );
      }
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'An error occurred while sending the recovery email.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAndExit = async () => {
    setFormError(null);
    setFormSuccess(null);
    if (session) {
      await signOut();
    }
    clearRecoveryMode();
    clearRecoveryError();
    onReturnToSignIn();
  };

  return (
    <div className="min-h-screen bg-[#f4efe6] text-[#1c1917] dark:bg-[#121612] dark:text-[#f5f5f4] flex flex-col items-center justify-center p-4 font-['Plus_Jakarta_Sans'] transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] rounded-2xl shadow-xl overflow-hidden">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-[#e2dacb] dark:border-[#2c362d] bg-[#faf6ef] dark:bg-[#151a15] flex items-center justify-between">
          <CrestLogo size="sm" />
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#1b4332] dark:text-[#4ade80]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Account Recovery
          </span>
        </div>

        <div className="p-6 space-y-5">
          {formError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/40 text-red-800 dark:text-red-200 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div
              role="status"
              className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{formSuccess}</span>
            </div>
          )}

          {hasValidRecoverySession ? (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#1b4332] dark:text-[#4ade80]">
                  <KeyRound className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Verified Recovery Session
                  </span>
                </div>
                <h1 className="text-lg font-bold text-[#1c1917] dark:text-[#f5f5f4]">
                  Set New Password
                </h1>
                <p className="text-xs text-[#78716c] dark:text-[#a8a29e]">
                  {user?.email
                    ? `Choose a new password for ${user.email}. You will be asked to sign in again once updated.`
                    : 'Enter and confirm your new password below. You will be directed to sign in once updated.'}
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label
                    htmlFor="recovery-new-password"
                    className="block text-[#57534e] dark:text-[#a8a29e] mb-1 font-medium"
                  >
                    New Password (Min. 6 characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#78716c] dark:text-[#a8a29e] absolute left-3 top-2.5" />
                    <input
                      id="recovery-new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      className="w-full pl-9 pr-9 py-2 rounded-xl bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                      className="absolute right-2.5 top-2 text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4] p-0.5 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="recovery-confirm-password"
                    className="block text-[#57534e] dark:text-[#a8a29e] mb-1 font-medium"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#78716c] dark:text-[#a8a29e] absolute left-3 top-2.5" />
                    <input
                      id="recovery-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      className="w-full pl-9 pr-9 py-2 rounded-xl bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      className="absolute right-2.5 top-2 text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4] p-0.5 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-[#1b4332]/20 dark:shadow-green-950/40 transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>

              <div className="pt-3 border-t border-[#e2dacb] dark:border-[#2c362d] flex justify-center">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCancelAndExit}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancel and return to sign in</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-950 dark:text-amber-300">
                    Recovery Link Invalid or Expired
                  </p>
                  <p className="mt-0.5 leading-relaxed">
                    {recoveryError ||
                      'Your password recovery link is invalid, expired, or has already been used. Request a new recovery link below.'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleRequestNewLink} className="space-y-3 text-xs">
                <div>
                  <label
                    htmlFor="recovery-request-email"
                    className="block text-[#57534e] dark:text-[#a8a29e] mb-1 font-medium"
                  >
                    Account Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#78716c] dark:text-[#a8a29e] absolute left-3 top-2.5" />
                    <input
                      id="recovery-request-email"
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="cadet@example.com"
                      autoComplete="email"
                      disabled={isSubmitting}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-[#1b4332]/20 dark:shadow-green-950/40 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending New Link...</span>
                    </>
                  ) : (
                    <span>Send New Recovery Link</span>
                  )}
                </button>
              </form>

              <div className="pt-3 border-t border-[#e2dacb] dark:border-[#2c362d] flex justify-center">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCancelAndExit}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1b4332] dark:text-[#4ade80] hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
