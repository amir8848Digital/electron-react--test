import React from "react";
import { ToastContainer } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

type Props = {};

const Layout = (props: Props) => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <ul className="navbar-nav d-flex flex-row">
            <li className="nav-item border border-3 p-2 m-1">
              <Link className="nav-link" aria-current="page" to={"/"}>
                Sales Order Form
              </Link>
            </li>
            <li className="nav-item border border-3 p-2 m-1">
              <Link
                className="nav-link"
                aria-current="page"
                to={"/customer-form"}
              >
                Customer Form
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
