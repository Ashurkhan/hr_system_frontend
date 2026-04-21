import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, User, MoreHorizontal, Edit, Trash, MessageCircle, Paperclip } from 'lucide-react';
import { useVacancy } from '../contexts/VacancyContext';
import { useAuth } from '../contexts/AuthContext';

export default function Vacancies() {
  const { vacancies, deleteVacancy, updateVacancy } = useVacancy();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('vacancies');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [appsSort, setAppsSort] = useState('');
  const [dateSort, setDateSort] = useState('');
  
  const [menuOpenId, setMenuOpenId] = useState(null);
  
  // Candidates State
  const [employerApps, setEmployerApps] = useState([]);
  const [actionModal, setActionModal] = useState(null); // { type: 'accept'|'reject'|'invite', appId, jobseekerId, candidateName }
  const [inviteMessage, setInviteMessage] = useState('');
  
  // State for Candidate Profile Detail View
  const [candidateDetail, setCandidateDetail] = useState(null);
  const [detailMessageText, setDetailMessageText] = useState('');
  const [statusDropdownId, setStatusDropdownId] = useState(null);
  const [inviteFile, setInviteFile] = useState(null);
  const inviteFileRef = React.useRef(null);

  const sendDetailMessage = () => {
    if (!detailMessageText.trim() || !candidateDetail) return;
    
    // Find chat
    const allChats = JSON.parse(localStorage.getItem('chats') || '[]');
    let chat = allChats.find(c => c.applicationId === candidateDetail.id);
    if (!chat) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: detailMessageText.trim(),
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
    };

    const updatedChats = allChats.map(c => {
      if (c.id === chat.id) {
        return {
          ...c,
          messages: [...(c.messages || []), newMsg],
          lastUpdated: new Date().toISOString()
        };
      }
      return c;
    });

    localStorage.setItem('chats', JSON.stringify(updatedChats));
    setDetailMessageText('');
    setCandidateDetail({ ...candidateDetail, forceRender: Date.now() }); // Force chat to re-read localStorage
  };

  const openInviteModal = (appId, jobseekerId, candidateName) => {
    setInviteMessage(`Добрый день, ${candidateName},\n\nМы хотим пригласить вас на собеседование в нашей компании. Мы впечатлены вашим резюме и хотели бы обсудить ваш потенциал. Пожалуйста, подтвердите доступность на [дата] в [время]. Мы с нетерпением ждем встречи с вами!\n\nС наилучшими пожеланиями, ${currentUser?.name || 'HR-менеджер'}\n${currentUser?.companyName || 'Компания'}`);
    setActionModal({ type: 'invite', appId, jobseekerId, candidateName });
  };

  const handleInviteSubmit = (appId, jobseekerId) => {
    // Append this message to the chat
    const allChats = JSON.parse(localStorage.getItem('chats') || '[]');
    let updatedChats = allChats.map(chat => {
      if (chat.applicationId === appId && chat.jobseekerId === jobseekerId) {
        return {
          ...chat,
          messages: [...(chat.messages || []), {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            text: inviteMessage,
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
          }],
          lastUpdated: new Date().toISOString()
        };
      }
      return chat;
    });
    localStorage.setItem('chats', JSON.stringify(updatedChats));

    // Send notification to jobseeker
    const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    allNotifs.push({
      id: Date.now(),
      userId: jobseekerId,
      text: `Работодатель ${currentUser?.companyName || 'Компания'} пригласил вас на собеседование!`,
      isRead: false
    });
    localStorage.setItem('notifications', JSON.stringify(allNotifs));

    updateAppStatus(appId, jobseekerId, 'Приглашен на собеседование');
  };

  React.useEffect(() => {
    if (activeTab === 'candidates') {
      const allApps = JSON.parse(localStorage.getItem('all_applications') || '[]');
      const apps = allApps.filter(app => app.employerId === currentUser?.id);
      // Fallback: if 'employerId' wasn't set previously, maybe try to match by company name or just show mock
      setEmployerApps(apps);
    }
  }, [activeTab, currentUser, vacancies]);

  const updateAppStatus = (appId, jobseekerId, newStatus) => {
    // 1. Update local state
    setEmployerApps(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
    
    // 2. Update global all_applications
    const allApps = JSON.parse(localStorage.getItem('all_applications') || '[]');
    const theApp = allApps.find(app => app.id === appId);
    const updatedAll = allApps.map(app => app.id === appId ? { ...app, status: newStatus } : app);
    localStorage.setItem('all_applications', JSON.stringify(updatedAll));
    
    // 3. Update jobseeker's personal applications list so they see the status change
    const jsApps = JSON.parse(localStorage.getItem(`applications_${jobseekerId}`) || '[]');
    const updatedJsApps = jsApps.map(app => app.id === appId ? { ...app, status: newStatus } : app);
    localStorage.setItem(`applications_${jobseekerId}`, JSON.stringify(updatedJsApps));

    // 4. Send notification to the jobseeker about status change
    const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    const positionName = theApp?.position || 'вакансию';
    const companyName = currentUser?.companyName || currentUser?.name || 'Компания';
    let notifText = '';
    if (newStatus === 'Принято') {
      notifText = `Поздравляем! Ваша заявка на позицию «${positionName}» в компании ${companyName} была принята! Вас приглашают на собеседование.`;
    } else if (newStatus === 'Отклонено') {
      notifText = `К сожалению, ваша заявка на позицию «${positionName}» в компании ${companyName} была отклонена.`;
    }
    if (notifText) {
      allNotifs.push({
        id: Date.now(),
        userId: jobseekerId,
        text: notifText,
        isRead: false
      });
      localStorage.setItem('notifications', JSON.stringify(allNotifs));
    }
    
    setActionModal(null);
    setStatusDropdownId(null);
  };
  
  const getAppStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'принято': return 'text-green-600 bg-green-50 border-green-200';
      case 'отклонено': return 'text-red-600 bg-red-50 border-red-200';
      case 'приглашен на собеседование': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200'; // В рассмотрении
    }
  };

  // Filter only current user's vacancies, and apply search
  let filteredVacancies = vacancies.filter(v => 
    v.employerId === currentUser?.id &&
    v.position?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (statusFilter) {
    filteredVacancies = filteredVacancies.filter(v => v.status === statusFilter);
  }

  // Сортировка по дате (по умолчанию пусть будут новые, если выбрано)
  if (dateSort === 'new') {
    filteredVacancies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (dateSort === 'old') {
    filteredVacancies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  // Сортировка по откликам (имеет приоритет, если выбрана)
  if (appsSort === 'desc') {
    filteredVacancies.sort((a, b) => b.applicationsCount - a.applicationsCount);
  } else if (appsSort === 'asc') {
    filteredVacancies.sort((a, b) => a.applicationsCount - b.applicationsCount);
  }

  const toggleMenu = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'открыто': return 'text-green-600 border-green-200 bg-green-50';
      case 'архив': return 'text-gray-600 border-gray-200 bg-gray-50';
      case 'закрыто': return 'text-red-600 border-red-200 bg-red-50';
      default: return 'text-blue-600 border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="w-full">
      {/* Tabs Layout */}
      <div className="bg-white rounded-[24px] px-2 pt-2 pb-0 mb-6 border border-gray-100 flex overflow-hidden w-max shadow-sm">
        <button 
          className={`px-8 py-3.5 text-sm font-bold border-b-2 transition-colors ${activeTab === 'vacancies' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('vacancies')}
        >
          Мои вакансии
        </button>
        <button 
          className={`px-8 py-3.5 text-sm font-bold border-b-2 transition-colors ${activeTab === 'candidates' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('candidates')}
        >
          Кандидаты
        </button>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Поиск" 
            className="w-full pl-11 pr-5 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-500 outline-none transition-all font-medium placeholder-gray-400 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select 
          className="bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl text-sm font-medium outline-none cursor-pointer hidden md:block focus:ring-2 focus:ring-blue-100 shadow-sm"
          value={appsSort}
          onChange={(e) => {
            setAppsSort(e.target.value);
            if (e.target.value) setDateSort(''); // Сброс другой сортировки для избежания конфликтов
          }}
        >
          <option value="">По количеству откликов</option>
          <option value="desc">Сначала больше</option>
          <option value="asc">Сначала меньше</option>
        </select>
        
        <select 
          className="bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl text-sm font-medium outline-none cursor-pointer hidden md:block focus:ring-2 focus:ring-blue-100 shadow-sm"
          value={dateSort}
          onChange={(e) => {
            setDateSort(e.target.value);
            if (e.target.value) setAppsSort(''); // Сброс другой сортировки
          }}
        >
          <option value="">По дате создания</option>
          <option value="new">Сначала новые</option>
          <option value="old">Сначала старые</option>
        </select>

        <select 
          className="bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl text-sm font-medium outline-none cursor-pointer hidden md:block focus:ring-2 focus:ring-blue-100 shadow-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">По статусу</option>
          <option value="Открыто">Открыто</option>
          <option value="Закрыто">Закрыто</option>
          <option value="Архив">Архив</option>
        </select>

        <Link to="/vacancies/create" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all">
          <Plus className="w-4 h-4" />
          <span>Создать</span>
        </Link>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden min-h-[400px]">
        {activeTab === 'vacancies' && (
          filteredVacancies.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
              <p className="font-medium text-lg">Нет вакансий</p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-5 font-bold">ПОЗИЦИЯ</th>
                  <th className="px-6 py-5 font-bold">ВИД ЗАНЯТОСТИ</th>
                  <th className="px-6 py-5 font-bold">ОКЛАД</th>
                  <th className="px-6 py-5 font-bold">ОПЫТ РАБОТЫ</th>
                  <th className="px-6 py-5 font-bold">ОТКЛИКИ</th>
                  <th className="px-6 py-5 font-bold">СОЗДАНО</th>
                  <th className="px-6 py-5 font-bold">СТАТУС</th>
                  <th className="px-6 py-5 font-bold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredVacancies.map((vacancy) => (
                  <tr key={vacancy.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <span className="text-[14px] font-bold text-gray-900">{vacancy.position}</span>
                    </td>
                    <td className="px-6 py-5 text-[13px] font-semibold text-gray-600">
                      {vacancy.employmentType}
                    </td>
                    <td className="px-6 py-5 text-[13px] font-semibold text-gray-900">
                      {vacancy.salary}
                    </td>
                    <td className="px-6 py-5 text-[13px] font-semibold text-gray-600">
                      {vacancy.experience}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md w-max font-bold text-[13px]">
                        <User className="w-3.5 h-3.5" />
                        <span>{vacancy.applicationsCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[13px] font-semibold text-gray-600">
                      {new Date(vacancy.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold border ${getStatusColor(vacancy.status)}`}>
                        {vacancy.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right relative">
                      <button 
                        onClick={() => toggleMenu(vacancy.id)}
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      {menuOpenId === vacancy.id && (
                         <div className="absolute right-8 top-10 w-40 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-10 font-medium">
                            <Link 
                              to={`/vacancies/${vacancy.id}/edit`}
                              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm w-full text-left"
                            >
                               <Edit className="w-4 h-4 text-blue-500" />
                               <span>Редактировать</span>
                            </Link>
                            <button 
                              onClick={() => deleteVacancy(vacancy.id)}
                              className="flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600 text-sm w-full text-left"
                            >
                               <Trash className="w-4 h-4" />
                               <span>Удалить</span>
                            </button>
                            <button 
                              onClick={() => {
                                updateVacancy(vacancy.id, { status: 'Архив' });
                                setMenuOpenId(null);
                              }}
                              className="flex items-center px-6 py-2 hover:bg-gray-50 text-gray-700 text-sm w-full text-left"
                            >
                               <span>Архивировать</span>
                            </button>
                            <button 
                              onClick={() => {
                                updateVacancy(vacancy.id, { status: 'Закрыто' });
                                setMenuOpenId(null);
                              }}
                              className="flex items-center px-6 py-2 hover:bg-gray-50 text-gray-700 text-sm w-full text-left"
                            >
                               <span>Закрыть</span>
                            </button>
                            <button 
                              onClick={() => {
                                updateVacancy(vacancy.id, { status: 'Открыто' });
                                setMenuOpenId(null);
                              }}
                              className="flex items-center px-6 py-2 hover:bg-gray-50 text-gray-700 text-sm w-full text-left"
                            >
                               <span>Открыть</span>
                            </button>
                         </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )
        )}

        {/* CANDIDATES TAB */}
        {activeTab === 'candidates' && (
          employerApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
              <p className="font-medium text-lg">Пока нет кандидатов</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-5 font-bold">ФИО КАНДИДАТА</th>
                    <th className="px-6 py-5 font-bold">ПОЗИЦИЯ</th>
                    <th className="px-6 py-5 font-bold">ОПЫТ РАБОТЫ</th>
                    <th className="px-6 py-5 font-bold">ЛОКАЦИЯ</th>
                    <th className="px-6 py-5 font-bold">ДАТА ЗАЯВКИ</th>
                    <th className="px-6 py-5 font-bold">СТАТУС</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {employerApps.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                      <td 
                        className="px-6 py-5 font-bold text-gray-900 text-sm hover:text-blue-600 cursor-pointer"
                        onClick={() => setCandidateDetail(app)}
                      >
                        {app.jobseekerName}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-800 font-semibold">
                        {app.position}
                        <div className="text-xs text-gray-500 font-normal mt-1">{app.category}</div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                        {app.experience}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                        {[app.country, app.city].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                        {app.appliedAt}
                      </td>
                      <td className="px-6 py-5">
                        {app.status === 'В рассмотрении' ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setActionModal({ type: 'accept', appId: app.id, jobseekerId: app.jobseekerId, candidateName: app.jobseekerName })} 
                              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
                            >
                              Принять ✓
                            </button>
                            <button 
                              onClick={() => setActionModal({ type: 'reject', appId: app.id, jobseekerId: app.jobseekerId, candidateName: app.jobseekerName })} 
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
                            >
                              Отклонить ✕
                            </button>
                          </div>
                        ) : (
                          <div className="relative w-max">
                             <button
                               onClick={(e) => { e.stopPropagation(); setStatusDropdownId(statusDropdownId === app.id ? null : app.id); }}
                               className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity ${getAppStatusColor(app.status)}`}
                             >
                               {app.status} <span className="text-[10px]">▼</span>
                             </button>
                             {statusDropdownId === app.id && (
                               <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-10 font-medium">
                                 {app.status !== 'Принято' && (
                                   <button onClick={(e) => { e.stopPropagation(); updateAppStatus(app.id, app.jobseekerId, 'Принято'); }} className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-emerald-600 text-sm">
                                     Принять на работу
                                   </button>
                                 )}
                                 {app.status !== 'Приглашен на собеседование' && (
                                   <button onClick={(e) => { e.stopPropagation(); openInviteModal(app.id, app.jobseekerId, app.jobseekerName); setStatusDropdownId(null); }} className="w-full text-left px-4 py-2 hover:bg-yellow-50 text-yellow-600 text-sm">
                                     Пригласить на собеседование
                                   </button>
                                 )}
                                 {app.status !== 'Отклонено' && (
                                   <button onClick={(e) => { e.stopPropagation(); updateAppStatus(app.id, app.jobseekerId, 'Отклонено'); }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm">
                                     Отклонить
                                   </button>
                                 )}
                               </div>
                             )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Action Modals */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
            <button onClick={() => setActionModal(null)} className="absolute top-4 right-5 text-gray-400 hover:text-gray-800 text-xl font-bold">✕</button>
            
            {actionModal.type === 'accept' && (
              <div className="text-center">
                <h3 className="text-xl font-black text-gray-900 mb-4">Принять</h3>
                <p className="text-sm font-medium text-gray-600 mb-8">Вы уверены, что хотите предварительно одобрить этого кандидата и рассмотреть его дальше?</p>
                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => updateAppStatus(actionModal.appId, actionModal.jobseekerId, 'Принято')} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-bold text-sm transition-all shadow-lg shadow-emerald-500/30">Принять</button>
                  <button onClick={() => setActionModal(null)} className="bg-white border-2 border-gray-100 hover:border-gray-300 text-gray-600 px-8 py-3 rounded-full font-bold text-sm transition-all">Отмена</button>
                </div>
              </div>
            )}

            {actionModal.type === 'reject' && (
              <div className="text-center">
                <h3 className="text-xl font-black text-gray-900 mb-4">Отклонить заявку</h3>
                <p className="text-sm font-medium text-gray-600 mb-8">Вы уверены, что хотите отклонить заявку кандидата {actionModal.candidateName}? Дальнейшие действия по этой заявке будут недоступны.</p>
                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => updateAppStatus(actionModal.appId, actionModal.jobseekerId, 'Отклонено')} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold text-sm transition-all shadow-lg shadow-red-500/30">Отклонить</button>
                  <button onClick={() => setActionModal(null)} className="bg-white border-2 border-gray-100 hover:border-gray-300 text-gray-600 px-8 py-3 rounded-full font-bold text-sm transition-all">Отмена</button>
                </div>
              </div>
            )}

            {actionModal.type === 'invite' && (
              <div className="text-left w-full">
                <h3 className="text-xl font-black text-gray-900 mb-6 w-[90%]">Пригласить на собеседование</h3>
                
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full h-48 bg-white border border-gray-200 rounded-2xl p-5 mb-4 text-sm text-gray-700 font-medium outline-none focus:border-blue-500 shadow-sm resize-none leading-relaxed"
                ></textarea>

                <div 
                  onClick={() => inviteFileRef.current?.click()}
                  className="border-2 border-dashed border-blue-200 rounded-xl p-6 mb-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 transition-colors"
                >
                  <input 
                    type="file" 
                    ref={inviteFileRef}
                    className="hidden"
                    onChange={(e) => setInviteFile(e.target.files[0])}
                  />
                  <span className="text-blue-500 text-sm font-semibold">
                    {inviteFile ? `Прикреплено: ${inviteFile.name}` : 'Загрузить файл (doc, pdf)'}
                  </span>
                </div>

                <div className="flex justify-end">
                  <button onClick={() => handleInviteSubmit(actionModal.appId, actionModal.jobseekerId)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-500/30">Пригласить</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Candidate Full Profile Detail Modal */}
      {candidateDetail && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[1200px] h-auto max-h-[95vh] relative flex flex-col overflow-hidden">
            <button 
              onClick={() => setCandidateDetail(null)} 
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 text-2xl font-bold z-10"
            >✕</button>

            <div className="flex-1 overflow-y-auto w-full p-10 flex gap-8">
              
              {/* Left Column - Candidate Profile */}
              <div className="flex-[2] min-w-[400px] pr-8 border-r border-gray-100">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                    <span className="text-gray-300">🔖</span> {candidateDetail.jobseekerName}
                  </h2>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => { updateAppStatus(candidateDetail.id, candidateDetail.jobseekerId, 'Принято'); setCandidateDetail(null); }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full font-bold text-sm"
                    >Принять ✓</button>
                    <button 
                      onClick={() => { updateAppStatus(candidateDetail.id, candidateDetail.jobseekerId, 'Отклонено'); setCandidateDetail(null); }}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-bold text-sm"
                    >Отклонить ✕</button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-10">
                   <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                     {candidateDetail.jobseekerPhoto ? (
                       <img src={candidateDetail.jobseekerPhoto} alt="avatar" className="w-full h-full object-cover" />
                     ) : <User className="w-8 h-8 text-gray-500" />}
                   </div>
                   <div className="text-lg font-bold text-gray-800">{candidateDetail.position}</div>
                </div>

                <div className="space-y-8">
                   <div>
                     <h4 className="text-base font-black text-gray-900 mb-2">О себе</h4>
                     <p className="text-sm font-medium text-gray-600 leading-relaxed">
                       У меня есть 2-летний опыт проектирования веб-интерфейсов, мобильных приложений и сложных систем в Fintech, HRtech и других пользовательских интерфейсах, я занимаюсь исследованиями UX, используя Google Material Design и принцип KISS.
                     </p>
                   </div>
                   
                   <div>
                     <h4 className="text-base font-black text-gray-900 mb-2">Образование</h4>
                     <p className="text-sm font-medium text-gray-600">Магистратура</p>
                   </div>

                   <div>
                     <h4 className="text-base font-black text-gray-900 mb-2">Учебное заведение</h4>
                     <p className="text-sm font-medium text-gray-600">Кыргызско-Германский институт прикладной информатики</p>
                   </div>

                   <div>
                     <h4 className="text-base font-black text-gray-900 mb-2">Месяц и год окончания</h4>
                     <p className="text-sm font-medium text-gray-600">Май, 2020</p>
                   </div>

                   <div>
                     <h4 className="text-base font-black text-gray-900 mb-2">Позиция</h4>
                     <p className="text-sm font-medium text-gray-600">{candidateDetail.position}</p>
                   </div>

                   <div>
                     <h4 className="text-base font-black text-gray-900 mb-2">Место работы</h4>
                     <p className="text-sm font-medium text-gray-600">FortyLines IO</p>
                   </div>

                   <div>
                     <h4 className="text-base font-black text-gray-900 mb-2">Период работы</h4>
                     <p className="text-sm font-medium text-gray-600">Май, 2020 - Май, 2023</p>
                   </div>
                </div>
              </div>
              
              {/* Middle Column - Details */}
              <div className="flex-1 min-w-[240px]">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-8">
                  <MessageCircle className="w-5 h-5" />
                </div>

                <div className="space-y-6">
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">CV</h5>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:underline">{candidateDetail.jobseekerName.split(' ')[0].toLowerCase()}_cv.pdf</a>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">ДАТА РОЖДЕНИЯ</h5>
                    <p className="text-sm font-semibold text-gray-800">23/02/1998</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">ЛОКАЦИЯ</h5>
                    <p className="text-sm font-semibold text-gray-800">{candidateDetail.country || 'Кыргызстан'}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">ГОРОД</h5>
                    <p className="text-sm font-semibold text-gray-800">{candidateDetail.city || 'Бишкек'}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">АДРЕС</h5>
                    <p className="text-sm font-semibold text-gray-800">Тунгуч 49</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">ЭЛЕКТРОННАЯ ПОЧТА</h5>
                    <p className="text-sm font-semibold text-gray-800">{currentUser?.email || 'm.tynchtykova@gmail.com'}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">ТЕЛЕФОН</h5>
                    <p className="text-sm font-semibold text-gray-800">+996 (554) 30-67-50</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Chat Window */}
              <div className="flex-[1.5] min-w-[340px]">
                <div className="w-full h-full border border-gray-200 rounded-3xl flex flex-col shadow-sm bg-white overflow-hidden">
                   <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                       {candidateDetail.jobseekerPhoto ? (
                         <img src={candidateDetail.jobseekerPhoto} alt="avatar" className="w-full h-full object-cover" />
                       ) : <User className="w-5 h-5 text-gray-500" />}
                     </div>
                     <span className="font-bold text-sm text-gray-900">{candidateDetail.jobseekerName}</span>
                   </div>
                   
                   <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
                     {(() => {
                        const chats = JSON.parse(localStorage.getItem('chats') || '[]');
                        const chat = chats.find(c => c.applicationId === candidateDetail.id);
                        if (!chat || !chat.messages) return <p className="text-center text-xs text-gray-400 p-4">Нет истории чата</p>;

                        return chat.messages.map((msg, i) => {
                          const isNewDay = i === 0 || chat.messages[i - 1].date !== msg.date;
                          const isMine = msg.senderId === currentUser.id;
                          return (
                            <div key={msg.id}>
                              {isNewDay && <div className="text-center my-3"><span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{msg.date}</span></div>}
                              <div className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex max-w-[85%] gap-2 ${isMine ? 'flex-row-reverse' : 'row'}`}>
                                  {!isMine && (
                                     <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden mt-auto"></div>
                                  )}
                                  <div>
                                     <div className={`p-4 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm whitespace-pre-line ${
                                       isMine ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                                     }`}>
                                       {msg.text}
                                     </div>
                                     <div className={`text-[9px] text-gray-400 font-bold mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
                                       {msg.timestamp}
                                     </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        });
                     })()}
                   </div>
                   
                   <div className="p-3 border-t border-gray-100 bg-white">
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl flex items-center pr-2 focus-within:border-blue-300 transition-colors">
                        <input 
                          type="text" 
                          value={detailMessageText}
                          onChange={(e) => setDetailMessageText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') sendDetailMessage(); }}
                          placeholder="Написать сообщение..." 
                          className="w-full bg-transparent border-none px-4 py-3 text-sm font-medium outline-none"
                        />
                        <button className="p-2 text-gray-400 hover:text-gray-600"><Paperclip className="w-4 h-4" /></button>
                        <button onClick={sendDetailMessage} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-xl font-bold text-xs ml-1 transition-colors">Отправить</button>
                      </div>
                   </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}

      {/* Pagination Mock */}
      <div className="flex justify-end mt-6">
        <div className="flex space-x-1 items-center">
            <span className="text-sm text-gray-400 font-medium mr-2">Пред</span>
            <button className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shadow-md">1</button>
            <button className="w-8 h-8 rounded-full text-gray-600 hover:bg-white text-sm font-bold flex items-center justify-center transition-colors">2</button>
            <button className="w-8 h-8 rounded-full text-gray-600 hover:bg-white text-sm font-bold flex items-center justify-center transition-colors">3</button>
            <span className="text-gray-400 px-1">...</span>
            <button className="w-8 h-8 rounded-full text-gray-600 hover:bg-white text-sm font-bold flex items-center justify-center transition-colors">8</button>
            <span className="text-sm text-gray-600 font-bold ml-2 cursor-pointer hover:text-blue-600">След</span>
        </div>
      </div>
    </div>
  );
}
