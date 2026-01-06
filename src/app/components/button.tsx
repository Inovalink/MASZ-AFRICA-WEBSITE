import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  variant?: 'primary' | 'primaryWhite' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  className = '',
  type = 'button',
}) => {
  const variantClasses = {
    primary: 'button-primary-default text-white hover:bg-blue-600',
    primaryWhite: 'button-primary-default-light text-primary-default',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    outline: 'border border-gray-500 text-gray-500 hover:bg-gray-100',
  };

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-3 py-2 text-light',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
    group flex items-center justify-center gap-2 
    rounded-full font-medium text-sm-medium
    transition-all duration-300 uppercase
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
    ${className}
  `}
    >
      {label}
      {icon && (
        <span
          className="
        flex items-center justify-center transition-transform duration-700
        ease-[cubic-bezier(0.25,0.8,0.25,1)]
        group-hover:translate-x-1
        animate-[arrowFloat_1.5s_ease-in-out_infinite]
      "
        >
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;
