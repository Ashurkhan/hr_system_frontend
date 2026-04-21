import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Briefcase, User, Shield } from 'lucide-react';

const FAQ_DATA = [
  {
    category: "Работодателям",
    icon: <Briefcase className="w-5 h-5 text-blue-600" />,
    items: [
      {
        q: "Как правильно составить описание вакансии?",
        a: "Старайтесь быть максимально подробными: укажите основные задачи, требования к опыту и технологиям, а также преимущества работы именно в вашей компании. Четкое описание привлекает более качественных кандидатов."
      },
      {
        q: "Как пригласить кандидата на собеседование?",
        a: "В разделе «Кандидаты» выберите подходящего специалиста, нажмите кнопку с тремя точками и выберите «Пригласить на собеседование». Вы сможете отправить персональное сообщение и прикрепить файл."
      },
      {
        q: "Что означают статусы заявок?",
        a: "«В рассмотрении» — вы еще не приняли решение. «Принято» — вы одобрили кандидата. «Приглашен на собеседование» — вы отправили официальное приглашение."
      }
    ]
  },
  {
    category: "Соискателям",
    icon: <User className="w-5 h-5 text-indigo-600" />,
    items: [
      {
        q: "Видят ли другие компании мой профиль?",
        a: "Ваш адрес электронной почты и подробные данные видят только те компании, на вакансии которых вы откликнулись. В остальное время информация скрыта."
      },
      {
        q: "Как обновить файл резюме?",
        a: "В личном кабинете перейдите в раздел «Моё резюме», там вы можете загрузить новый файл. Он будет автоматически прикрепляться ко всем вашим будущим откликам."
      },
      {
        q: "Через сколько ждать ответа от работодателя?",
        a: "Обычно это занимает от 3 до 7 рабочих дней. Если работодатель изменит статус вашей заявки, вы сразу получите уведомление в колокольчик в шапке сайта."
      }
    ]
  },
  {
    category: "Безопасность и аккаунт",
    icon: <Shield className="w-5 h-5 text-green-600" />,
    items: [
      {
        q: "Как восстановить забытый пароль?",
        a: "На странице входа нажмите «Забыли пароль?», введите свой Email, и мы отправим вам инструкции по восстановлению."
      },
      {
        q: "Как полностью удалить свой профиль?",
        a: "Перейдите в «Настройки» -> «Удаление профиля». Пожалуйста, помните, что это действие удалит все ваши вакансии и отклики без возможности восстановления."
      }
    ]
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
          <HelpCircle className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-[36px] font-black text-gray-900 tracking-tight">Часто задаваемые вопросы</h1>
        <p className="text-gray-500 mt-4 max-w-lg mx-auto font-medium">
          У вас возникли вопросы? Мы здесь, чтобы помочь. Если вы не нашли ответ ниже, свяжитесь с поддержкой.
        </p>
      </div>

      <div className="space-y-12">
        {FAQ_DATA.map((category, catIdx) => (
          <div key={catIdx} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${catIdx * 100}ms` }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gray-50 rounded-lg">
                {category.icon}
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">{category.category}</h2>
            </div>

            <div className="grid gap-4">
              {category.items.map((item, itemIdx) => {
                const isOpen = openItems[`${catIdx}-${itemIdx}`];
                return (
                  <div 
                    key={itemIdx} 
                    className={`bg-white border rounded-2xl transition-all duration-300 ${isOpen ? 'border-blue-200 shadow-lg shadow-blue-500/5' : 'border-gray-100 shadow-sm'}`}
                  >
                    <button 
                      onClick={() => toggleItem(catIdx, itemIdx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left group"
                    >
                      <span className={`font-bold transition-colors ${isOpen ? 'text-blue-600 text-[15px]' : 'text-gray-900 text-sm'} group-hover:text-blue-600`}>
                        {item.q}
                      </span>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-blue-500" /> : <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />}
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100 pb-5 px-6' : 'max-h-0 opacity-0'}`}>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {item.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
