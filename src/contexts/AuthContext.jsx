import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      // Load photo from separate key (avoids exceeding localStorage limits on currentUser key)
      const photo = localStorage.getItem(`photo_${parsed.id}`);
      setCurrentUser({ ...parsed, photo: photo || parsed.photo || null });
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login - in a real app, verify with backend
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // Hardcoded Admin
    if (email === 'admin@gmail.com' && password === 'admin') {
      const adminUser = { id: 'admin', email: 'admin@gmail.com', role: 'admin', name: 'Системный администратор' };
      setCurrentUser(adminUser);
      sessionStorage.setItem('currentUser', JSON.stringify(adminUser));
      return { success: true };
    }

    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Don't store password in session state
      const { password, ...sessionUser } = user;
      setCurrentUser(sessionUser);
      sessionStorage.setItem('currentUser', JSON.stringify(sessionUser));
      return { success: true };
    }
    return { success: false, error: 'Неверные данные для входа' };
  };

  const register = (email, password, role, firstName, lastName, companyName) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // Note: plain text only for mock!
      role,
      name: role === 'employer' ? companyName : `${firstName} ${lastName}`.trim(),
      firstName: role === 'jobseeker' ? firstName : undefined,
      lastName: role === 'jobseeker' ? lastName : undefined,
      companyName: role === 'employer' ? companyName : undefined,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    const { password: pwd, ...sessionUser } = newUser;
    setCurrentUser(sessionUser);
    sessionStorage.setItem('currentUser', JSON.stringify(sessionUser));
    
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  const updateProfile = (updatedData) => {
    if (!currentUser) return;
    
    // If photo is being updated, store it separately (base64 can be large)
    if (updatedData.photo) {
      localStorage.setItem(`photo_${currentUser.id}`, updatedData.photo);
    }

    // Update current user (keep photo in state but not in main JSON)
    const newUserState = { ...currentUser, ...updatedData };
    setCurrentUser(newUserState);
    
    // Store without photo to avoid bloating localStorage
    const { photo, ...userWithoutPhoto } = newUserState;
    sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPhoto));
    
    // Update in users database (without photo)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const { photo: _p, ...updateWithoutPhoto } = updatedData;
    const mapUsers = users.map(u => u.id === currentUser.id ? { ...u, ...updateWithoutPhoto } : u);
    localStorage.setItem('users', JSON.stringify(mapUsers));
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
