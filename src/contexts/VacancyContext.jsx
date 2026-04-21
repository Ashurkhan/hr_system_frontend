import React, { createContext, useState, useEffect, useContext } from 'react';

const VacancyContext = createContext();

export function useVacancy() {
  return useContext(VacancyContext);
}

// Mock initial data if empty
const INITIAL_VACANCIES = [
  {
    id: "1",
    position: "Менеджер по продажам",
    employmentType: "Полная занятость",
    salary: "50 000 Сом",
    experience: "От 1 года до 3 лет",
    applicationsCount: 7,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: "Открыто",
    company: "FortyLines IO",
    city: "Бишкек",
    country: "Кыргызстан",
    category: "Информационные технологии",
    phone: "+996 (__)__-__-__",
    aboutCompany: "FortyLines IO — это компания, занимающаяся разработкой программного обеспечения. Мы являемся частью IT-рынка, специализируясь на разработке мобильных приложений и сложных систем в Fintech, HRtech и других пользовательских интерфейсах, я занимаюсь исследованиями UX, используя Google Material Design и принцип KISS.",
    description: "FortyLines IO ищет молодых специалистов в IT-платформу для набора удобных и информативных решений. Основная задача — развитие платформы Account Хения продукта.",
    requirements: [
      "Знание русского языка",
      "Нужно разбираться в продукции IT",
      "Приветствуется знание Base Kotlin и Java с CSS",
      "Стрессоустойчивость, есть опыт работы в комплексных Б2Б Ком",
      "Способен брать руку на ОС или иных систем и данных",
      "Ответственность",
      "Честность",
      "Тим-менеджмент",
      "Базовое знание и использование пакета лист на русском языке"
    ],
    contacts: [
      "Адрес: ул. Горького 1/1 09:00-18:00",
      "Адрес: ул. Ленина 10/1",
      "Тел: +996 558 56750"
    ],
    additionalInfo: [
      "Гибкость офисов",
      "Тел. заявления в ВК Телеграм, 5 дней",
      "График: 5/9 09:00-18:00"
    ],
    relatedVacancies: [
      { title: "Мен. по продажам у Fortylnes Business", salary: "60 000 Сом", type: "Полная" },
      { title: "Мен. по продажам у Fortylnes Business", salary: "60 000 Сом", type: "Полная" }
    ]
  },
  {
    id: "2",
    position: "Junior Backend разработчик",
    employmentType: "Полная занятость",
    salary: "33 100 - 50 000 Сом",
    experience: "От 1 года до 3 лет",
    applicationsCount: 10,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    status: "Открыто",
    company: "CodeRyLite",
    city: "Бишкек",
    country: "Кыргызстан",
    category: "Разработка",
    phone: "+996 (500) 123-456",
    aboutCompany: "CodeRyLite — быстроразвивающаяся компания в сфере разработки программного обеспечения. Мы создаём масштабируемые и надёжные бэкенд-системы для наших клиентов по всему миру.",
    description: "Ищем Junior Backend разработчика для работы над нашими продуктами. Вы будете работать в команде опытных разработчиков и участвовать в разработке API и микросервисов.",
    requirements: [
      "Знание Python или Node.js",
      "Базовые знания баз данных SQL/PostgreSQL",
      "Понимание REST API",
      "Желание обучаться и развиваться"
    ],
    contacts: [
      "Адрес: ул. Манаса 45",
      "Email: hr@coderylife.kg"
    ],
    additionalInfo: [
      "Удалённый формат работы",
      "Гибкий график",
      "Обучение за счёт компании"
    ],
    relatedVacancies: []
  },
  {
    id: "3",
    position: "Бизнес Аналитик отдела IT",
    employmentType: "Временная занятость",
    salary: "33 000 Сом",
    experience: "От 3 года до 6 лет",
    applicationsCount: 20,
    createdAt: new Date(Date.now() - 864000000).toISOString(),
    status: "Открыто",
    company: "Элвис",
    city: "Бишкек",
    country: "Кыргызстан",
    category: "Аналитика",
    phone: "+996 (777) 555-222",
    aboutCompany: "Элвис — ведущая компания в сфере бизнес-аналитики и управленческого консалтинга в Центральной Азии.",
    description: "Ищем опытного бизнес-аналитика для работы в IT-отделе. Основная задача — анализ бизнес-процессов и внедрение IT-решений.",
    requirements: [
      "Опыт работы в IT от 3 лет",
      "Знание UML, BPMN",
      "Навыки работы с ТЗ",
      "Английский язык (Intermediate)"
    ],
    contacts: [
      "Адрес: пр. Чуй 100",
      "Тел: +996 777 555222"
    ],
    additionalInfo: [
      "Официальное трудоустройство",
      "ДМС",
      "Корпоративное питание"
    ],
    relatedVacancies: []
  },
  {
    id: "4",
    position: "Менеджер по логистике",
    employmentType: "Полная занятость",
    salary: "33 000 Сом",
    experience: "От 1 года до 3 лет",
    applicationsCount: 3,
    createdAt: new Date(Date.now() - 1200000000).toISOString(),
    status: "Открыто",
    company: "Мегапак",
    city: "Ош",
    country: "Кыргызстан",
    category: "Логистика",
    phone: "+996 (312) 600-123",
    aboutCompany: "Мегапак — один из крупнейших логистических операторов страны.",
    description: "Требуется менеджер по логистике для координации поставок и работы со складом.",
    requirements: [
      "Опыт в логистике от 1 года",
      "Знание склада и цепочек поставок",
      "Водительские права категории B"
    ],
    contacts: [
      "Адрес: ул. Курманжан Датки 80, г. Ош",
      "Тел: +996 312 600123"
    ],
    additionalInfo: [
      "5-дневная рабочая неделя",
      "Официальное трудоустройство"
    ],
    relatedVacancies: []
  }
];

// Increment this version number whenever INITIAL_VACANCIES data structure changes
const DATA_VERSION = 'v3';

export function VacancyProvider({ children }) {
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    const storedVersion = localStorage.getItem('vacancies_version');
    const stored = localStorage.getItem('vacancies');

    // Reset if no data OR data version is outdated (missing rich fields)
    if (!stored || storedVersion !== DATA_VERSION) {
      setVacancies(INITIAL_VACANCIES);
      localStorage.setItem('vacancies', JSON.stringify(INITIAL_VACANCIES));
      localStorage.setItem('vacancies_version', DATA_VERSION);
    } else {
      setVacancies(JSON.parse(stored));
    }
  }, []);

  const createVacancy = (vacancyData) => {
    const newVacancy = {
      ...vacancyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      applicationsCount: 0,
      status: 'Открыто'
    };
    
    const updated = [newVacancy, ...vacancies];
    setVacancies(updated);
    localStorage.setItem('vacancies', JSON.stringify(updated));
    return newVacancy;
  };

  const updateVacancy = (id, updatedData) => {
    const updated = vacancies.map(v => v.id === id ? { ...v, ...updatedData } : v);
    setVacancies(updated);
    localStorage.setItem('vacancies', JSON.stringify(updated));
  };

  const deleteVacancy = (id) => {
    const updated = vacancies.filter(v => v.id !== id);
    setVacancies(updated);
    localStorage.setItem('vacancies', JSON.stringify(updated));
  };
  
  const getVacancy = (id) => {
    return vacancies.find(v => v.id === id);
  };

  const value = {
    vacancies,
    createVacancy,
    updateVacancy,
    deleteVacancy,
    getVacancy
  };

  return (
    <VacancyContext.Provider value={value}>
      {children}
    </VacancyContext.Provider>
  );
}
