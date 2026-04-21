import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useVacancy } from '../../contexts/VacancyContext';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, Briefcase, Phone, MessageSquare, ArrowLeft } from 'lucide-react';

export default function JobseekerVacancyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vacancies, updateVacancy } = useVacancy();
  const { currentUser } = useAuth();
  const [applied, setApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  
  // Modal form state
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);
  const fileInputRef = React.useRef(null);

  // Найти нужную вакансию
  const vacancy = vacancies.find(v => v.id === id);

  useEffect(() => {
    if (currentUser && vacancy) {
      const apps = JSON.parse(localStorage.getItem(`applications_${currentUser.id}`) || '[]');
      setApplied(apps.some(a => a.vacancyId === vacancy.id));
    }
  }, [currentUser, vacancy]);

  if (!vacancy) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-bold text-gray-800">Вакансия не найдена</h2>
        <button onClick={() => navigate('/jobseeker')} className="mt-4 text-blue-600 hover:underline">
          Вернуться к списку
        </button>
      </div>
    );
  }

  const handleApply = () => {
    if (!currentUser) return;
    const apps = JSON.parse(localStorage.getItem(`applications_${currentUser.id}`) || '[]');
    if (!apps.some(a => a.vacancyId === vacancy.id)) {
      const newApp = {
        id: Date.now().toString(),
        vacancyId: vacancy.id,
        employerId: vacancy.employerId || null,
        jobseekerId: currentUser.id,
        jobseekerName: currentUser.name || `${currentUser.firstName} ${currentUser.lastName}`.trim() || 'Кандидат',
        jobseekerPhoto: currentUser.photo || null,
        position: vacancy.position,
        company: vacancy.company,
        category: vacancy.category || 'Отрасль не указана',
        experience: vacancy.experience || 'Не указано',
        country: vacancy.country || '',
        city: vacancy.city || '',
        appliedAt: new Date().toLocaleDateString('ru-RU'),
        status: 'В рассмотрении',
      };
      
      apps.push(newApp);
      localStorage.setItem(`applications_${currentUser.id}`, JSON.stringify(apps));

      // Also add to global store for employers
      const allApps = JSON.parse(localStorage.getItem('all_applications') || '[]');
      allApps.push(newApp);
      localStorage.setItem('all_applications', JSON.stringify(allApps));

      // Push a notification for the employer
      const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
      allNotifs.push({
        id: Date.now(),
        userId: newApp.employerId, // Target user is the employer
        text: `Новый отклик на вакансию ${newApp.position} от ${newApp.jobseekerName}`,
        isRead: false
      });
      localStorage.setItem('notifications', JSON.stringify(allNotifs));

      // Create a chat thread with the cover letter as the first message
      const allChats = JSON.parse(localStorage.getItem('chats') || '[]');
      
      let initialMessage = coverLetter;
      if (selectedResume) {
        initialMessage = `${initialMessage ? initialMessage + '\n\n' : ''}[Прикреплен файл: ${selectedResume.name}]`;
      }

      const newChat = {
        id: `chat_${Date.now()}`,
        applicationId: newApp.id,
        employerId: newApp.employerId,
        employerName: newApp.company,
        jobseekerId: newApp.jobseekerId,
        jobseekerName: newApp.jobseekerName,
        jobseekerPhoto: newApp.jobseekerPhoto,
        position: newApp.position,
        lastUpdated: new Date().toISOString(),
        messages: initialMessage ? [{
          id: `msg_${Date.now()}`,
          senderId: currentUser.id,
          text: initialMessage,
          timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
        }] : []
      };
      allChats.push(newChat);
      localStorage.setItem('chats', JSON.stringify(allChats));

      // Update counter on the vacancy itself
      updateVacancy(vacancy.id, { applicationsCount: (vacancy.applicationsCount || 0) + 1 });

      setApplied(true);
      setShowApplyModal(false);
    }
  };

  return (
    <div className="w-full">
      <button 
        onClick={() => navigate('/jobseeker')} 
        className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>К списку вакансий</span>
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 min-h-[600px]">
        {/* Header */}
        <p className="text-xs text-gray-400 font-bold mb-2">
          Дата объявления: {new Date(vacancy.createdAt).toLocaleDateString('ru-RU')}
        </p>
        <div className="flex items-start justify-between border-b border-gray-100 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">{vacancy.position}</h1>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                {/* Logo placeholder */}
                <span className="text-blue-600 font-bold text-sm">
                  {vacancy.company ? vacancy.company.substring(0, 2).toUpperCase() : 'CO'}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-700">{vacancy.company || 'Неизвестная компания'}</span>
            </div>
          </div>
          <div>
            {applied ? (
              <span className="inline-flex items-center space-x-2 bg-green-50 text-green-600 border border-green-200 px-8 py-3.5 rounded-full text-sm font-bold">
                ✓ Вы откликнулись
              </span>
            ) : (
              <button
                onClick={() => {
                  if (!currentUser) {
                    navigate('/login', { state: { from: `/jobseeker/vacancy/${vacancy.id}` } });
                  } else {
                    setShowApplyModal(true);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all shadow-md shadow-blue-500/20"
              >
                {currentUser ? 'Откликнуться' : 'Войдите, чтобы откликнуться'}
              </button>
            )}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          
          {/* Left Column - Main Details */}
          <div className="space-y-8">
            {vacancy.aboutCompany && (
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-3">О компании</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {vacancy.aboutCompany}
                </p>
              </div>
            )}

            {vacancy.description && (
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-3">Описание к вакансии</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {vacancy.description}
                </p>
              </div>
            )}

            {vacancy.requirements && vacancy.requirements.length > 0 && (
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-3">Требуемые навыки</h3>
                <ul className="text-sm text-gray-600 space-y-2 pl-1 list-none">
                  {vacancy.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-gray-400 mr-2 mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {vacancy.contacts && vacancy.contacts.length > 0 && (
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-3">Контактная информация</h3>
                <ul className="text-sm text-gray-600 space-y-2 pl-1 list-none">
                  {vacancy.contacts.map((contact, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-gray-400 mr-2 mt-1">•</span>
                      <span>{contact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {vacancy.additionalInfo && vacancy.additionalInfo.length > 0 && (
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-3">Дополнительная информация</h3>
                <ul className="text-sm text-gray-600 space-y-2 pl-1 list-none">
                  {vacancy.additionalInfo.map((info, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-gray-400 mr-2 mt-1">•</span>
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar Summary */}
          <div>
            <div className="space-y-6">
              {/* Info blocks matching figma */}
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">ОТКЛИКИ</p>
                <div className="flex items-center space-x-1.5 text-sm font-medium text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-[10px]">👁</span>
                  <span>{vacancy.applicationsCount || 0}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">ЛОКАЦИЯ</p>
                <p className="text-sm font-medium text-gray-700">{[vacancy.country, vacancy.city].filter(Boolean).join(', ') || '—'}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">ОТРАСЛЬ</p>
                <p className="text-sm font-medium text-gray-700">{vacancy.category || '—'}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">ВИД ЗАНЯТОСТИ</p>
                <p className="text-sm font-medium text-gray-700">{vacancy.employmentType || '—'}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">ТРЕБУЕМЫЙ ОПЫТ РАБОТЫ</p>
                <p className="text-sm font-medium text-gray-700">{vacancy.experience || '—'}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">ОКЛАД</p>
                <p className="text-sm font-medium text-gray-700">{vacancy.salary || 'По договоренности'}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">СВЯЗАТЬСЯ</p>
                <div className="flex items-center space-x-3 mt-2">
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Related Vacancies */}
            {vacancy.relatedVacancies && vacancy.relatedVacancies.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-4">ПОХОЖИЕ ВАКАНСИИ</p>
                <div className="space-y-4">
                  {vacancy.relatedVacancies.map((rel, idx) => (
                    <div key={idx} className="bg-gray-50 cursor-pointer hover:bg-white border hover:border-blue-200 transition-colors border-transparent rounded-xl p-4">
                      <p className="text-xs font-bold text-gray-800 line-clamp-2 mb-2 hover:text-blue-600">{rel.title}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-gray-400 uppercase">Оклад</p>
                          <p className="text-xs font-semibold text-gray-700 ml-2">{rel.salary}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowApplyModal(false)} 
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 text-xl font-bold"
            >
              ✕
            </button>
            
            <h3 className="text-xl font-black text-gray-900 mb-6 pr-6">
              Подать заявку на эту вакансию
            </h3>
            
            <div className="space-y-4">
              <input 
                type="text" 
                defaultValue={currentUser?.name || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim()}
                readOnly
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none font-medium text-gray-500 shadow-sm"
              />
              <input 
                type="email" 
                defaultValue={currentUser?.email}
                readOnly
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none font-medium text-gray-500 shadow-sm"
              />
              <textarea 
                placeholder="Напишите Coverletter..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full h-32 px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium placeholder-gray-400 resize-none shadow-sm"
              ></textarea>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 transition-colors"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".doc,.docx,.pdf"
                  onChange={(e) => setSelectedResume(e.target.files[0])}
                />
                <span className="text-blue-600 text-sm font-bold">
                  {selectedResume ? `Выбрано: ${selectedResume.name}` : 'Загрузить резюме (doc, pdf)'}
                </span>
                {selectedResume && <span className="text-[10px] text-green-500 font-bold mt-1">Файл готов к отправке</span>}
              </div>
              
              <button 
                onClick={handleApply}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-500/30 mt-2"
              >
                Подать заявку
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
