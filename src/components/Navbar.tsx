import { Link, NavLink } from "react-router-dom";

const base = "px-3 py-2 rounded hover:bg-gray-100";
const cls = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${base} font-semibold` : base;

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="container-lg h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/devcodehub.svg" alt="DevCodeHub" className="w-8 h-8" />
          <span className="font-bold">DevCodeHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/curriculum" className={cls}>Curriculum</NavLink>
          <NavLink to="/forum" className={cls}>Forum</NavLink>
          <NavLink to="/news" className={cls}>News</NavLink>
        </nav>

        <Link to="/learn" className="btn-primary">Start learning</Link>
      </div>
    </header>
  );
}
