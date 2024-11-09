import { Outlet, Link } from "react-router-dom";
import Visuals from './Visuals';
import Register from './Register';

const Layout = () => {
  return (
    <>
      {/* <h2>hey there</h2> */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/Register">Register</Link>
          </li>
          <li>
            <Link to="/Visuals">Visuals</Link>
          </li>
        </ul>
      </nav>
      <Outlet /> {/* Renders the matched child route */}
    </>
  )
};

export default Layout;