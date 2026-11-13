import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Building2, 
  Briefcase, 
  Send 
} from 'lucide-react';
import { Community, CadetUser } from '../types';
import { CADET_COLLEGES } from '../data/mockData';

interface CommunitiesViewProps {
  communities: Community[];
  currentUser: CadetUser | null;
  onJoinCommunity: (id: string) => void;
  onPromptAuth?: () => void;
}

interface GlobalChatMessage {
  id: string;
  sender: string;
  collegeCode: string;
  intake: number;
  cadetNumber: string;
  avatar: string;
  text: string;
  time: string;
}

export const CommunitiesView: React.FC<CommunitiesViewProps> = ({
  communities,
  currentUser,
  onJoinCommunity,
  onPromptAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'lounge' | 'colleges' | 'guilds'>('lounge');
  
  // Realtime Global Chat state
  const [chatMessages, setChatMessages] = useState<GlobalChatMessage[]>([
    {
      id: 'gm_1',
      sender: 'Dr. Nafis Iqbal',
      collegeCode: 'FCC',
      intake: 39,
      cadetNumber: '984',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      text: 'Good evening cadets! Any ex-cadets heading to the CCCL Purbachal lounge this Friday?',
      time: '18:24'
    },
    {
      id: 'gm_2',
      sender: 'Samira Mehnaz',
      collegeCode: 'MGCC',
      intake: 14,
      cadetNumber: '412',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      text: 'Yes! The Girls Cadet leadership circle is hosting a 15-minute briefing at 6 PM on higher studies.',
      time: '18:29'
    },
    {
      id: 'gm_3',
      sender: 'Kazi Farhan Ahmed',
      collegeCode: 'RCC',
      intake: 52,
      cadetNumber: '2105',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      text: 'Greetings seniors from Rajshahi Cadet College! Athletics week final results just posted.',
      time: '18:35'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendGlobalMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      if (onPromptAuth) onPromptAuth();
      return;
    }
    if (!inputMsg.trim()) return;

    const newMsg: GlobalChatMessage = {
      id: `gm_${Date.now()}`,
      sender: currentUser.name,
      collegeCode: currentUser.collegeCode,
      intake: currentUser.intake,
      cadetNumber: currentUser.cadetNumber,
      avatar: currentUser.avatar,
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  };

  const guildCommunities = communities.filter((c) => c.type === 'wing' || c.type === 'intake');

  return (
    <div className="space-y-6">
      {/* Header and Sub-Navigation */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-white via-[#faf6ef] to-white dark:from-[#1a201b] dark:via-[#161c17] dark:to-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1c1917] dark:text-[#f5f5f4] tracking-tight">
              Cadet Communities & Forums
            </h1>
            <p className="text-xs sm:text-sm text-[#78716c] dark:text-[#a8a29e] mt-1">
              Connect across all 12 colleges, private intake fraternities, and specialized career guilds.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center p-1 bg-[#ede5d8]/70 dark:bg-[#141814] rounded-xl border border-[#e2dacb] dark:border-[#2c362d] self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('lounge')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'lounge'
                  ? 'bg-[#1b4332] dark:bg-[#15803d] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Global Lounge</span>
            </button>
            <button
              onClick={() => setActiveTab('colleges')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'colleges'
                  ? 'bg-[#1b4332] dark:bg-[#15803d] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>12 Colleges</span>
            </button>
            <button
              onClick={() => setActiveTab('guilds')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'guilds'
                  ? 'bg-[#1b4332] dark:bg-[#15803d] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Guilds & Intakes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Global Lounge (Realtime interactive chat) */}
      {activeTab === 'lounge' && (
        <div className="rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] shadow-sm overflow-hidden flex flex-col h-[600px]">
          {/* Lounge Header */}
          <div className="px-5 py-3.5 bg-[#faf6ef] dark:bg-[#151a15] border-b border-[#e2dacb] dark:border-[#2c362d] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1b4332]/10 dark:bg-[#15803d]/20 border border-[#1b4332]/30 dark:border-[#15803d]/30 flex items-center justify-center text-[#1b4332] dark:text-[#4ade80]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1c1917] dark:text-[#f5f5f4] flex items-center gap-2">
                  Global Cadet Lounge & Commons
                  <span className="text-[10px] font-mono text-[#1b4332] dark:text-[#4ade80] bg-[#1b4332]/10 dark:bg-[#15803d]/20 px-2 py-0.5 rounded border border-[#1b4332]/25 dark:border-[#15803d]/30">
                    Live Channel
                  </span>
                </h3>
                <p className="text-xs text-[#78716c] dark:text-[#a8a29e]">
                  Open frequency for all 12 cadet colleges and verified alumni.
                </p>
              </div>
            </div>

            <div className="text-xs text-[#78716c] dark:text-[#a8a29e] hidden sm:block">
              {currentUser ? (
                <span>Posting as: <span className="text-[#1b4332] dark:text-[#4ade80] font-semibold">{currentUser.name} ({currentUser.collegeCode} #{currentUser.cadetNumber})</span></span>
              ) : (
                <button
                  type="button"
                  onClick={onPromptAuth}
                  className="text-[#1b4332] dark:text-[#4ade80] font-semibold hover:underline cursor-pointer"
                >
                  Sign in to post
                </button>
              )}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-[#faf6ef]/30 dark:bg-[#121612]/30">
            {chatMessages.map((msg) => {
              const isMe = Boolean(currentUser && msg.cadetNumber === currentUser.cadetNumber);
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 max-w-xl ${
                    isMe ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <img
                    src={msg.avatar}
                    alt={msg.sender}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-[#1b4332]/30 dark:ring-[#15803d]/30 shrink-0 mt-0.5"
                  />
                  <div
                    className={`p-3 rounded-2xl text-xs space-y-1 shadow-xs ${
                      isMe
                        ? 'bg-[#1b4332] dark:bg-[#15803d] text-white rounded-tr-none'
                        : 'bg-white dark:bg-[#1e251f] text-[#1c1917] dark:text-[#f5f5f4] border border-[#e2dacb] dark:border-[#2c362d] rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[11px] opacity-80">
                      <span className="font-semibold">
                        {msg.sender} ({msg.collegeCode} #{msg.cadetNumber})
                      </span>
                      <span className="font-mono text-[10px]">{msg.time}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSendGlobalMessage}
            className="p-3.5 bg-[#faf6ef] dark:bg-[#151a15] border-t border-[#e2dacb] dark:border-[#2c362d] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Broadcast a message to all cadet colleges..."
              className="flex-1 py-2 px-3.5 text-xs rounded-xl bg-white dark:bg-[#1e251f] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d]"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white text-xs font-medium disabled:opacity-40 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: All 12 Cadet Colleges */}
      {activeTab === 'colleges' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CADET_COLLEGES.map((college) => {
              const matchingComm = communities.find((c) => c.code === college.code);
              const isJoined = matchingComm ? matchingComm.isJoined : false;

              return (
                <div
                  key={college.code}
                  className="p-5 rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] hover:border-[#1b4332]/40 dark:hover:border-[#15803d]/40 transition-all flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1b4332] dark:text-[#4ade80] font-mono">
                            {college.code}
                          </span>
                          <span className="text-[11px] text-[#78716c] dark:text-[#a8a29e]">
                            Est. {college.established} · {college.location}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#1c1917] dark:text-[#f5f5f4] mt-0.5">
                          {college.name}
                        </h3>
                      </div>

                      <button
                        onClick={() => matchingComm && onJoinCommunity(matchingComm.id)}
                        className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                          isJoined
                            ? 'bg-[#ede5d8] text-[#57534e] dark:bg-[#202721] dark:text-[#a8a29e] border border-[#e2dacb] dark:border-[#2c362d]'
                            : 'bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white shadow-xs'
                        }`}
                      >
                        {isJoined ? 'Joined' : 'Join'}
                      </button>
                    </div>

                    <p className="text-xs text-[#5c3d2e] dark:text-[#fbbf24] italic font-serif">
                      "{college.motto}"
                    </p>

                    <p className="text-xs text-[#78716c] dark:text-[#a8a29e]">
                      Alumni: <span className="text-[#1c1917] dark:text-[#f5f5f4] font-medium">{college.alumniAssoc}</span>
                    </p>

                    {/* Houses List */}
                    <div className="pt-1">
                      <span className="text-[11px] text-[#78716c] dark:text-[#a8a29e] block mb-1">
                        College Houses:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {college.houses.map((house) => (
                          <span
                            key={house}
                            className="text-[11px] px-2 py-0.5 rounded bg-[#faf6ef] dark:bg-[#141814] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#d6d3d1]"
                          >
                            {house}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e2dacb] dark:border-[#2c362d] flex items-center justify-between text-[11px] text-[#78716c] dark:text-[#a8a29e]">
                    <span>{matchingComm ? `${matchingComm.memberCount.toLocaleString()} Verified Members` : 'Active Hub'}</span>
                    <span className="text-[#1b4332] dark:text-[#4ade80] hover:underline cursor-pointer">
                      View Intakes & Archives →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Guilds & Intakes */}
      {activeTab === 'guilds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guildCommunities.map((comm) => (
            <div
              key={comm.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] hover:border-[#1b4332]/40 dark:hover:border-[#15803d]/40 transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-[#1b4332] dark:text-[#4ade80] uppercase tracking-wider">
                      {comm.category}
                    </span>
                    <h3 className="text-base font-bold text-[#1c1917] dark:text-[#f5f5f4] mt-0.5">
                      {comm.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => onJoinCommunity(comm.id)}
                    className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                      comm.isJoined
                        ? 'bg-[#ede5d8] text-[#57534e] dark:bg-[#202721] dark:text-[#a8a29e] border border-[#e2dacb] dark:border-[#2c362d]'
                        : 'bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white shadow-xs'
                    }`}
                  >
                    {comm.isJoined ? 'Joined' : 'Join Guild'}
                  </button>
                </div>

                <p className="text-xs text-[#57534e] dark:text-[#d6d3d1] leading-relaxed">
                  {comm.description}
                </p>

                <div className="p-2.5 rounded-xl bg-[#faf6ef] dark:bg-[#141814] border border-[#e2dacb] dark:border-[#2c362d] text-xs">
                  <span className="text-[#78716c] dark:text-[#a8a29e] text-[11px] block">Recent Discussion:</span>
                  <span className="text-[#1c1917] dark:text-[#f5f5f4] font-medium">"{comm.recentTopic}"</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e2dacb] dark:border-[#2c362d] flex items-center justify-between text-xs text-[#78716c] dark:text-[#a8a29e]">
                <span>{comm.memberCount.toLocaleString()} Cadets Enrolled</span>
                <span className="text-[#1b4332] dark:text-[#4ade80] hover:underline cursor-pointer">
                  Enter Channel →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
