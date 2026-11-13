import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  CheckCheck,
  ShieldCheck
} from 'lucide-react';
import { ChatConversation, CadetUser, DirectMessage } from '../types';

interface MessagesViewProps {
  conversations: ChatConversation[];
  currentUser: CadetUser | null;
  onSendMessage: (conversationId: string, text: string) => void;
  onPromptAuth?: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations,
  currentUser,
  onSendMessage,
  onPromptAuth,
}) => {
  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onPromptAuth?.();
      return;
    }
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
    <div className="h-[calc(100vh-140px)] min-h-[550px] rounded-2xl bg-white dark:bg-[#1a201b] border border-[#e2dacb] dark:border-[#2c362d] shadow-sm overflow-hidden flex flex-col md:flex-row">
      {/* Left List of Conversations */}
      <div className="w-full md:w-80 shrink-0 border-r border-[#e2dacb] dark:border-[#2c362d] flex flex-col bg-[#faf6ef] dark:bg-[#151a15]">
        {/* Header & Search */}
        <div className="p-4 border-b border-[#e2dacb] dark:border-[#2c362d] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1c1917] dark:text-[#f5f5f4] tracking-tight">
              Direct Messages
            </h2>
            <span className="text-xs text-[#1b4332] dark:text-[#4ade80] font-mono font-semibold">
              Cadet Comms
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#78716c] dark:text-[#a8a29e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by cadet name or #..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#1e251f] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d]"
            />
          </div>
        </div>

        {/* Conversations Scrollable List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#e2dacb]/60 dark:divide-[#2c362d]/60">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConv?.id;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#1b4332]/10 border-l-2 border-[#1b4332] dark:bg-[#15803d]/15 dark:border-[#15803d]'
                    : 'hover:bg-[#ede5d8]/50 dark:hover:bg-[#202721]'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.participant.avatar}
                    alt={conv.participant.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-[#1b4332]/30 dark:ring-[#15803d]/30"
                  />
                  {conv.isOnline && (
                    <span 
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#faf6ef] dark:ring-[#151a15]" 
                      title="Online"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-[#1c1917] dark:text-[#f5f5f4] truncate">
                      {conv.participant.name}
                    </span>
                    <span className="text-[10px] text-[#78716c] dark:text-[#a8a29e] font-mono">
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#1b4332] dark:text-[#4ade80] font-mono mb-0.5">
                    {conv.participant.collegeCode} #{conv.participant.cadetNumber} · {conv.participant.intake}th
                  </p>

                  <p className="text-xs text-[#57534e] dark:text-[#a8a29e] truncate">
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
        <div className="flex-1 flex flex-col bg-white dark:bg-[#1a201b]">
          {/* Active Chat Header */}
          <div className="p-3.5 px-5 bg-[#faf6ef] dark:bg-[#151a15] border-b border-[#e2dacb] dark:border-[#2c362d] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={activeConv.participant.avatar}
                  alt={activeConv.participant.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-[#1b4332]/40 dark:ring-[#15803d]/40"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1c1917] dark:text-[#f5f5f4]">
                    {activeConv.participant.name}
                  </span>
                  {activeConv.participant.isVerifiedAlumnus && (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c59b27] dark:text-[#eab308]" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#78716c] dark:text-[#a8a29e]">
                  <span className="text-[#1b4332] dark:text-[#4ade80] font-semibold">
                    {activeConv.participant.collegeCode} #{activeConv.participant.cadetNumber}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeConv.participant.house}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeConv.isOnline ? 'Online' : 'Active earlier'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#78716c] dark:text-[#a8a29e]">
              <button 
                title="Voice Call" 
                className="p-2 rounded-lg hover:bg-[#ede5d8] dark:hover:bg-[#202721] hover:text-[#1c1917] dark:hover:text-[#f5f5f4] transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button 
                title="Video Conference" 
                className="p-2 rounded-lg hover:bg-[#ede5d8] dark:hover:bg-[#202721] hover:text-[#1c1917] dark:hover:text-[#f5f5f4] transition-colors cursor-pointer"
              >
                <Video className="w-4 h-4" />
              </button>
              <button 
                title="More" 
                className="p-2 rounded-lg hover:bg-[#ede5d8] dark:hover:bg-[#202721] hover:text-[#1c1917] dark:hover:text-[#f5f5f4] transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-[#faf6ef]/30 dark:bg-[#121612]/40">
            {activeConv.messages.map((m: DirectMessage) => {
              const isFromMe = m.isFromMe;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-md ${
                    isFromMe ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isFromMe
                        ? 'bg-[#1b4332] dark:bg-[#15803d] text-white rounded-br-none'
                        : 'bg-white dark:bg-[#1e251f] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] rounded-bl-none'
                    }`}
                  >
                    <p>{m.text}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#78716c] dark:text-[#a8a29e] mt-1 px-1">
                    <span>{m.timestamp}</span>
                    {isFromMe && <CheckCheck className="w-3 h-3 text-[#1b4332] dark:text-[#4ade80]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-[#faf6ef] dark:bg-[#151a15] border-t border-[#e2dacb] dark:border-[#2c362d] flex items-center gap-2"
          >
            <button
              type="button"
              className="p-2 rounded-xl text-[#78716c] hover:text-[#1c1917] dark:text-[#a8a29e] dark:hover:text-[#f5f5f4] hover:bg-[#ede5d8] dark:hover:bg-[#202721] transition-colors cursor-pointer"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeConv.participant.name.split(' ')[0]}...`}
              className="flex-1 py-2 px-3 text-xs rounded-xl bg-white dark:bg-[#1e251f] border border-[#e2dacb] dark:border-[#2c362d] text-[#1c1917] dark:text-[#f5f5f4] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1b4332] dark:focus:border-[#15803d]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#143527] dark:bg-[#15803d] dark:hover:bg-[#16a34a] text-white text-xs font-medium disabled:opacity-40 shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-[#78716c] dark:text-[#a8a29e] text-sm">
          Select a cadet conversation to begin chatting.
        </div>
      )}
    </div>
  );
};
