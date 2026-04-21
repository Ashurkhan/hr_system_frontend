import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Pencil, Plus, Trash2, X, Camera } from 'lucide-react';

const COUNTRIES = ['Кыргызстан', 'Казахстан', 'Россия', 'Беларусь', 'Узбекистан', 'Таджикистан', 'Другое'];
const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
const YEARS = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());
const EDUCATION_LEVELS = ['Среднее', 'Среднее специальное', 'Бакалавриат', 'Магистратура', 'Докторантура', 'Другое'];
const POSITIONS = [
  'UI-UX Дизайнер', 'Frontend-разработчик', 'Backend-разработчик', 'Full-stack разработчик',
  'Project Manager', 'Product Manager', 'Менеджер по продажам', 'Маркетолог',
  'HR-менеджер', 'Дизайнер', 'Аналитик', 'DevOps инженер', 'Другое',
];

const emptyEducation = () => ({
  id: Date.now() + Math.random(),
  level: 'Магистратура',
  institution: '',
  monthEnd: 'Май',
  yearEnd: '2020',
  isCurrent: false,
});

const emptyExperience = () => ({
  id: Date.now() + Math.random(),
  position: '',
  workplace: '',
  monthStart: 'Май',
  yearStart: '2020',
  monthEnd: 'Май',
  yearEnd: new Date().getFullYear().toString(),
  isCurrent: false,
});

