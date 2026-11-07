import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  CheckCheck, 
  User, 
  ShieldCheck 
} from 'lucide-react';
import { ChatConversation, CadetUser, DirectMessage } from '../types';
import { formatHouseLabel } from '../data/collegeReference';

interface MessagesViewProps {
  conversations: ChatConversation[];
  currentUser: CadetUser;
  onSendMessage: (conversationId: string, text: string) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations,
  currentUser,
  onSendMessage,
}) => {
  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    onSendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const filteredConversations = conversations.filter((c) =>
    c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participant.collegeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participant.cadetNumber.includes(searchQuery)
  );

  return (
    <div className="h-[calc(100vh-140px)] min-h-[550px] rounded-2xl bg-[#0e1424] border border-slate-800 shadow-xl overflow-hidden flex flex-col md:flex-row">
      {/* Left List of Conversations */}
      <div className="w-full md:w-80 shrink-0 border-r border-slate-800 flex flex-col bg-[#0b0f1a]">
        {/* Header & Search */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">
              Direct Messages
            </h2>
            <span className="text-xs text-indigo-400 font-mono">
              Cadet Comms
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by cadet name or #..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Conversations Scrollable List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConv?.id;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-indigo-950/30 border-l-2 border-indigo-500'
                    : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.participant.avatar}
                    alt={conv.participant.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  {conv.isOnline && (
                    <span 
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0b0f1a]" 
                      title="Online"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-slate-200 truncate">
                      {conv.participant.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  <p className="text-[11px] text-indigo-400 font-mono mb-0.5">
                    {conv.participant.collegeCode} #{conv.participant.cadetNumber} · {conv.participant.intake}th
                  </p>

                  <p className="text-xs text-slate-400 truncate">
                    {conv.lastMessage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat Area */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-[#0e1424]">
          {/* Active Chat Header */}
          <div className="p-3.5 px-5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeConv.participant.avatar}
                  alt={activeConv.participant.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-indigo-500/40"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {activeConv.participant.name}
                  </span>
                  {activeConv.participant.isVerifiedAlumnus && (
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-indigo-300 font-medium">
                    {activeConv.participant.collegeCode} #{activeConv.participant.cadetNumber}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{formatHouseLabel(activeConv.participant.houseId)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeConv.isOnline ? 'Online' : 'Active earlier'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <button 
                title="Voice Call" 
                className="p-2 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button 
                title="Video Conference" 
                className="p-2 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <Video className="w-4 h-4" />
              </button>
              <button 
                title="More" 
                className="p-2 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-950/30">
            {activeConv.messages.map((m) => {
              const isFromMe = m.isFromMe;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-md ${
                    isFromMe ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isFromMe
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p>{m.text}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 px-1">
                    <span>{m.timestamp}</span>
                    {isFromMe && <CheckCheck className="w-3 h-3 text-indigo-400" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <button
              type="button"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeConv.participant.name.split(' ')[0]}...`}
              className="flex-1 py-2 px-3 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          Select a cadet conversation to begin chatting.
        </div>
      )}
    </div>
  );
};
