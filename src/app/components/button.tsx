'use client';

import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

interface ButtonProps {
  label: string;
  href?: string;                // when provided, renders as <Link> (uses page transition)
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  variant?: 'primary' | 'primaryWhite' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  iconClassName?: string;
  alwaysExpanded?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  label,
  href,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  className,
  iconClassName,
  alwaysExpanded = false,
  type = 'button',
}) => {
  const baseClasses =
    'text-sm-medium group/btn relative overflow-hidden flex items-center justify-center rounded-full font-medium uppercase cursor-pointer transition-all duration-[700ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]';

  const variantClasses = {
    primary:
      'bg-[#016BF2] text-white hover:bg-blue-600 lg:border-2 lg:border-blue-600 lg:bg-transparent lg:hover:bg-blue-600',
    primaryWhite:
      'bg-white text-[#016BF2] border border-[#016BF2] hover:bg-[#f5f9ff]',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    outline: 'border border-gray-500 text-gray-500 hover:bg-gray-100',
  };

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-5 py-3 text-base',
    extraLarge:
      'px-4 py-3 lg:px-6 lg:py-6 text-base w-[160px] h-[60px] lg:w-[100px] lg:h-[100px]',
  };

  const combinedClassName = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    !alwaysExpanded && 'lg:w-[48px] lg:h-[48px] lg:px-0 lg:hover:w-auto lg:hover:px-6',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  const content = (
    <>
      <span
        className={clsx(
          'whitespace-nowrap transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]',
          !alwaysExpanded && 'lg:opacity-0 lg:max-w-0 lg:overflow-hidden',
          !alwaysExpanded && 'lg:group-hover/btn:opacity-100 lg:group-hover/btn:max-w-[200px]'
        )}
      >
        {label}
      </span>
      {icon && (
        <span
          className={clsx(
            'flex items-center justify-center transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]',
            'lg:text-[#016BF2] lg:p-2 lg:group-hover/btn:text-white lg:group-hover/btn:translate-x-1',
            'group-hover/btn:animate-[arrowFloat_1.5s_ease-in-out_infinite]',
            iconClassName
          )}
        >
          {icon}
        </span>
      )}
    </>
  );

  // Render as Next.js Link when href is provided — triggers page transition
  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        className={combinedClassName}
        aria-disabled={disabled}
      >
        {content}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button
      type={type}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      disabled={disabled}
      className={combinedClassName}
    >
      {content}
    </button>
  );
};

export default Button;