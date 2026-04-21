import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Ban, Trash2, ArrowLeft, Download, CheckSquare, Square } from 'lucide-react';

export default function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [permissions, setPermissions] = useState({
    viewCompanies: false,
    searchVacancies: true,
    trackStatus: true,
    contactEmployers: true
  });

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const found = allUsers.find(u => u.id === id);
    if (found) {
      setUser(found);
      const storedPhoto = localStorage.getItem(`photo_${found.id}`);
      setPhoto(storedPhoto);
    }
  }, [id]);

  if (!user) return <div className="p-10 text-center font-bold text-gray-400">Пользователь не найден</div>;

  const togglePermission = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updated = allUsers.filter(u => u.id !== id);
      localStorage.setItem('users', JSON.stringify(updated));
      navigate('/admin/users');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
           <button onClick={() => navigate('/admin/users')} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-gray-100">
             <ArrowLeft className="w-5 h-5 text-gray-400" />
           </button>
           <div className="bg-white border-2 border-blue-600 px-6 py-2 rounded-xl text-blue-600 text-sm font-bold shadow-sm">
             {user.role === 'jobseeker' ? 'Соискатель' : 'Работодатель'}
           </div>
        </div>

        <div className="flex items-center space-x-3">
           <button className="flex items-center space-x-2 bg-white text-gray-600 border border-gray-100 px-5 py-3 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all">
              <Ban className="w-4 h-4" />
              <span>Блокировать</span>
           </button>
           <button 
            onClick={handleDelete}
            className="flex items-center space-x-2 bg-red-50 text-red-600 border border-red-100 px-5 py-3 rounded-2xl text-sm font-bold hover:bg-red-100 transition-all"
           >
              <Trash2 className="w-4 h-4" />
              <span>Удалить</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-8">
        {/* Profile Card */}
        <div className="bg-white rounded-[40px] border border-gray-50 shadow-xl shadow-gray-200/20 p-8">
           <div className="flex items-center space-x-5 mb-10">
              <div className="w-24 h-24 rounded-3xl overflow-hidden bg-blue-50 border-4 border-white shadow-lg flex-shrink-0">
                 {photo ? (
                    <img src={photo} alt="profile" className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-black text-blue-600 uppercase">
                       {user.name?.[0] || 'U'}
                    </div>
                 )}
              </div>
              <div className="space-y-1">
                 <h2 className="text-xl font-black text-gray-900 tracking-tight">{user.name}</h2>
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{user.role === 'jobseeker' ? 'UI-UX дизайнер' : 'Размещение вакансий'}</p>
              </div>
           </div>

           <div className="space-y-6">
              <div>
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1.5">CV</p>
                 <a href="#" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-bold text-sm bg-blue-50/50 px-4 py-2 rounded-xl transition-all">
                    <span className="underline">{user.name?.toLowerCase().replace(' ', '_')}_cv.pdf</span>
                    <Download className="w-4 h-4" />
                 </a>
              </div>
              
              <div className="grid grid-cols-2 gap-y-6">
                 <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Дата рождения</p>
                    <p className="text-sm font-bold text-gray-900">23/02/1998</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Страна</p>
                    <p className="text-sm font-bold text-gray-900">Кыргызстан</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Город</p>
                    <p className="text-sm font-bold text-gray-900">Бишкек</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Адрес</p>
                    <p className="text-sm font-bold text-gray-900">Тунгуч 49</p>
                 </div>
              </div>

              <div>
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Электронная почта</p>
                 <p className="text-sm font-bold text-gray-900">{user.email}</p>
              </div>
              
              <div>
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Телефон</p>
                 <p className="text-sm font-bold text-gray-900">+996 (554) 30-67-50</p>
              </div>
           </div>
        </div>

        {/* Info Content */}
        <div className="space-y-8">
           {/* Detailed fields */}
           <div className="bg-white rounded-[40px] border border-gray-50 shadow-xl shadow-gray-200/20 p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="md:col-span-2">
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 uppercase">О себе</p>
                 <p className="text-sm font-bold text-gray-600 leading-relaxed max-w-2xl">
                    У меня есть 2-летний опыт проектирования веб-интерфейсов, мобильных приложений и сложных систем в Fintech, HRtech и других пользовательских интерфейсах, я занимаюсь исследованиями UX, используя Google Material Design и принцип KISS.
                 </p>
              </div>

              <div>
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 uppercase">Образование</p>
                 <p className="text-sm font-bold text-gray-900">Магистратура</p>
              </div>
              
              <div>
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 uppercase">Учебное заведение</p>
                 <p className="text-sm font-bold text-gray-900 text-wrap">Кыргызско-Германский институт прикладной информатики</p>
              </div>

              <div>
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 uppercase">Месяц и год окончания</p>
                 <p className="text-sm font-bold text-gray-900">Май, 2020</p>
              </div>

              <div>
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 uppercase">Позиция</p>
                 <p className="text-sm font-bold text-gray-900">UI-UX дизайнер</p>
              </div>

              <div>
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 uppercase">Место работы</p>
                 <p className="text-sm font-bold text-gray-900">Fortylines IO</p>
              </div>

              <div>
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2 uppercase">Период работы</p>
                 <p className="text-sm font-bold text-gray-900">Май, 2020 - Май, 2023</p>
              </div>
           </div>

           {/* Access Rights */}
           <div className="bg-white rounded-[40px] border border-gray-50 shadow-xl shadow-gray-200/20 p-10">
              <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight">Права доступа</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                 {[
                    { key: 'viewCompanies', label: 'Просмотр данных о компаниях', sub: 'Разрешить просматривать информацию о компаниях, такую как id компании, контактные данные, информацию о зарплате и другую связанную информацию.' },
                    { key: 'searchVacancies', label: 'Просмотр и поиск вакансий', sub: 'Соискатели могут получить доступ к списку вакансий, опубликованных на платформе, и осуществлять поиск по различным критериям.' },
                    { key: 'trackStatus', label: 'Отслеживание статуса заявок', sub: 'Соискатели могут видеть статус своих отправленных заявок на вакансии через HR-платформу.' },
                    { key: 'contactEmployers', label: 'Связь с работодателями', sub: 'Эта платформа позволяет им отслеживать, находится ли заявка в процессе рассмотрения, была ли она рассмотрена или отклонена.' },
                 ].map((item) => (
                    <div key={item.key} className="flex items-start space-x-4">
                       <button onClick={() => togglePermission(item.key)} className="mt-1 transition-colors">
                          {permissions[item.key] ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-gray-300" />}
                       </button>
                       <div className="space-y-2">
                          <p className="text-sm font-black text-gray-900 leading-none">{item.label}</p>
                          <p className="text-[11px] text-gray-400 font-bold leading-relaxed">{item.sub}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
