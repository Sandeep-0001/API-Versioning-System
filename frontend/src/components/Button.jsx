import React from 'react';

const Button = ({ children, onClick, variant = 'primary', type = 'button', className = '' }) => {
  const baseStyles = "mt-1 rounded-xl px-6 py-3 font-semibold tracking-wide transition duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer";
  
  const variants = {
    primary: "bg-[color:var(--color-v1)] text-white",
    secondary: "bg-[color:var(--color-v2)] text-[color:var(--color-ink)]",
    outline: "bg-[color:var(--color-brand)] text-white"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;


