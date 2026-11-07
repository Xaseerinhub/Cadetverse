import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Sparkles, ArrowRight, Check } from 'lucide-react';
import { CadetUser, CadetCollegeCode } from '../types';
import { CADET_COLLEGES, DEMO_USERS } from '../data/mockData';
import { CrestLogo } from './CrestLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CadetUser;
  onSelectUser: (user: CadetUser) => void;
  onRegisterUser: (newUser: CadetUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onRegisterUser,
}) => {
  const [authMode, setAuthMode] = useState<'switcher' | 'login' | 'register'>('switcher');
  
  // Registration form state
  const [name, setName] = useState('');
  const [cadetNumber, setCadetNumber] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<CadetCollegeCode>('MCC');
  const [intake, setIntake] = useState<number>(45);
  const [house, setHouse] = useState('Fazlul Huq House');
  const [profession, setProfession] = useState('Software Engineer');
  const [registeredToast, setRegisteredToast] = useState(false);

  if (!isOpen) return null;

  const currentCollegeObj = CADET_COLLEGES.find((c) => c.code === selectedCollege) || CADET_COLLEGES[0];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cadetNumber.trim()) return;

    const newUser: CadetUser = {
      id: `cadet_${Date.now()}`,
      name: name.trim(),
      cadetNumber: cadetNumber.trim(),
      college: currentCollegeObj.name,
      collegeCode: selectedCollege,
      intake: intake || 45,
      house: house || currentCollegeObj.houses[0],
      houseColor: '#6366f1',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      coverImage: '/src/assets/images/cadet_campus_grounds_1794029062449.jpg',
      role: 'alumnus',
      profession: profession || 'Cadet Alumnus',
      location: 'Dhaka, Bangladesh',
      bio: `${selectedCollege} Intake ${intake} · Cadet #${cadetNumber} · ${house}. Newly registered on CadetVerse.`,
      joinedDate: 'Joined Today',
      isVerifiedAlumnus: true,
      stats: {
        posts: 0,
        connections: 1,
        batchmatesCount: 50
      },
      badges: ['Verified Cadet Roll', 'Intake Member']
    };

    onRegisterUser(newUser);
    setRegisteredToast(true);
    setTimeout(() => {
      setRegisteredToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#0e1424] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <CrestLogo size="sm" />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab mode selector */}
        <div className="flex border-b border-slate-800 text-xs font-semibold bg-slate-950/40">
          <button
            onClick={() => setAuthMode('switcher')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              authMode === 'switcher'
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-950/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Instant Persona Switcher
          </button>
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              authMode === 'login'
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-950/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              authMode === 'register'
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-950/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cadet Registration
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Mode 1: Instant Persona Switcher */}
          {authMode === 'switcher' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300">
                <span className="font-semibold block mb-0.5">Test Multi-User Perspectives</span>
                CadetVerse connects multiple generations and colleges. Click any persona below to preview the platform from their perspective:
              </div>

              <div className="space-y-2.5">
                {DEMO_USERS.map((demo) => {
                  const isCurrent = demo.cadetNumber === currentUser.cadetNumber;
                  return (
                    <div
                      key={demo.id}
                      onClick={() => {
                        onSelectUser(demo);
                        onClose();
                      }}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isCurrent
                          ? 'border-indigo-500/60 bg-indigo-950/30'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={demo.avatar}
                          alt={demo.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-indigo-500/30"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">
                              {demo.name}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-mono">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <span className="text-indigo-300">{demo.collegeCode} #{demo.cadetNumber}</span>
                            <span aria-hidden="true">·</span>
                            <span>{demo.intake}th Intake</span>
                            <span aria-hidden="true">·</span>
                            <span>{demo.house}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs">
                            {demo.profession}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode 2: Sign In Mockup */}
          {authMode === 'login' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Welcome back, Cadet</h3>
                <p className="text-xs text-slate-400">
                  Authenticate with your registered Cadet Number and College.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Cadet College</label>
                  <select className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                    {CADET_COLLEGES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Cadet Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 1428"
                    defaultValue="1428"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Password or Passkey</label>
                  <input
                    type="password"
                    defaultValue="cadetbrotherhood2026"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectUser(DEMO_USERS[0]);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-900/40 transition-colors cursor-pointer mt-2"
                >
                  Sign In to CadetVerse
                </button>
              </div>
            </div>
          )}

          {/* Mode 3: Cadet Registration */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              {registeredToast && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Cadet profile created and signed in!</span>
                </div>
              )}

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Register as Cadet / Alumnus</h3>
                <p className="text-xs text-slate-400">
                  Join the exclusive network for Bangladesh cadet colleges.
                </p>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asif Mahmud"
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Cadet College</label>
                  <select
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value as CadetCollegeCode)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
                  >
                    {CADET_COLLEGES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.name.split(' ')[0]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Cadet Number</label>
                  <input
                    type="text"
                    required
                    value={cadetNumber}
                    onChange={(e) => setCadetNumber(e.target.value)}
                    placeholder="e.g. 1580"
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Intake (Batch)</label>
                  <input
                    type="number"
                    value={intake}
                    onChange={(e) => setIntake(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">House</label>
                  <select
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
                  >
                    {currentCollegeObj.houses.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Profession / Current Title</label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. Doctor, Entrepreneur, Military Officer, Student"
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-900/40 transition-colors cursor-pointer mt-2"
              >
                Register & Enter CadetVerse
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
