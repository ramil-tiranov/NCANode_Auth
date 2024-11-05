import React from 'react';

interface StarRatingProps {
  rating: number; // Рейтинг от 0 до 5
  onRatingChange?: (newRating: number) => void; // Опционально, для обработки изменения рейтинга
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starRating = index + 1; // Звезды от 1 до 5
    return (
      <span
        key={index}
        className={`star ${starRating <= rating ? 'filled' : ''}`}
        onClick={() => onRatingChange && onRatingChange(starRating)} // Вызов функции при клике
      >
        ★
      </span>
    );
  });

  return <div className="star-rating">{stars}</div>;
};

export default StarRating;
