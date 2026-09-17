interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export default function Button({onClick, children}) {
  return(
    <button onClick={onClick}>
      {children}
    </button>
  );
}
