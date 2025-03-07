import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  isLoading = false,
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      data-testid="button"
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        isLoading ? "cursor-not-allowed opacity-50" : ""
      } ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
      )}
      {children}
    </button>
  );
};

export default Button;
