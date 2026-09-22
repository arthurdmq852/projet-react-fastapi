import type { ReactNode } from "react";

export type ButtonVariant = "blue" | "white" | "transparent" | "blueInverted";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  blue: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 ",
  blueInverted: "bg-transparent border-2 hover:bg-gray-100 text-blue-600",
  white: "bg-white hover:bg-gray-100 active:bg-gray-200 text-black",
  transparent: "bg-transparent hover:bg-gray-100 active:bg-gray-200 text-black",
};

const baseStyles = "rounded-full px-4 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

export default function Button({
  children,
  variant = "blue",
  type = "button",
  onClick,
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
