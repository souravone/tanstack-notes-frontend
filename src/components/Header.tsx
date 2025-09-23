import { Link } from "@tanstack/react-router";

function Header() {
  return (
    <header className="border-b-2 border-b-gray-800 px-8 py-4 bg-fuchsia-300">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <Link className="font-bold text-xl" to="/">
          MERN CRUD Notes
        </Link>
        <div className="font-semibold flex gap-4">
          <Link to="/loginPage">Login</Link>
          <Link to="/registerPage">Register</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
