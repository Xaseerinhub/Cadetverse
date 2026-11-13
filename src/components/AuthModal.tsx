import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { CrestLogo } from './CrestLogo';
import { useAuth } from '../lib/authContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'recovery';
  initialSuccessMessage?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  initialSuccessMessage = null,
}) => {
  const {
    user,
    session,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordResetEmail,
    updateUserPassword,
    isPasswordRecovery,
    clearRecoveryMode,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'recovery'>(
    isPasswordRecovery && session ? 'recovery' : initialMode
  );

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // UI status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(initialSuccessMessage);

  // Auto-switch to recovery mode only when a verified recovery session is active
  useEffect(() => {
    if (isPasswordRecovery && session) {
      setMode('recovery');
    }
  }, [isPasswordRecovery, session]);

  // Reset form fields and status banners whenever modal opens or closes to prevent cross-account leakage
  useEffect(() => {
    if (isOpen) {
      if (!(isPasswordRecovery && session)) {
        setMode(initialMode);
      }
      if (initialSuccessMessage) {
        setSuccessMessage(initialSuccessMessage);
        setErrorMessage(null);
      }
    } else {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setNewPassword('');
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsLoading(false);
      if (!(isPasswordRecovery && session)) {
        setMode(initialMode);
      }
    }
  }, [isOpen, initialMode, initialSuccessMessage, isPasswordRecovery, session]);

  // Reset inputs when switching modes
  const handleSwitchMode = (newMode: 'signin' | 'signup' | 'recovery') => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  if (!isOpen) return null;

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setErrorMessage(error.message || 'Failed to sign in. Please verify your credentials.');
      } else {
        setSuccessMessage('Signed in successfully.');
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter an email address and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const { error, user: createdUser } = await signUpWithEmail(email, password, fullName);
      if (error) {
        setErrorMessage(error.message || 'Failed to create account.');
      } else {
        if (createdUser && createdUser.identities && createdUser.identities.length === 0) {
          setErrorMessage('An account with this email already exists. Please sign in instead.');
        } else {
          setSuccessMessage(
            'Account created successfully! If email confirmation is enabled on your Supabase project, check your inbox.'
          );
          setTimeout(() => {
            onClose();
          }, 1800);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Reset Email
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your account email address.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await sendPasswordResetEmail(email);
      if (error) {
        setErrorMessage(error.message || 'Failed to send password recovery email.');
      } else {
        setSuccessMessage(
          'Password recovery email sent! Check your inbox for the reset link.'
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred while requesting password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Set New Password (after recovery link redirect)
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!session) {
      setErrorMessage('Your password recovery session has expired or is invalid. Please request a new recovery link.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await updateUserPassword(newPassword);
      if (error) {
        setErrorMessage(error.message || 'Failed to update password.');
      } else {
        setSuccessMessage('Password updated successfully! You can now use your new password.');
        clearRecoveryMode();
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred while updating your password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2dacb] dark:border-[#2c362d] bg-[#faf6ef] dark:bg-[#151a15]">
          <CrestLogo size="sm" />
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4] hover:bg-[#ede5d8]/60 dark:hover:bg-[#202721] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        {!(isPasswordRecovery && session) && (
          <div className="flex border-b border-[#e2dacb] dark:border-[#2c362d] text-xs font-semibold bg-[#ede5d8]/50 dark:bg-[#141814]">
            <button
              type="button"
              onClick={() => handleSwitchMode('signin')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                mode === 'signin'
                  ? 'text-[#1b4332] dark:text-[#4ade80] border-b-2 border-[#1b4332] dark:border-[#15803d] bg-white/90 dark:bg-[#1e251f]/70'
                  : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('signup')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                mode === 'signup'
                  ? 'text-[#1b4332] dark:text-[#4ade80] border-b-2 border-[#1b4332] dark:border-[#15803d] bg-white/90 dark:bg-[#1e251f]/70'
                  : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('recovery')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                mode === 'recovery'
                  ? 'text-[#1b4332] dark:text-[#4ade80] border-b-2 border-[#1b4332] dark:border-[#15803d] bg-white/90 dark:bg-[#1e251f]/70'
                  : 'text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
              }`}
            >
              Reset Password
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Tab 1: Sign In */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#1c1917] dark:text-[#f5f5f4]">Sign In to CadetVerse</h3>
                <p className="text-xs text-[#78716c] dark:text-[#a8a29e]">
                  Enter your email and password to access your cadet account.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#57534e] dark:text-[#a8a29e] mb-1 font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#78716c] dark:text-[#a8a29e] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="cadet@example.com"
                      autoComplete="email"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[#57534e] dark:text-[#a8a29e] font-medium">Password</label>
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('recovery')}
                      className="text-[11px] text-[#1b4332] hover:text-[#143527] dark:text-[#4ade80] transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#78716c] dark:text-[#a8a29e] absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-[#1b4332]/20 dark:shadow-green-950/40 transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-[#78716c] dark:text-[#a8a29e] border-t border-[#e2dacb] dark:border-[#2c362d]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signup')}
                  className="text-[#1b4332] dark:text-[#4ade80] font-semibold hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Sign Up */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#1c1917] dark:text-[#f5f5f4]">Create Cadet Account</h3>
                <p className="text-xs text-[#78716c] dark:text-[#a8a29e]">
                  Register with your email to connect with the CadetVerse community.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#57534e] dark:text-[#a8a29e] mb-1 font-medium">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#78716c] dark:text-[#a8a29e] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Asif Mahmud"
                      autoComplete="name"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#57534e] dark:text-[#a8a29e] mb-1 font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#78716c] dark:text-[#a8a29e] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="cadet@example.com"
                      autoComplete="email"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#57534e] dark:text-[#a8a29e] mb-1 font-medium">Password (Min. 6 chars)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#78716c] dark:text-[#a8a29e] absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#57534e] dark:text-[#a8a29e] mb-1 font-medium">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#78716c] dark:text-[#a8a29e] absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-[#1b4332]/20 dark:shadow-green-950/40 transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-[#78716c] dark:text-[#a8a29e] border-t border-[#e2dacb] dark:border-[#2c362d]">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signin')}
                  className="text-[#1b4332] dark:text-[#4ade80] font-semibold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* Tab 3: Password Recovery / Reset */}
          {mode === 'recovery' && (
            <div>
              {isPasswordRecovery && session ? (
                /* Subflow 3B: Set New Password after recovery link redirect */
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[#1b4332] dark:text-[#4ade80]">
                      <KeyRound className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Password Recovery</span>
                    </div>
                    <h3 className="text-base font-bold text-[#1c1917] dark:text-[#f5f5f4]">Set New Password</h3>
                    <p className="text-xs text-[#78716c] dark:text-[#a8a29e]">
                      Enter and confirm your new account password.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[#57534e] dark:text-[#a8a29e] mb-1 font-medium">New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#78716c] dark:text-[#a8a29e] absolute left-3 top-2.5" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#57534e] dark:text-[#a8a29e] mb-1 font-medium">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#78716c] dark:text-[#a8a29e] absolute left-3 top-2.5" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d] transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-[#1b4332]/20 dark:shadow-green-950/40 transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <span>Update Password</span>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Subflow 3A: Request Recovery Email (with notice if arriving from expired link) */
                <div>
                  {isPasswordRecovery && !session && (
                    <div className="mb-4 p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-300">Recovery Link Expired or Invalid</p>
                        <p className="text-[11px] text-amber-200/90 mt-0.5">
                          Your recovery session has expired or is invalid. Please enter your email below to receive a new link.
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSendResetEmail} className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[#1c1917] dark:text-[#f5f5f4]">Reset Your Password</h3>
                      <p className="text-xs text-[#78716c] dark:text-[#a8a29e]">
                        Enter your account email address and we'll send you a password recovery link.
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[#57534e] dark:text-[#a8a29e] mb-1 font-medium">Email Address</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#78716c] dark:text-[#a8a29e] absolute left-3 top-2.5" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="cadet@example.com"
                            autoComplete="email"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf6ef] dark:bg-[#131713] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d] transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] disabled:opacity-50 text-white font-medium text-xs shadow-md shadow-[#1b4332]/20 dark:shadow-green-950/40 transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending Link...</span>
                          </>
                        ) : (
                          <span>Send Recovery Link</span>
                        )}
                      </button>
                    </div>

                    <div className="pt-2 text-center text-xs text-[#78716c] dark:text-[#a8a29e] border-t border-[#e2dacb] dark:border-[#2c362d]">
                      Remembered your password?{' '}
                      <button
                        type="button"
                        onClick={() => handleSwitchMode('signin')}
                        className="text-[#1b4332] dark:text-[#4ade80] font-semibold hover:underline cursor-pointer"
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
