import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVacancy } from '../contexts/VacancyContext';
import { useAuth } from '../contexts/AuthContext';

export default function VacancyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createVacancy, updateVacancy, getVacancy } = useVacancy();
  const { currentUser } = useAuth();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    aboutCompany: '',
    position: '',
    industry: '',
    description: '',
    skills: '',
    salaryType: 'Фиксированная',
    salaryAmount: '',
    salaryCurrency: 'Сом',
    employmentType: '',
    experience: 'Не имеет значения',
    contactCountry: 'Кыргызстан',
    contactCity: 'Бишкек',
    contactAddress: '',
    additionalInfo: '',
  });
  const [isCustomPosition, setIsCustomPosition] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const vacancy = getVacancy(id);
      if (vacancy) {
        // Simple mapping, since our mock object doesn't perfectly align with all form fields
        setFormData(prev => ({
          ...prev,
          position: vacancy.position || '',
          employmentType: vacancy.employmentType || '',
          salaryAmount: vacancy.salary ? vacancy.salary.replace(/\D/g, '') : '',
          experience: vacancy.experience || 'Не имеет значения',
          description: vacancy.description || '',
          aboutCompany: vacancy.aboutCompany || '',
          industry: vacancy.industry || '',
          skills: vacancy.skills || '',
          contactAddress: vacancy.contactAddress || '',
          additionalInfo: vacancy.additionalInfo || '',
        }));
      }
    }
  }, [id, getVacancy, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleExperienceChange = (value) => {
    setFormData(prev => ({ ...prev, experience: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format salary string for the list view
    const formattedSalary = `${formData.salaryAmount} ${formData.salaryCurrency}`;
    
    // Parse skills/requirements from text to array (split by newlines or "-" bullets)
    const requirementsArray = formData.skills
      ? formData.skills.split(/\n/).map(s => s.replace(/^[-•\s]+/, '').trim()).filter(Boolean)
      : [];
    
    // Parse additionalInfo from text to array
    const additionalInfoArray = formData.additionalInfo
      ? formData.additionalInfo.split(/\n/).map(s => s.replace(/^[-•\s]+/, '').trim()).filter(Boolean)
      : [];

    // Build contacts array from form contact fields
    const contactsArray = [
      formData.contactAddress ? `Адрес: ${formData.contactAddress}, ${formData.contactCity}` : null,
    ].filter(Boolean);

    const payload = {
      ...formData,
      salary: formattedSalary,
      // Map form fields to the fields expected by the jobseeker dashboard
      company: currentUser?.companyName || currentUser?.name || 'Компания',
      employerId: currentUser?.id,
      country: formData.contactCountry,
      city: formData.contactCity,
      category: formData.industry,
      requirements: requirementsArray,
      contacts: contactsArray,
      additionalInfo: additionalInfoArray,
      relatedVacancies: [],
    };

    if (isEditing) {
      updateVacancy(id, payload);
    } else {
      createVacancy(payload);
    }
    
    navigate('/vacancies');
  };

  return (
    <div className="max-w-4xl mx-auto text-left">
      <h1 className="text-[28px] font-black tracking-tight text-gray-900 mb-8 mt-2">
        {isEditing ? 'Редактирование вакансии' : 'Добавление новой вакансии'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* About Company */}
        <div>
          <label className="block text-[15px] font-bold text-gray-900 mb-2">О компании <span className="text-red-500">*</span></label>
          <textarea
            name="aboutCompany"
            required
            value={formData.aboutCompany}
            onChange={handleChange}
            placeholder="Например: Fortylines - это молодая, современная команда..."
            className="w-full h-32 px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium placeholder-gray-400 resize-none shadow-sm"
          ></textarea>
        </div>

        {/* Position */}
        <div>
          <label className="block text-[15px] font-bold text-gray-900 mb-2">Позиция <span className="text-red-500">*</span></label>
          
          {!isCustomPosition ? (
            <select 
              name="position"
              required
              value={formData.position}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm appearance-none"
            >
              <option value="" disabled>- Выберите -</option>
              <option value="Административный ассистент">Административный ассистент</option>
              <option value="Бухгалтер">Бухгалтер</option>
              <option value="Веб-разработчик">Веб-разработчик</option>
              <option value="Главный бухгалтер">Главный бухгалтер</option>
              <option value="Дизайнер">Дизайнер</option>
              <option value="Контент-менеджер">Контент-менеджер</option>
            </select>
          ) : (
            <input
              type="text"
              name="position"
              required
              value={formData.position}
              onChange={handleChange}
              placeholder="Введите название позиции"
              className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium shadow-sm"
            />
          )}

          <div className="flex items-center space-x-2 mt-3 justify-end text-sm text-gray-600 font-medium">
             <input 
               type="checkbox" 
               id="customPosCheck"
               checked={isCustomPosition}
               onChange={(e) => {
                 setIsCustomPosition(e.target.checked);
                 if (!e.target.checked) setFormData(prev => ({ ...prev, position: '' }));
               }}
               className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer" 
             />
             <label htmlFor="customPosCheck" className="cursor-pointer">Нужная позиция отсутствует в списке</label>
          </div>
        </div>

        {/* Industry */}
        <div>
          <label className="block text-[15px] font-bold text-gray-900 mb-2">Отрасль <span className="text-red-500">*</span></label>
          <select 
            name="industry"
            required
            value={formData.industry}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm appearance-none"
          >
            <option value="" disabled>- Выберите -</option>
            <option value="Автомобильный бизнес">Автомобильный бизнес</option>
            <option value="Административный персонал">Административный персонал</option>
            <option value="Безопасность">Безопасность</option>
            <option value="Высший и средний менеджмент">Высший и средний менеджмент</option>
            <option value="Добыча сырья">Добыча сырья</option>
            <option value="Домашний обслуживающий персонал">Домашний обслуживающий персонал</option>
            <option value="Закупки">Закупки</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[15px] font-bold text-gray-900 mb-2">Описание к вакансии </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Например: Ищем человека, который желает развиваться..."
            className="w-full h-32 px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium placeholder-gray-400 resize-none shadow-sm"
          ></textarea>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-[15px] font-bold text-gray-900 mb-2">Требуемые навыки </label>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Например: - Уверенный пользователь ПК - Знание английского..."
            className="w-full h-32 px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium placeholder-gray-400 resize-none shadow-sm"
          ></textarea>
        </div>

        {/* Salary */}
        <div>
          <label className="block text-[15px] font-bold text-gray-900 mb-2">Оклад <span className="text-red-500">*</span></label>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <select 
              name="salaryType" 
              value={formData.salaryType}
              onChange={handleChange}
              className="flex-1 px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 font-medium shadow-sm appearance-none"
            >
              <option value="Фиксированная">Фиксированная</option>
              <option value="До оплаты">До оплаты</option>
            </select>
            <input 
              type="number" 
              name="salaryAmount"
              required
              value={formData.salaryAmount}
              onChange={handleChange}
              placeholder="50 000" 
              className="flex-1 px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 font-medium shadow-sm"
            />
            <select 
              name="salaryCurrency" 
              value={formData.salaryCurrency}
              onChange={handleChange}
              className="w-32 px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 font-medium shadow-sm appearance-none"
            >
              <option value="Сом">Сом</option>
              <option value="USD">USD</option>
              <option value="RUB">RUB</option>
            </select>
          </div>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-[15px] font-bold text-gray-900 mb-2">Вид занятости <span className="text-red-500">*</span></label>
          <select 
            name="employmentType"
            required
            value={formData.employmentType}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm appearance-none"
          >
            <option value="" disabled>- Выберите -</option>
            <option value="Полная занятость">Полная занятость</option>
            <option value="Частичная занятость">Частичная занятость</option>
            <option value="Временная занятость">Временная занятость</option>
            <option value="Стажировка">Стажировка</option>
            <option value="Волонтерство">Волонтерство</option>
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-[15px] font-bold text-gray-900 mb-4">Опыт работы / стаж <span className="text-red-500">*</span></label>
          <div className="space-y-3 font-semibold text-sm text-gray-700 ml-1">
            {[
              'Не имеет значения', 
              'Без опыта', 
              'От 1 года до 3 лет', 
              'От 3 лет до 6 лет', 
              'Более 6 лет'
            ].map(exp => (
              <label key={exp} className="flex items-center space-x-3 cursor-pointer group w-max">
                <input 
                  type="radio" 
                  name="experience" 
                  checked={formData.experience === exp}
                  onChange={() => handleExperienceChange(exp)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer" 
                />
                <span className="group-hover:text-gray-900 transition-colors">{exp}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <label className="block text-[15px] font-bold text-gray-900 mb-2">Контактная информация</label>
          <div className="space-y-3">
             <select 
               name="contactCountry"
               value={formData.contactCountry}
               onChange={handleChange}
               className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 font-medium text-gray-700 shadow-sm appearance-none"
             >
               <option value="Кыргызстан">Кыргызстан</option>
             </select>
             <select 
               name="contactCity"
               value={formData.contactCity}
               onChange={handleChange}
               className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 font-medium text-gray-700 shadow-sm appearance-none"
             >
               <option value="Бишкек">Бишкек</option>
               <option value="Ош">Ош</option>
             </select>
             <input 
                type="text" 
                name="contactAddress"
                value={formData.contactAddress}
                onChange={handleChange}
                placeholder="ул. Токтогула 112/1" 
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium placeholder-gray-400 shadow-sm"
              />
          </div>
        </div>

        {/* Additional Info */}
        <div className="pb-8">
          <label className="block text-[15px] font-bold text-gray-900 mb-2">Дополнительная информация </label>
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Например: Условия работы: График..."
            className="w-full h-32 px-5 py-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-all font-medium placeholder-gray-400 resize-none shadow-sm mb-8"
          ></textarea>

          <div className="flex justify-center space-x-6 items-center">
             <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-blue-500/30 transition-all">
               {isEditing ? 'Сохранить изменения' : 'Разместить вакансию'}
             </button>
             <button 
               type="button" 
               onClick={() => navigate(-1)}
               className="bg-white border text-gray-500 hover:text-gray-800 border-gray-200 hover:border-gray-300 px-8 py-3.5 rounded-full text-sm font-bold transition-all"
             >
               Отмена
             </button>
          </div>
        </div>
      </form>
    </div>
  );
}
