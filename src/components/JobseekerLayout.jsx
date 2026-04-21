import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, Bell, ChevronDown, Menu, X, HelpCircle, Phone, User, Settings, LogOut, Briefcase } from 'lucide-react';

export default function JobseekerLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
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
      setNotifications([...myNotifs].reverse());

      // Messages count
      const allChats = JSON.parse(localStorage.getItem('chats') || '[]');
      const myChats = allChats.filter(c => c.jobseekerId === currentUser.id);
      setMsgCount(myChats.length);
    };

    updateCounts();
    const interval = setInterval(updateCounts, 2000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const firstName = currentUser?.firstName || currentUser?.name?.split(' ')[0] || 'Пользователь';
  const lastName = currentUser?.lastName || '';
  const shortName = currentUser ? `${firstName} ${lastName ? lastName[0] + '.' : ''}`.trim() : 'Гость';

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo + Nav */}
          <div className="flex items-center space-x-10">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-blue-600 transform rotate-45 flex items-center justify-center relative">
                <div className="w-4 h-4 bg-white absolute" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
              </div>
              <span className="text-xl font-black text-[#1e293b] tracking-tight ml-2">Border</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/faq" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">FAQ</Link>
              <Link to="/contacts" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Контакты</Link>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {/* Notifications & Messages for logged in users */}
                <Link to="/jobseeker/messages" className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors group">
                  <MessageCircle className="w-6 h-6 group-hover:text-blue-600 transition-colors" />
                  {msgCount > 0 && <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white ring-2 ring-white">{msgCount}</span>}
                </Link>

                <div className="relative">
                  <button 
                    className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors group"
                    onClick={() => {
                        setNotifOpen(!notifOpen);
                        const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
                        const updated = allNotifs.map(n => n.userId === currentUser.id ? { ...n, isRead: true } : n);
                        localStorage.setItem('notifications', JSON.stringify(updated));
                        setNotifCount(0);
                    }}
                  >
                    <Bell className="w-6 h-6 group-hover:text-blue-600 transition-colors" />
                    {notifCount > 0 && <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white ring-2 ring-white">{notifCount}</span>}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                        <h4 className="text-sm font-black text-gray-900">Уведомления</h4>
                        <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-800 text-xs font-bold">✕</button>
                      </div>
                      {notifications.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 py-8 font-medium">Нет уведомлений</p>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`px-4 py-3 border-b border-gray-50 last:border-0 ${n.isRead ? 'opacity-60' : 'bg-blue-50/20'}`}>
                            <p className="text-sm text-gray-700 font-medium leading-snug">{n.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 py-1.5 pl-1.5 pr-3 rounded-full transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 flex items-center justify-center">
                      {currentUser?.photo ? (
                        <img src={currentUser.photo} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-blue-600">
                          {((currentUser?.firstName || currentUser?.name || 'U')[0] || '').toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{shortName}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                    {menuOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Личный кабинет</p>
                        </div>
                        <Link to="/jobseeker/profile" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-bold transition-colors" onClick={() => setMenuOpen(false)}>
                          <User className="w-4 h-4 text-gray-400" />
                          <span>Мой профиль</span>
                        </Link>
                        <Link to="/jobseeker/resume" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-bold transition-colors" onClick={() => setMenuOpen(false)}>
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span>Моё резюме</span>
                        </Link>
                        <Link to="/jobseeker/settings" className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-bold transition-colors" onClick={() => setMenuOpen(false)}>
                          <Settings className="w-4 h-4 text-gray-400" />
                          <span>Настройки</span>
                        </Link>
                        <div className="border-t border-gray-50 my-1" />
                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center space-x-3 transition-colors">
                          <LogOut className="w-4 h-4" />
                          <span>Выйти</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center space-x-3">
                  <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-blue-600 px-3 py-2 transition-colors">Войти</Link>
                  <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-black transition-all shadow-lg shadow-blue-500/20">Регистрация</Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Find Job Button Desktop */}
              <Link
                to="/jobseeker"
                className="hidden lg:flex items-center bg-gray-50 hover:bg-gray-100 text-gray-700 px-5 py-2 border border-gray-200 rounded-full text-sm font-semibold transition-all"
              >
                Найти работу
              </Link>
            </div>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
              <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
              <aside className="absolute right-0 top-0 bottom-0 w-80 bg-white flex flex-col py-8 px-6 space-y-2 animate-in slide-in-from-right duration-300">
                 <div className="flex items-center justify-between mb-8 px-2">
                    <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                        <div className="w-8 h-8 rounded bg-blue-600 transform rotate-45 flex items-center justify-center relative">
                          <div className="w-4 h-4 bg-white absolute" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                        </div>
                        <span className="text-xl font-black text-[#1e293b] tracking-tight ml-2">Border</span>
                    </Link>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-900"><X /></button>
                 </div>
                 
                 <div className="space-y-1">
                    <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Навигация</p>
                    <Link to="/jobseeker" className="flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all" onClick={() => setMobileMenuOpen(false)}>
                       <Briefcase className="w-5 h-5 text-gray-400" />
                       <span>Найти работу</span>
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
                    <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Личный кабинет</p>
                    {currentUser ? (
                       <div className="space-y-1">
                          <Link to="/jobseeker/profile" className="flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all" onClick={() => setMobileMenuOpen(false)}>
                             <User className="w-5 h-5 text-gray-400" />
                             <span>Профиль</span>
                          </Link>
                          <Link to="/jobseeker/messages" className="flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all" onClick={() => setMobileMenuOpen(false)}>
                             <MessageCircle className="w-5 h-5 text-gray-400" />
                             <span>Сообщения</span>
                          </Link>
                          <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all">
                             <LogOut className="w-5 h-5" />
                             <span>Выйти</span>
                          </button>
                       </div>
                    ) : (
                       <div className="space-y-3 px-4 pt-2">
                          <Link to="/login" className="block w-full text-center py-4 rounded-2xl text-sm font-black text-gray-700 border border-gray-100 hover:bg-gray-50 transition-all" onClick={() => setMobileMenuOpen(false)}>Войти</Link>
                          <Link to="/register" className="block w-full text-center py-4 rounded-2xl text-sm font-black text-white bg-blue-600 shadow-lg shadow-blue-500/20" onClick={() => setMobileMenuOpen(false)}>Регистрация</Link>
                       </div>
                    )}
                 </div>
              </aside>
          </div>
        )}

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