export default function JobseekerProfile() {
  const { currentUser, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const photoInputRef = useRef();
  const cvInputRef = useRef();

  // --- state ---
  const [photo, setPhoto] = useState(currentUser?.photo || null);
  const [cvName, setCvName] = useState(currentUser?.cvName || null);

  const [personal, setPersonal] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    birthDate: currentUser?.birthDate || '',
    country: currentUser?.country || 'Кыргызстан',
    city: currentUser?.city || '',
    address: currentUser?.address || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
  });

  const [about, setAbout] = useState(currentUser?.about || '');
  const [educations, setEducations] = useState(
    currentUser?.educations?.length ? currentUser.educations : [emptyEducation()]
  );
  const [experiences, setExperiences] = useState(
    currentUser?.experiences?.length ? currentUser.experiences : [emptyExperience()]
  );
  const [skills, setSkills] = useState(
    Array.isArray(currentUser?.skills) ? currentUser.skills : []
  );

  // --- Photo upload handler ---
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setPhoto(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleCvChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setCvName(file.name);
  };

  // --- Education ---
  const updateEdu = (id, field, value) =>
    setEducations(educations.map(e => e.id === id ? { ...e, [field]: value } : e));
  const addEdu = () => setEducations([...educations, emptyEducation()]);
  const removeEdu = (id) => setEducations(educations.filter(e => e.id !== id));

  // --- Experience ---
  const updateExp = (id, field, value) =>
    setExperiences(experiences.map(e => e.id === id ? { ...e, [field]: value } : e));
  const addExp = () => setExperiences([...experiences, emptyExperience()]);
  const removeExp = (id) => setExperiences(experiences.filter(e => e.id !== id));

  // --- Skills ---
  const addSkill = () => {
    const t = newSkill.trim();
    if (t && !skills.includes(t)) setSkills([...skills, t]);
    setNewSkill('');
  };
  const removeSkill = (s) => setSkills(skills.filter(sk => sk !== s));

  // --- Save ---
  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      ...personal,
      name: `${personal.firstName} ${personal.lastName}`.trim(),
      photo,
      cvName,
      about,
      educations,
      experiences,
      skills,
    });
    setMessage('Профиль успешно сохранён!');
    setEditing(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCancel = () => {
    setPhoto(currentUser?.photo || null);
    setCvName(currentUser?.cvName || null);
    setPersonal({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      birthDate: currentUser?.birthDate || '',
      country: currentUser?.country || 'Кыргызстан',
      city: currentUser?.city || '',
      address: currentUser?.address || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
    });
    setAbout(currentUser?.about || '');
    setEducations(currentUser?.educations?.length ? currentUser.educations : [emptyEducation()]);
    setExperiences(currentUser?.experiences?.length ? currentUser.experiences : [emptyExperience()]);
    setSkills(Array.isArray(currentUser?.skills) ? currentUser.skills : []);
    setEditing(false);
  };

  // --- Styles ---
  const inputCls = editing
    ? 'w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 bg-white transition-all'
    : 'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium bg-gray-50 text-gray-700 outline-none cursor-default';
  const selectCls = editing
    ? 'w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm font-medium outline-none focus:border-blue-500 bg-white transition-all cursor-pointer'
    : 'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium bg-gray-50 text-gray-700 outline-none cursor-default';
  const lbl = 'block text-sm font-bold text-gray-700 mb-1.5';
  const req = <span className="text-red-500">*</span>;

  const initials = (personal.firstName?.[0] || '') + (personal.lastName?.[0] || '') || 'МТ';
  const fullName = `${personal.firstName} ${personal.lastName}`.trim() || 'Пользователь';

  // ===========================
  // READ-ONLY VIEW (two-column)
  // ===========================
  if (!editing) {
    return (
      <div className="max-w-3xl">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Мой профиль</h1>
          <button
            onClick={() => setEditing(true)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Pencil className="w-5 h-5" />
          </button>
        </div>

        {message && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm font-semibold border border-green-200">
            {message}
          </div>
        )}

        {/* Photo + Name */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
            {photo ? (
              <img src={photo} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-blue-600">{initials}</span>
            )}
          </div>
          <p className="text-lg font-bold text-gray-900">{fullName}</p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-10">
          {/* LEFT COLUMN */}
          <div className="space-y-7">
            {/* О себе */}
            {about && (
              <div>
                <p className="text-sm font-black text-gray-800 mb-1">О себе</p>
                <p className="text-sm text-gray-600 leading-relaxed">{about}</p>
              </div>
            )}

            {/* Образование */}
            {educations.map((edu) => (
              <div key={edu.id} className="space-y-2">
                <div>
                  <p className="text-sm font-black text-gray-800 mb-0.5">Образование</p>
                  <p className="text-sm text-gray-600">{edu.level || '—'}</p>
                </div>
                {edu.institution && (
                  <div>
                    <p className="text-sm font-black text-gray-800 mb-0.5">Учебное заведение</p>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-black text-gray-800 mb-0.5">Месяц и год окончания</p>
                  <p className="text-sm text-gray-600">
                    {edu.isCurrent ? 'По настоящее время' : `${edu.monthEnd}, ${edu.yearEnd}`}
                  </p>
                </div>
              </div>
            ))}

            {/* Опыт работы */}
            {experiences.map((exp) => exp.position && (
              <div key={exp.id} className="space-y-2">
                <div>
                  <p className="text-sm font-black text-gray-800 mb-0.5">Позиция</p>
                  <p className="text-sm text-gray-600">{exp.position}</p>
                </div>
                {exp.workplace && (
                  <div>
                    <p className="text-sm font-black text-gray-800 mb-0.5">Место работы</p>
                    <p className="text-sm text-gray-600">{exp.workplace}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-black text-gray-800 mb-0.5">Период работы</p>
                  <p className="text-sm text-gray-600">
                    {`${exp.monthStart}, ${exp.yearStart} – `}
                    {exp.isCurrent ? 'По настоящее время' : `${exp.monthEnd}, ${exp.yearEnd}`}
                  </p>
                </div>
              </div>
            ))}

            {/* Навыки */}
            {skills.length > 0 && (
              <div>
                <p className="text-sm font-black text-gray-800 mb-2">Навыки</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {skills.map(s => (
                    <li key={s} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-5">
            {/* CV */}
            {cvName && (
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">CV</p>
                <a href="#" className="text-sm text-blue-600 hover:underline font-medium break-all">
                  {cvName}
                </a>
                <div className="border-b border-gray-100 mt-3" />
              </div>
            )}

            {/* Birth date */}
            {personal.birthDate && (
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Дата рождения</p>
                <p className="text-sm text-gray-800 font-medium">
                  {personal.birthDate.includes('-')
                    ? new Date(personal.birthDate).toLocaleDateString('ru-RU')
                    : personal.birthDate}
                </p>
              </div>
            )}

            {/* Country */}
            {personal.country && (
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Страна</p>
                <p className="text-sm text-gray-800 font-medium">{personal.country}</p>
              </div>
            )}

            {/* City */}
            {personal.city && (
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Город</p>
                <p className="text-sm text-gray-800 font-medium">{personal.city}</p>
              </div>
            )}

            {/* Address */}
            {personal.address && (
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Адрес</p>
                <p className="text-sm text-gray-800 font-medium">{personal.address}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Электронная почта</p>
              <p className="text-sm text-gray-800 font-medium">{personal.email}</p>
            </div>

            {/* Phone */}
            {personal.phone && (
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Телефон</p>
                <p className="text-sm text-gray-800 font-medium">{personal.phone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===========================
  // EDIT MODE (tabs)
  // ===========================
  return (
    <div className="max-w-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Мой профиль</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {['personal', 'professional'].map((tab) => (
          <button
            key={tab}
            className={`pb-3 mr-6 text-sm font-bold border-b-2 transition-colors ${
              activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'personal' ? 'Личная информация' : 'Профессиональные навыки'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        {/* ======= PERSONAL ======= */}
        {activeTab === 'personal' && (
          <div className="space-y-5">
            {/* Photo */}
            <div>
              <label className={lbl}>Фото профиля</label>
              <div className="flex items-center space-x-4">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center relative cursor-pointer flex-shrink-0 group"
                  onClick={() => photoInputRef.current?.click()}
                >
                  {photo ? (
                    <img src={photo} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-blue-600">{initials}</span>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-colors"
                  >
                    Выберите файл
                  </button>
                  <p className="text-xs text-gray-400 mt-1">{photo ? 'Фото загружено ✓' : 'Файл не выбран'}</p>
                </div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            <div>
              <label className={lbl}>Имя {req}</label>
              <input type="text" name="firstName" value={personal.firstName} onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })} className={inputCls} placeholder="Маэрим" />
            </div>
            <div>
              <label className={lbl}>Фамилия {req}</label>
              <input type="text" name="lastName" value={personal.lastName} onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })} className={inputCls} placeholder="Тынчтыкова" />
            </div>
            <div>
              <label className={lbl}>Дата рождения {req}</label>
              <input type="date" name="birthDate" value={personal.birthDate} onChange={(e) => setPersonal({ ...personal, birthDate: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={lbl}>Страна {req}</label>
              <select name="country" value={personal.country} onChange={(e) => setPersonal({ ...personal, country: e.target.value })} className={selectCls}>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Город {req}</label>
              <input type="text" value={personal.city} onChange={(e) => setPersonal({ ...personal, city: e.target.value })} className={inputCls} placeholder="Бишкек" />
            </div>
            <div>
              <label className={lbl}>Адрес</label>
              <textarea value={personal.address} onChange={(e) => setPersonal({ ...personal, address: e.target.value })} rows={2} className={inputCls} placeholder="Например: ул. Тунгуч 49" />
            </div>
            <div>
              <label className={lbl}>Телефон {req}</label>
              <input type="text" value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} className={inputCls} placeholder="+996 (554) 30-67-50" />
            </div>
            <div>
              <label className={lbl}>Электронная почта {req}</label>
              <input type="email" value={personal.email} readOnly className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium bg-gray-100 text-gray-500 cursor-not-allowed outline-none" />
            </div>
          </div>
        )}

        {/* ======= PROFESSIONAL ======= */}
        {activeTab === 'professional' && (
          <div className="space-y-8">
            {/* О себе */}
            <div>
              <label className={lbl}>О себе</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                placeholder="Например: я являюсь частью профессиональных веб-интерфейсов..."
                className={inputCls}
              />
            </div>

            {/* Образование */}
            {educations.map((edu, idx) => (
              <div key={edu.id} className="space-y-4">
                <div>
                  <label className={lbl}>Образование</label>
                  <select value={edu.level} onChange={(e) => updateEdu(edu.id, 'level', e.target.value)} className={selectCls}>
                    {EDUCATION_LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lbl}>Учебное заведение</label>
                  <input type="text" value={edu.institution} onChange={(e) => updateEdu(edu.id, 'institution', e.target.value)} className={inputCls} placeholder="Кыргызско-Германский институт прикладной информатики" />
                </div>
                <div>
                  <label className={lbl}>Месяц и год окончания</label>
                  <div className="flex space-x-2">
                    <select value={edu.monthEnd} onChange={(e) => updateEdu(edu.id, 'monthEnd', e.target.value)} disabled={edu.isCurrent} className={`flex-1 px-3 py-2.5 border rounded-xl text-sm font-medium outline-none ${edu.isCurrent ? 'bg-gray-50 border-gray-200 text-gray-400' : 'bg-white border-gray-300 focus:border-blue-500'}`}>
                      {MONTHS.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <select value={edu.yearEnd} onChange={(e) => updateEdu(edu.id, 'yearEnd', e.target.value)} disabled={edu.isCurrent} className={`flex-1 px-3 py-2.5 border rounded-xl text-sm font-medium outline-none ${edu.isCurrent ? 'bg-gray-50 border-gray-200 text-gray-400' : 'bg-white border-gray-300 focus:border-blue-500'}`}>
                      {YEARS.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                  <label className="flex items-center mt-2 space-x-2 cursor-pointer text-sm text-gray-500">
                    <input type="checkbox" checked={edu.isCurrent} onChange={(e) => updateEdu(edu.id, 'isCurrent', e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" />
                    <span>По настоящее время</span>
                  </label>
                </div>
                <div className="flex justify-between">
                  {educations.length > 1 && (
                    <button type="button" onClick={() => removeEdu(edu.id)} className="text-red-500 text-sm font-semibold hover:underline flex items-center space-x-1">
                      <Trash2 className="w-3.5 h-3.5" /><span>Удалить образование</span>
                    </button>
                  )}
                  {idx === educations.length - 1 && (
                    <button type="button" onClick={addEdu} className="text-blue-600 text-sm font-semibold hover:underline flex items-center space-x-1 ml-auto">
                      <Plus className="w-3.5 h-3.5" /><span>Добавить ещё одно образование</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="border-t border-gray-100" />

            {/* Опыт работы */}
            {experiences.map((exp, idx) => (
              <div key={exp.id} className="space-y-4">
                <div>
                  <label className={lbl}>Позиция {req}</label>
                  <select value={exp.position} onChange={(e) => updateExp(exp.id, 'position', e.target.value)} className={selectCls}>
                    <option value="">— Выберите —</option>
                    {POSITIONS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lbl}>Место работы</label>
                  <input type="text" value={exp.workplace} onChange={(e) => updateExp(exp.id, 'workplace', e.target.value)} className={inputCls} placeholder="Fortylines IO" />
                </div>
                <div>
                  <label className={lbl}>Период работы</label>
                  <div className="flex items-center space-x-2 text-sm">
                    <select value={exp.monthStart} onChange={(e) => updateExp(exp.id, 'monthStart', e.target.value)} className="flex-1 px-2 py-2.5 border border-gray-300 rounded-xl text-sm font-medium outline-none bg-white focus:border-blue-500">
                      {MONTHS.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <select value={exp.yearStart} onChange={(e) => updateExp(exp.id, 'yearStart', e.target.value)} className="flex-1 px-2 py-2.5 border border-gray-300 rounded-xl text-sm font-medium outline-none bg-white focus:border-blue-500">
                      {YEARS.map(y => <option key={y}>{y}</option>)}
                    </select>
                    <span className="text-gray-400 font-medium">по</span>
                    <select value={exp.monthEnd} onChange={(e) => updateExp(exp.id, 'monthEnd', e.target.value)} disabled={exp.isCurrent} className={`flex-1 px-2 py-2.5 border rounded-xl text-sm font-medium outline-none ${exp.isCurrent ? 'bg-gray-50 border-gray-200 text-gray-400' : 'bg-white border-gray-300 focus:border-blue-500'}`}>
                      {MONTHS.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <select value={exp.yearEnd} onChange={(e) => updateExp(exp.id, 'yearEnd', e.target.value)} disabled={exp.isCurrent} className={`flex-1 px-2 py-2.5 border rounded-xl text-sm font-medium outline-none ${exp.isCurrent ? 'bg-gray-50 border-gray-200 text-gray-400' : 'bg-white border-gray-300 focus:border-blue-500'}`}>
                      {YEARS.map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                  <label className="flex items-center mt-2 space-x-2 cursor-pointer text-sm text-gray-500">
                    <input type="checkbox" checked={exp.isCurrent} onChange={(e) => updateExp(exp.id, 'isCurrent', e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" />
                    <span>По настоящее время</span>
                  </label>
                </div>
                <div className="flex justify-between">
                  {experiences.length > 1 && (
                    <button type="button" onClick={() => removeExp(exp.id)} className="text-red-500 text-sm font-semibold hover:underline flex items-center space-x-1">
                      <Trash2 className="w-3.5 h-3.5" /><span>Удалить текущую профессию</span>
                    </button>
                  )}
                  {idx === experiences.length - 1 && (
                    <button type="button" onClick={addExp} className="text-blue-600 text-sm font-semibold hover:underline flex items-center space-x-1 ml-auto">
                      <Plus className="w-3.5 h-3.5" /><span>Добавить ещё одну профессию</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="border-t border-gray-100" />

            {/* Навыки */}
            <div>
              <label className={lbl}>Навыки</label>
              <div className="border border-gray-300 rounded-xl p-3 min-h-[90px] bg-white flex flex-wrap gap-2 items-start">
                {skills.map(skill => (
                  <span key={skill} className="flex items-center space-x-1 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                    <span>{skill}</span>
                    <button type="button" onClick={() => removeSkill(skill)} className="text-gray-400 hover:text-red-500 ml-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  placeholder="Добавить навык и нажать Enter..."
                  className="border-0 outline-none bg-transparent text-sm font-medium text-gray-700 placeholder-gray-400 min-w-[180px] flex-1"
                />
              </div>
              <button type="button" onClick={addSkill} className="text-blue-600 text-sm font-semibold hover:underline flex items-center space-x-1 mt-2">
                <Plus className="w-3.5 h-3.5" /><span>Добавить навык</span>
              </button>
            </div>

            {/* CV Upload */}
            <div>
              <label className={lbl}>Загрузить файл (CV)</label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => cvInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 transition-colors"
                >
                  Выберите файл
                </button>
                <span className="text-sm text-gray-500 font-medium">{cvName || 'Файл не выбран'}</span>
                <input ref={cvInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCvChange} />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 mt-8">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20">
            Сохранить
          </button>
          <button type="button" onClick={handleCancel} className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-3 rounded-xl text-sm font-bold transition-all">
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
