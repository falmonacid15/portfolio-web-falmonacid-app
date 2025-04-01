import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <h1>Mi App</h1>
      <ul>
        <li>
          <Link to="/admin">Panel de Admin</Link>
        </li>
        {/* {user ? (
          <li>
            <button onClick={logout}>Cerrar sesión</button>
          </li>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )} */}
      </ul>
    </nav>
  );
};

export default Navbar;
