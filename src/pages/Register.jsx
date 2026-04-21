import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [role, setRole] = useState('jobseeker'); // 'jobseeker' or 'employer'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (role === 'jobseeker') {
      if (!firstName || !lastName || !email || !password) {
        setError('Пожалуйста, заполните все поля');
        return;
      }
    } else {
      if (!companyName || !email || !password) {
        setError('Пожалуйста, заполните все поля');
        return;
      }
    }

    const { success, error: authError } = register(email, password, role, firstName, lastName, companyName);
    if (success) {
      navigate(role === 'jobseeker' ? '/jobseeker' : '/vacancies');
    } else {
      setError(authError);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4fa] flex flex-col">
      {/* Simple Header for Auth Pages */}
      <header className="py-6 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center space-x-2 w-max">
          <div className="w-8 h-8 rounded bg-blue-500 transform rotate-45 flex items-center justify-center relative shadow-sm">
             <div className="w-4 h-4 rounded-sm bg-blue-200 absolute -top-1 -right-1" />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight ml-2">Border</span>
        </Link>
      </header>

      {/* Auth Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-[24px] shadow-xl shadow-gray-200/50 w-full max-w-md p-8 md:p-10 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Создайте аккаунт</h1>
          
          {/* Role Radio */}
          <div className="mb-6 text-left">
            <p className="text-sm font-bold text-gray-900 mb-3">Кто Вы?</p>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${role === 'jobseeker' ? 'border-blue-500' : 'border-gray-300'}`}>
                  {role === 'jobseeker' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                </div>
                <input type="radio" className="hidden" checked={role === 'jobseeker'} onChange={() => setRole('jobseeker')} />
                <span className="text-sm font-bold text-gray-700">Я соискатель</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${role === 'employer' ? 'border-blue-500' : 'border-gray-300'}`}>
                  {role === 'employer' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                </div>
                <input type="radio" className="hidden" checked={role === 'employer'} onChange={() => setRole('employer')} />
                <span className="text-sm font-bold text-gray-700">работодатель</span>
              </label>
            </div>
          </div>

          {error && <div className="mb-4 text-sm font-medium text-red-500 bg-red-50 p-3 rounded-xl">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'jobseeker' && (
              <>
                <div className="text-left">
                   <input 
                     type="text" 
                     placeholder="Имя" 
                     value={firstName}
                     onChange={(e) => setFirstName(e.target.value)}
                     className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-400"
                   />
                </div>
                <div className="text-left">
                   <input 
                     type="text" 
                     placeholder="Фамилия" 
                     value={lastName}
                     onChange={(e) => setLastName(e.target.value)}
                     className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-400"
                   />
                </div>
              </>
            )}

            {role === 'employer' && (
              <div className="text-left">
                 <input 
                   type="text" 
                   placeholder="Наименование компании" 
                   value={companyName}
                   onChange={(e) => setCompanyName(e.target.value)}
                   className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-400"
                 />
              </div>
            )}
            <div className="text-left">
               <input 
                 type="email" 
                 placeholder="Электронная почта" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-400"
               />
            </div>
            <div className="text-left relative">
               <input 
                 type={showPassword ? "text" : "password"} 
                 placeholder="Пароль" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-400 pr-12"
               />
               <button 
                 type="button" 
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                 onClick={() => setShowPassword(!showPassword)}
               >
                 {showPassword ? (
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                   </svg>
                 ) : (
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                   </svg>
                 )}
               </button>
            </div>
            
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-bold transition-colors shadow-md shadow-blue-500/20 mt-2">
              Создать аккаунт
            </button>
          </form>

          <p className="mt-8 text-sm text-gray-500 font-medium">
            Уже есть аккаунт? <Link to="/login" className="text-gray-900 font-bold hover:text-blue-600 transition-colors">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
