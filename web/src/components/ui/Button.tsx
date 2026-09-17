interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export default function Button({onClick, children}: ButtonProps) {
  return(
    <button 
      onClick={onClick} 
      className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
    >
      {children}
    </button>
  );
}
