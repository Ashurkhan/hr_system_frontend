import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, ShieldCheck, Trash2, AlertCircle } from 'lucide-react';

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('password');
  
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [deletePass, setDeletePass] = useState('');
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false, delete: false });
  const [message, setMessage] = useState({ type: '', text: '' });

  const toggleShow = (key) => setShowPass(prev => ({ ...prev, [key]: !prev[key] }));

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      setMessage({ type: 'error', text: 'Новые пароли не совпадают' });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIdx = users.findIndex(u => u.id === currentUser.id);
    
    if (userIdx === -1) {
      setMessage({ type: 'error', text: 'Пользователь не найден' });
      return;
    }

    if (users[userIdx].password !== passwordData.current) {
      setMessage({ type: 'error', text: 'Текущий пароль введен неверно' });
      return;
    }

    // Update password
    users[userIdx].password = passwordData.new;
    localStorage.setItem('users', JSON.stringify(users));
    
    setMessage({ type: 'success', text: 'Пароль успешно изменен!' });
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleDeleteProfile = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIdx = users.findIndex(u => u.id === currentUser.id);

    if (userIdx === -1 || users[userIdx].password !== deletePass) {
      setMessage({ type: 'error', text: 'Неверный пароль' });
      return;
    }

    if (window.confirm('Вы уверены, что хотите навсегда удалить свой профиль? Это действие необратимо.')) {
      // 1. Remove from users database
      const updatedUsers = users.filter(u => u.id !== currentUser.id);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // 2. Role-based cleanup
      if (currentUser.role === 'employer') {
        // Delete employer's vacancies
        const vacancies = JSON.parse(localStorage.getItem('vacancies') || '[]');
        const updatedVacancies = vacancies.filter(v => v.employerId !== currentUser.id);
        localStorage.setItem('vacancies', JSON.stringify(updatedVacancies));

        // Delete applications to those vacancies
        const allApps = JSON.parse(localStorage.getItem('all_applications') || '[]');
        const updatedAllApps = allApps.filter(app => app.employerId !== currentUser.id);
        localStorage.setItem('all_applications', JSON.stringify(updatedAllApps));
      } else {
        // Jobseeker cleanup
        // Remove their applications from global list
        const allApps = JSON.parse(localStorage.getItem('all_applications') || '[]');
        const updatedAllApps = allApps.filter(app => app.jobseekerId !== currentUser.id);
        localStorage.setItem('all_applications', JSON.stringify(updatedAllApps));

        // Remove their personal applications list
        localStorage.removeItem(`applications_${currentUser.id}`);
      }

      // 3. System-wide cleanup (notifications, photos, etc)
      localStorage.removeItem(`photo_${currentUser.id}`);
      const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
      localStorage.setItem('notifications', JSON.stringify(notifs.filter(n => n.userId !== currentUser.id)));
      
      logout();
      navigate('/');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-[32px] font-black text-gray-900 mb-8 px-2">Настройки</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-8 px-2">
        <button 
          onClick={() => { setActiveTab('password'); setMessage({type:'', text:''}); }}
          className={`pb-4 px-6 text-sm font-bold transition-all border-b-2 ${activeTab === 'password' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Смена пароля
        </button>
        <button 
          onClick={() => { setActiveTab('delete'); setMessage({type:'', text:''}); }}
          className={`pb-4 px-6 text-sm font-bold transition-all border-b-2 ${activeTab === 'delete' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Удаление профиля
        </button>
      </div>

      <div className="px-2">
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center space-x-3 ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
            {message.type === 'error' ? <AlertCircle className="w-5 h-5"/> : <ShieldCheck className="w-5 h-5"/>}
            <span>{message.text}</span>
          </div>
        )}

        {activeTab === 'password' ? (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-900 ml-1">Текущий пароль</label>
              <div className="relative">
                <input 
                  type={showPass.current ? "text" : "password"}
                  required
                  placeholder="Введите текущий пароль"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium shadow-sm pr-12"
                />
                <button type="button" onClick={() => toggleShow('current')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-900 ml-1">Новый пароль</label>
              <div className="relative">
                <input 
                  type={showPass.new ? "text" : "password"}
                  required
                  placeholder="Введите новый пароль"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium shadow-sm pr-12"
                />
                <button type="button" onClick={() => toggleShow('new')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-900 ml-1">Подтвердите пароль</label>
              <div className="relative">
                <input 
                  type={showPass.confirm ? "text" : "password"}
                  required
                  placeholder="Подтвердите пароль"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium shadow-sm pr-12"
                />
                <button type="button" onClick={() => toggleShow('confirm')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-900 px-10 py-3.5 rounded-full text-sm font-bold transition-all shadow-sm"
              >
                Сменить пароль
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h3 className="text-base font-black text-gray-900 mb-3">Вы уверены?</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Если у вас возникли проблемы при использовании сервиса, не торопитесь удалять профиль, <span className="text-blue-500 cursor-pointer hover:underline">свяжитесь с нами</span>, мы постараемся вам помочь.
              </p>
            </div>

            <form onSubmit={handleDeleteProfile} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-900 ml-1">Подтвердите пароль</label>
                <div className="relative">
                  <input 
                    type={showPass.delete ? "text" : "password"}
                    required
                    placeholder="Подтвердите пароль"
                    value={deletePass}
                    onChange={(e) => setDeletePass(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium shadow-sm pr-12"
                  />
                  <button type="button" onClick={() => toggleShow('delete')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass.delete ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  className="bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-600 px-10 py-3.5 rounded-full text-sm font-bold transition-all shadow-sm flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Удалить профиль</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
