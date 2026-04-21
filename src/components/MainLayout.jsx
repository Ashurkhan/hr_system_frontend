import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, Bell, ChevronDown, Plus, Menu, X, HelpCircle, Phone, User, Settings, LogOut, Briefcase } from 'lucide-react';

export default function MainLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [msgCount, setMsgCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  React.useEffect(() => {
    if (!currentUser) return;
    
    const updateCounts = () => {
      // Notifs count
      const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
      const myNotifs = allNotifs.filter(n => n.userId === currentUser.id);
      const unread = myNotifs.filter(n => !n.isRead);
      setNotifCount(unread.length);
      setNotifications(myNotifs.reverse());

      // Messages count: for simplicity we just count all chats the user has.
      // If we want unread, we'd need another flag. For now, if there are chats, count them.
      const allChats = JSON.parse(localStorage.getItem('chats') || '[]');
      const myChats = allChats.filter(c => c.employerId === currentUser.id);
      setMsgCount(myChats.length);
    };

    updateCounts(); // initial
    const interval = setInterval(updateCounts, 2000);
    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-[#f0f4fa] flex flex-col font-sans text-gray-800">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center space-x-12">
            <Link to="/vacancies" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-blue-600 transform rotate-45 flex items-center justify-center relative">
                 <div className="w-4 h-4 bg-white absolute" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
              </div>
              <span className="text-2xl font-black text-[#1e293b] tracking-tight ml-2">Border</span>
            </Link>

            <nav className="flex space-x-6">
              <Link to="/faq" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">FAQ</Link>
              <Link to="/contacts" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Контакты</Link>
            </nav>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <Link to="/messages" className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors group">
                <MessageCircle className="w-6 h-6 group-hover:text-blue-600 transition-colors" />
                {msgCount > 0 && <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">{msgCount}</span>}
              </Link>
              <div className="relative">
                <button 
                  className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors group"
                  onClick={() => {
                     setNotifOpen(!notifOpen);
                     // Mark notifications as read
                     const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
                     const updated = allNotifs.map(n => n.userId === currentUser?.id ? { ...n, isRead: true } : n);
                     localStorage.setItem('notifications', JSON.stringify(updated));
                     setNotifCount(0);
                  }}
                >
                  <Bell className="w-6 h-6 group-hover:text-blue-600 transition-colors" />
                  {notifCount > 0 && <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">{notifCount}</span>}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50">
                    <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                      <h4 className="text-sm font-black text-gray-900">Уведомления</h4>
                      <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-800 text-xs font-bold">✕</button>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-center text-sm text-gray-400 py-8 font-medium">Нет уведомлений</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 border-b border-gray-50 last:border-0 ${n.isRead ? 'opacity-60' : ''}`}>
                          <p className="text-sm text-gray-700 font-medium leading-snug">{n.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="relative group cursor-pointer">
               <div className="flex items-center space-x-3 bg-gray-50/80 hover:bg-gray-100 py-1.5 px-3 rounded-full transition-colors border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                    {currentUser?.photo ? (
                      <img src={currentUser.photo} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-gray-600">
                        {currentUser?.name?.substring(0,2).toUpperCase() || 'US'}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{currentUser?.name || 'Пользователь'}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
               </div>

               <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Настройки профиля</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Настройки</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Выйти</button>
               </div>
            </div>

            <Link to="/vacancies/create" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md shadow-blue-500/20">
              <Plus className="w-4 h-4" />
              <span>Создать вакансию</span>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Mobile header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 md:hidden">
        <div className="px-4 h-16 flex items-center justify-between">
          <Link to="/vacancies" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-blue-600 transform rotate-45 flex items-center justify-center relative">
               <div className="w-4 h-4 bg-white absolute" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            </div>
            <span className="text-xl font-black text-[#1e293b] tracking-tight ml-2">Border</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Link to="/vacancies/create" className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20"><Plus className="w-5 h-5"/></Link>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <aside className="absolute right-0 top-0 bottom-0 w-80 bg-white flex flex-col py-8 px-6 space-y-2 animate-in slide-in-from-right duration-300">
               <div className="flex items-center justify-between mb-8 px-2">
                  <Link to="/vacancies" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                      <div className="w-8 h-8 rounded bg-blue-600 transform rotate-45 flex items-center justify-center relative">
                        <div className="w-4 h-4 bg-white absolute" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                      </div>
                      <span className="text-xl font-black text-[#1e293b] tracking-tight ml-2">Border</span>
                  </Link>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-900"><X /></button>
               </div>
               
               <div className="space-y-1">
                  <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Управление</p>
                  <Link to="/vacancies" className="flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all" onClick={() => setMobileMenuOpen(false)}>
                     <Briefcase className="w-5 h-5 text-gray-400" />
                     <span>Мои вакансии</span>
                  </Link>
                  <Link to="/vacancies/create" className="flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all" onClick={() => setMobileMenuOpen(false)}>
                     <Plus className="w-5 h-5 text-gray-400" />
                     <span>Создать вакансию</span>
                  </Link>
                  <Link to="/faq" className="flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all" onClick={() => setMobileMenuOpen(false)}>
                     <HelpCircle className="w-5 h-5 text-gray-400" />
                     <span>FAQ</span>
                  </Link>
                  <Link to="/contacts" className="flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all" onClick={() => setMobileMenuOpen(false)}>
                     <Phone className="w-5 h-5 text-gray-400" />
                     <span>Контакты</span>
                  </Link>
               </div>

               <div className="pt-6 mt-6 border-t border-gray-100">
                  <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Аккаунт</p>
                  <div className="space-y-1">
                     <Link to="/profile" className="flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all" onClick={() => setMobileMenuOpen(false)}>
                        <User className="w-5 h-5 text-gray-400" />
                        <span>Настройки профиля</span>
                     </Link>
                     <Link to="/messages" className="flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all" onClick={() => setMobileMenuOpen(false)}>
                        <MessageCircle className="w-5 h-5 text-gray-400" />
                        <span>Сообщения</span>
                     </Link>
                     <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all">
                        <LogOut className="w-5 h-5" />
                        <span>Выйти</span>
                     </button>
                  </div>
               </div>
            </aside>
        </div>
      )}

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
