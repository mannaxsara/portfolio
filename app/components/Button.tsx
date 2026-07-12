import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "px-3 py-1 text-sm",
  md: "px-5 py-2",
  lg: "px-7 py-3 text-lg",
};

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  href,
  size = "md",
  className = "",
}) => {
  const commonClasses = `relative font-jersey uppercase tracking-wide
    bg-light-pink border-4 border-rosewood text-plum-brown
    shadow-[4px_4px_0px_#412722] 
    hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#412722] 
    active:translate-x-2 active:translate-y-2 active:shadow-none
    transition-transform duration-100 inline-block text-center select-none cursor-pointer ${sizeClasses[size]}
    ${className}`;

  if (href) {
    return (
      <a href={href} onClick={onClick} className={commonClasses}>
        {text}
        {/* Pixel sparkles */}
        <span className="absolute top-1 left-1 w-1 h-1 bg-[#AE5969]"></span>
        <span className="absolute bottom-1 right-2 w-1 h-1 bg-[#634A45]"></span>
      </a>
    );
  }

  return (
    <button onClick={onClick} className={commonClasses}>
      {text}
      {/* Pixel sparkles */}
      <span className="absolute top-1 left-1 w-1 h-1 bg-[#AE5969]"></span>
      <span className="absolute bottom-1 right-2 w-1 h-1 bg-[#634A45]"></span>
    </button>
  );
};

export default Button;