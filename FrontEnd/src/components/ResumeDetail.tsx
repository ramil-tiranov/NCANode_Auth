// src/components/ResumeDetail.tsx
import React, { useState } from 'react';

interface ResumeDetailProps {
  resumeId: number;
}

const ResumeDetail: React.FC<ResumeDetailProps> = ({ resumeId }) => {
  const [rating, setRating] = useState(0);

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRating(Number(e.target.value));
  };

  const handleSubmitRating = () => {
    // Отправка оценки на сервер
    console.log(`Resume ID: ${resumeId}, Rating: ${rating}`);
  };

  return (
    <div>
      <h3>Оценка резюме</h3>
      <input type="number" value={rating} onChange={handleRatingChange} />
      <button onClick={handleSubmitRating}>Отправить оценку</button>
    </div>
  );
};

export default ResumeDetail;
