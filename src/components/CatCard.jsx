import React, { useState, useRef, useEffect } from 'react';

const CatCard = ({ cat, zIndex, onSwipe, isActive }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isActive]);

  const handleTouchStart = (e) => {
    if (!isActive) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setStartPos({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !isActive) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    
    setPosition({ x: deltaX, y: deltaY });

    const rotate = deltaX * 0.1;
    if (cardRef.current) {
      cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotate}deg)`;
    }

    const opacity = 1 - Math.abs(deltaX) / 300;
    if (cardRef.current) {
      cardRef.current.style.opacity = Math.max(opacity, 0.5);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isActive) return;

    const threshold = 100;
    if (Math.abs(position.x) > threshold) {
      onSwipe(position.x > 0 ? 'right' : 'left');
    } else {
      setPosition({ x: 0, y: 0 });
      if (cardRef.current) {
        cardRef.current.style.transform = 'translate(0, 0) rotate(0deg)';
        cardRef.current.style.opacity = '1';
      }
    }
    
    setIsDragging(false);
  };

  return (
    <div
      ref={cardRef}
      className={`cat-card ${isDragging ? 'dragging' : ''}`}
      style={{
        zIndex,
        transform: `translate(${position.x}px, ${position.y}px) rotate(${position.x * 0.1}deg)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease'
      }}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img 
        src={cat.url} 
        alt={cat.tags.join(', ')}
        loading="lazy"
      />
      
      {cat.tags.length > 0 && (
        <div className="tags">
          {cat.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}
      
      <div className={`indicator like-indicator ${position.x > 50 ? 'visible' : ''}`}>
        LIKE ♥
      </div>
      <div className={`indicator dislike-indicator ${position.x < -50 ? 'visible' : ''}`}>
        PASS ✕
      </div>
    </div>
  );
};

export default CatCard;