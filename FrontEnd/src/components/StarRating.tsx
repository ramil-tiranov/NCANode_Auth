import React from 'react';
import axios from 'axios';

interface StarRatingProps {
  rating: number | null;
  onRatingChange: (newRating: number) => void;
  email?: string; // email заменяет itemId
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, email }) => {
  
  // Функция для отправки обновленного рейтинга в API
  const updateRating = async (email: string, newRating: number) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${email}`, {
        rating: newRating,
      });
      console.log('Рейтинг обновлен успешно!');
    } catch (error) {
      console.error('Ошибка при обновлении рейтинга в API:', error);
    }
  };

  // Обработчик клика по звезде
  const handleStarClick = (starValue: number) => {
    onRatingChange(starValue);
    
    // Обновление рейтинга через API, если есть email
    if (email) {
      updateRating(email, starValue);
    } else {
      console.warn('Email не указан, рейтинг не будет отправлен в API');
    }
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= (rating || 0) ? 'star filled' : 'star'}
          onClick={() => handleStarClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;