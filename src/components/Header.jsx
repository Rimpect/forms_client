// Header.jsx
export default function Header() {
  return (
    <header className="border-2 border-red-500">
    <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
      <div>Header content</div>
      <div>LOGO</div>
      <button>Вход</button>
      <button>Регистрация</button>
    </div>
    </header>
  );
} 