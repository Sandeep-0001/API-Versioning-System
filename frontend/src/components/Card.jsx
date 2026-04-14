import React from 'react';

const Card = ({ children, title, className = '' }) => {
  return (
    <div className={`rounded-2xl border border-[color:var(--color-border-soft)] bg-white/90 p-7 shadow-[0_10px_40px_rgba(16,25,40,0.08)] backdrop-blur ${className}`}>
      {title && <h3 className="mb-5 text-xl font-semibold text-[color:var(--color-ink)] sm:text-2xl">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;


