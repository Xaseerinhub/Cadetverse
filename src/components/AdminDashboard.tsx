import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  AlertTriangle, 
  Check, 
  X, 
  FileText, 
  Users, 
  Activity,
  Award
} from 'lucide-react';
import { VerificationRequest } from '../types';
import { INITIAL_VERIFICATIONS } from '../data/mockData';
import { formatHouseLabel, getCollege } from '../data/collegeReference';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verifications' | 'reports' | 'stats'>('verifications');
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
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400 mb-1.5 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Cadet College Council Administration & Moderation</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Verification & Council Governance
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Manage cadet roll authentication, cross-reference Cadet Numbers with MECA/OFA/ORCA registers, and oversee community standards.
        </p>

        {/* Tab switcher */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'verifications'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Alumni Verification Queue ({pendingCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'stats'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Platform Metrics</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 rounded-xl bg-indigo-900/60 border border-indigo-500/40 text-indigo-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tab 1: Verification Queue */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Pending Cadet Verifications
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Auto-matched with College Roll Books
            </span>
          </div>

          <div className="space-y-3">
            {verifications.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{item.cadetName}</span>
                    <span className="font-mono text-xs text-indigo-400">
                      Cadet #{item.cadetNumber}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium capitalize ${
                        item.status === 'verified'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : item.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                    <span>{getCollege(item.collegeCode)?.name}</span>
                    <span aria-hidden="true">·</span>
                    <span>Intake {item.intake}th</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatHouseLabel(item.houseId)}</span>
                    <span aria-hidden="true">·</span>
                    <span>Class of {item.graduatingYear}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-indigo-300 underline cursor-pointer">
                      {item.proofDocument}
                    </span>
                    <span className="text-slate-500 text-[11px] ml-2">
                      Submitted {item.submittedAt}
                    </span>
                  </div>
                </div>

                {item.status === 'pending' ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleVerify(item.id, false)}
                      className="px-3 py-1.5 rounded-xl border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerify(item.id, true)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Verify</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 font-medium">
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
            <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                Verified Cadets & Alumni
              </span>
              <span className="text-2xl font-bold text-white font-mono tabular-nums">
                14,820
              </span>
              <span className="text-[11px] text-emerald-400 block mt-1">
                +142 this week across 12 colleges
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                Active Batch Communities
              </span>
              <span className="text-2xl font-bold text-white font-mono tabular-nums">
                386
              </span>
              <span className="text-[11px] text-indigo-400 block mt-1">
                Covering Intakes 1st to 62nd
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                Verification Accuracy
              </span>
              <span className="text-2xl font-bold text-white font-mono tabular-nums">
                99.4%
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">
                Zero impersonation incidents
              </span>
            </div>
          </div>

          {/* College Engagement Leaderboard */}
          <div className="p-5 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">
              Colleges Engagement & Alumni Nexus Index
            </h3>
            <div className="space-y-2 text-xs">
              {([
                { code: 'MCC', members: '2,890 members', pct: '92%' },
                { code: 'FCC', members: '2,450 members', pct: '88%' },
                { code: 'RCC', members: '2,130 members', pct: '82%' },
                { code: 'MGCC', members: '1,670 members', pct: '79%' },
                { code: 'JCC', members: '1,450 members', pct: '74%' },
              ] as const).map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                  <span className="font-medium text-slate-200">{getCollege(c.code)?.name} ({c.code})</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{c.members}</span>
                    <span className="font-mono text-indigo-400 font-bold">{c.pct}</span>
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
