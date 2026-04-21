import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, Send, Paperclip, User, MessageCircle } from 'lucide-react';

export default function Messages() {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messageText, setMessageText] = useState('');
  
  const isEmployer = currentUser?.role === 'employer';

  useEffect(() => {
    // Load chats where current user is involved
    const allChats = JSON.parse(localStorage.getItem('chats') || '[]');
    const myChats = allChats.filter(c => 
      isEmployer ? c.employerId === currentUser?.id : c.jobseekerId === currentUser?.id
    );
    // Sort by last updated
    myChats.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    setChats(myChats);
    if (myChats.length > 0) setActiveChatId(myChats[0].id);
  }, [currentUser, isEmployer]);

  const activeChat = chats.find(c => c.id === activeChatId);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
    };

    const updatedChats = chats.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          messages: [...(c.messages || []), newMsg],
          lastUpdated: new Date().toISOString()
        };
      }
      return c;
    });

    setChats(updatedChats);
    localStorage.setItem('chats', JSON.stringify(updatedChats));
    setMessageText('');
  };

  return (
    <div className="w-full h-[calc(100vh-140px)] min-h-[600px] flex bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Sidebar - Contacts */}
      <div className="w-[340px] flex flex-col border-r border-gray-100 bg-white">
        <div className="p-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-black text-gray-900 mb-6">Мои сообщения</h2>
          
          <div className="relative mb-5">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -transform-y-1/2" />
            <input 
              type="text" 
              placeholder="Поиск" 
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent focus:border-blue-200 focus:bg-white rounded-xl text-sm outline-none transition-all placeholder-gray-400 font-medium"
            />
          </div>
          
          <div className="flex border-b border-gray-100">
            <button className="pb-3 px-2 text-sm font-bold text-gray-900 border-b-2 border-blue-600">Все</button>
            <button className="pb-3 px-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">Непрочитанные</button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto w-full pt-2">
          {chats.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400 font-medium">У вас пока нет сообщений</div>
          ) : (
            chats.map(chat => {
              const lastMsg = chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
              const contactName = isEmployer ? chat.jobseekerName : chat.employerName;
              // Format last updated date string
              const d = new Date(chat.lastUpdated);
              const dateStr = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
              
              const isSelected = activeChatId === chat.id;
              
              return (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full flex items-start gap-4 p-5 cursor-pointer border-l-4 transition-all ${
                    isSelected ? 'bg-blue-50/50 border-blue-600' : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                       {(!isEmployer && chat.employerId) || (isEmployer && !chat.jobseekerPhoto) ? (
                          <User className="w-6 h-6 text-gray-400" />
                       ) : (
                          <span className="text-gray-600 font-bold text-xs">{contactName.substring(0, 2).toUpperCase()}</span>
                       )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900 text-[15px] truncate pr-2">{contactName}</h4>
                      <span className="text-[11px] text-gray-400 whitespace-nowrap font-medium mt-0.5">{dateStr}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                      {lastMsg ? lastMsg.text : 'Нет сообщений'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-[#f8faff] min-w-0">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center">
            <div>
              <h3 className="font-black text-gray-900 text-lg">
                {isEmployer ? activeChat.jobseekerName : activeChat.employerName}
              </h3>
              <p className="text-sm font-medium text-gray-500">{activeChat.position}</p>
            </div>
            {/* Action buttons (three dots) */}
            <button className="text-gray-400 hover:text-gray-800 p-2 rounded-full transition-colors">
              <MoreHorizontalIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
             {activeChat.messages && activeChat.messages.length > 0 ? (
               activeChat.messages.map((msg, i) => {
                 const prevMsg = activeChat.messages[i - 1];
                 const isNewDay = !prevMsg || prevMsg.date !== msg.date;
                 const isMine = msg.senderId === currentUser?.id;
                 
                 return (
                   <div key={msg.id}>
                     {isNewDay && (
                       <div className="flex justify-center mb-8 mt-2">
                         <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">{msg.date}</span>
                       </div>
                     )}
                     <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} w-full`}>
                        <div className={`flex max-w-[70%] gap-4 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                          {!isMine && (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center mt-auto">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className={`rounded-2xl p-5 shadow-sm text-[15px] font-medium leading-relaxed mb-1 whitespace-pre-wrap ${
                              isMine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'
                            }`}>
                              {msg.text}
                            </div>
                            <div className={`text-[11px] text-gray-400 font-bold ${isMine ? 'text-right' : 'text-left'}`}>
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                     </div>
                   </div>
                 );
               })
             ) : (
               <div className="flex h-full items-center justify-center text-gray-400 font-medium">Ваша история сообщений пуста</div>
             )}
          </div>

          {/* Reply Box */}
          <div className="p-5 bg-white border-t border-gray-100 flex gap-4 items-end">
            <button className="p-3 text-gray-400 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors mb-1 shadow-sm border border-transparent">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl relative shadow-sm focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50 transition-all overflow-hidden">
               <textarea 
                 value={messageText}
                 onChange={(e) => setMessageText(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     sendMessage(e);
                   }
                 }}
                 placeholder="Написать сообщение..."
                 className="w-full resize-none py-4 px-5 text-sm font-medium outline-none text-gray-700 bg-transparent"
                 rows="2"
               ></textarea>
            </div>
            <button 
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 h-[52px] rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all mb-1.5 flex items-center gap-2"
            >
              Отправить
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-[#f8faff] flex items-center justify-center p-12">
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center max-w-sm">
             <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-500" />
             </div>
             <h3 className="font-black text-gray-900 text-xl mb-2">Выберите чат</h3>
             <p className="text-gray-500 text-sm font-medium leading-relaxed">Выберите беседу из списка слева, чтобы начать переписку с кандидатом или работодателем.</p>
           </div>
        </div>
      )}
    </div>
  );
}

const MoreHorizontalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);
