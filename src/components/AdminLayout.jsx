import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, Briefcase, PieChart, MessageSquare, ChevronDown, LogOut, User, Menu, X } from 'lucide-react';

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Пользователи', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Вакансии', path: '/admin/vacancies', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Отчеты и аналитика', path: '/admin/analytics', icon: <PieChart className="w-5 h-5" /> },
    { name: 'Запросы', path: '/admin/queries', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 md:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-blue-600 transform rotate-45 flex items-center justify-center relative shadow-lg shadow-blue-500/20">
               <div className="w-4 h-4 bg-white absolute" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            </div>
            <span className="text-lg md:text-xl font-black text-[#1e293b] tracking-tight ml-2 uppercase">Border</span>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center space-x-2 md:space-x-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 py-1.5 pl-1.5 pr-2 md:pr-4 rounded-full transition-all"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                   <User className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                </div>
                <span className="text-xs md:text-sm font-bold text-gray-700 hidden sm:inline">Admin</span>
                <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Управление</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center space-x-3 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Выйти из системы</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
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
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col py-8 px-6 space-y-2 animate-in slide-in-from-left duration-300">
               <div className="flex items-center space-x-3 mb-10 px-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 transform rotate-45 flex items-center justify-center relative">
                    <div className="w-4 h-4 bg-white absolute" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                  </div>
                  <span className="text-xl font-black text-[#1e293b] tracking-tight uppercase">Border Admin</span>
               </div>
               
               {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path === '/admin/users' && location.pathname.startsWith('/admin/user/'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </aside>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-100 hidden md:flex flex-col py-8 px-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/admin/users' && location.pathname.startsWith('/admin/user/'));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </aside>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-[1400px] mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
