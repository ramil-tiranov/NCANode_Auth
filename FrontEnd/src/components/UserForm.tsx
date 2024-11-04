
import React, { useState } from 'react';

interface ResumeData {
  firstName: string;
  lastName: string;
  age: number;
  position: string;
  about: string;
}

const UserForm: React.FC = () => {
  const [formData, setFormData] = useState<ResumeData>({
    firstName: '',
    lastName: '',
    age: 0,
    position: '',
    about: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Отправка на сервер
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" placeholder="Имя" onChange={handleChange} />
      <input name="lastName" placeholder="Фамилия" onChange={handleChange} />
      <input name="age" placeholder="Возраст" type="number" onChange={handleChange} />
      <input name="position" placeholder="Должность" onChange={handleChange} />
      <textarea name="about" placeholder="О себе" onChange={handleChange} />
      <button type="submit">Отправить резюме</button>
    </form>
  );
};

export default UserForm;
