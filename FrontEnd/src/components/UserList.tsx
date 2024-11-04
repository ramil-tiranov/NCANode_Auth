import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Интерфейс для пользователя
interface User {
  email: string;
  phone: string; // Измените на string, если вы хотите хранить телефон в формате строки
  password: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Используем тип User[]

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data); // Сохраняем полученные данные в состояние
      } catch (error) {
        console.error('Ошибка получения пользователей:', error);
      }
    };

    fetchUsers(); // Вызываем функцию для получения пользователей
  }, []);

  return (
    <div>
      <h1>Список пользователей</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.email} - {user.phone} - {user.password}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
