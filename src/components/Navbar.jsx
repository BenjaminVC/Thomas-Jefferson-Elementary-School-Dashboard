import { Link, useLocation } from "react-router-dom";
import logo from "../assets/thom-jeff-logo.png";
import "../styles/Navbar.css";

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { name: "Home", path: "/" },
    { name: "Classes", path: "/classes" },
    { name: "Teachers", path: "/teachers" },
    { name: "Students", path: "/students" },
    { name: "Calendar", path: "/calendar" },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </Link>

      <Link to="/">
        <span className="navbar-title">Thomas Jefferson Elementary</span>
      </Link>

      <ul className="navbar-links">
        {links.map((link) => (
          <li key={link.path} className={`nav-item ${currentPath === link.path ? "active" : ""}`}>
            <Link to={link.path}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
