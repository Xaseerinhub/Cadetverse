import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Check, 
  FileText, 
  Activity
} from 'lucide-react';
import { VerificationRequest } from '../types';
import { INITIAL_VERIFICATIONS } from '../data/mockData';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verifications' | 'stats'>('verifications');
  const [verifications, setVerifications] = useState<VerificationRequest[]>(INITIAL_VERIFICATIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleVerify = (id: string, approve: boolean) => {
    setVerifications((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: approve ? 'verified' : 'rejected' } : v
      )
    );
    setToastMessage(approve ? 'Cadet identity verified and badge issued.' : 'Verification request rejected.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const pendingCount = verifications.filter((v) => v.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] shadow-xs">
        <div className="flex items-center gap-2 text-[#1b4332] dark:text-[#4ade80] mb-1.5 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Cadet College Council Administration & Moderation</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1c1917] dark:text-[#f5f5f4] tracking-tight">
          Verification & Council Governance
        </h1>
        <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a8a29e] mt-1 max-w-2xl leading-relaxed">
          Manage cadet roll authentication, cross-reference Cadet Numbers with MECA/OFA/ORCA registers, and oversee community standards.
        </p>

        {/* Tab switcher */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'verifications'
                ? 'bg-[#1b4332] text-white dark:bg-[#15803d]'
                : 'bg-[#faf6ef] dark:bg-[#121612] text-[#57534e] dark:text-[#a8a29e] hover:text-[#1c1917] dark:hover:text-[#f5f5f4] border border-[#e2dacb] dark:border-[#2c362d]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Alumni Verification Queue ({pendingCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'stats'
                ? 'bg-[#1b4332] text-white dark:bg-[#15803d]'
                : 'bg-[#faf6ef] dark:bg-[#121612] text-[#57534e] dark:text-[#a8a29e] hover:text-[#1c1917] dark:hover:text-[#f5f5f4] border border-[#e2dacb] dark:border-[#2c362d]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Platform Metrics</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-[#1b4332]/10 dark:bg-[#15803d]/20 border border-[#1b4332]/30 dark:border-[#15803d]/40 text-[#1b4332] dark:text-[#4ade80] text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tab 1: Verification Queue */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#57534e] dark:text-[#a8a29e] uppercase tracking-wider">
              Pending Cadet Verifications
            </span>
            <span className="text-xs text-[#78716c] dark:text-[#a8a29e] font-mono">
              Auto-matched with College Roll Books
            </span>
          </div>

          <div className="space-y-3">
            {verifications.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1c1917] dark:text-[#f5f5f4]">{item.cadetName}</span>
                    <span className="font-mono text-xs text-[#1b4332] dark:text-[#4ade80]">
                      Cadet #{item.cadetNumber}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium capitalize ${
                        item.status === 'verified'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                          : item.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#78716c] dark:text-[#a8a29e] flex-wrap">
                    <span>{item.college}</span>
                    <span aria-hidden="true">·</span>
                    <span>Intake {item.intake}th</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.house}</span>
                    <span aria-hidden="true">·</span>
                    <span>Class of {item.graduatingYear}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#78716c] dark:text-[#a8a29e] pt-1">
                    <FileText className="w-3.5 h-3.5 text-[#5c3d2e] dark:text-[#ea580c]" />
                    <span className="text-[#5c3d2e] dark:text-[#fb923c] underline cursor-pointer">
                      {item.proofDocument}
                    </span>
                    <span className="text-[#a8a29e] text-[11px] ml-2">
                      Submitted {item.submittedAt}
                    </span>
                  </div>
                </div>

                {item.status === 'pending' ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleVerify(item.id, false)}
                      className="px-3.5 py-1.5 rounded-xl border border-[#e2dacb] dark:border-[#2c362d] text-[#78716c] hover:text-rose-600 dark:hover:text-rose-400 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerify(item.id, true)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Verify</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-[#78716c] dark:text-[#a8a29e] font-medium">
                    Processed by Council Moderator
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Platform Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] shadow-xs">
              <span className="text-xs font-semibold text-[#78716c] dark:text-[#a8a29e] block mb-1">
                Verified Cadets & Alumni
              </span>
              <span className="text-2xl font-bold text-[#1c1917] dark:text-[#f5f5f4] font-mono tabular-nums">
                14,820
              </span>
              <span className="text-[11px] text-[#1b4332] dark:text-[#4ade80] block mt-1">
                +142 this week across 12 colleges
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] shadow-xs">
              <span className="text-xs font-semibold text-[#78716c] dark:text-[#a8a29e] block mb-1">
                Active Batch Communities
              </span>
              <span className="text-2xl font-bold text-[#1c1917] dark:text-[#f5f5f4] font-mono tabular-nums">
                386
              </span>
              <span className="text-[11px] text-[#5c3d2e] dark:text-[#ea580c] block mt-1">
                Covering Intakes 1st to 62nd
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] shadow-xs">
              <span className="text-xs font-semibold text-[#78716c] dark:text-[#a8a29e] block mb-1">
                Verification Accuracy
              </span>
              <span className="text-2xl font-bold text-[#1c1917] dark:text-[#f5f5f4] font-mono tabular-nums">
                99.4%
              </span>
              <span className="text-[11px] text-[#78716c] dark:text-[#a8a29e] block mt-1">
                Zero impersonation incidents
              </span>
            </div>
          </div>

          {/* College Engagement Leaderboard */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-[#1c1917] dark:text-[#f5f5f4]">
              Colleges Engagement & Alumni Nexus Index
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Mirzapur Cadet College (MCC)', members: '2,890 members', pct: '92%' },
                { name: 'Faujdarhat Cadet College (FCC)', members: '2,450 members', pct: '88%' },
                { name: 'Rajshahi Cadet College (RCC)', members: '2,130 members', pct: '82%' },
                { name: 'Mymensingh Girls\' Cadet College (MGCC)', members: '1,670 members', pct: '79%' },
                { name: 'Jhenaidah Cadet College (JCC)', members: '1,450 members', pct: '74%' },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf6ef] dark:bg-[#121612] border border-[#e2dacb]/60 dark:border-[#2c362d]/60">
                  <span className="font-medium text-[#1c1917] dark:text-[#f5f5f4]">{c.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#78716c] dark:text-[#a8a29e]">{c.members}</span>
                    <span className="font-mono text-[#1b4332] dark:text-[#4ade80] font-bold">{c.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
