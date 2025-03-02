import React, { useContext } from "react";
import { FaLink } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="navbar bg-indigo-300 text-yellow-100 shadow-sm px-8">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl">ShareLink</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end flex gap-x-4 items-center">
        <button
          onClick={() => {
            if (!user?.email) {
              navigate("/login");
            }
            document.getElementById("fileUploadModal").showModal();
          }}
          className="px-4 py-2 bg-yellow-200 rounded-xl text-lg text-gray-500 cursor-pointer hover:bg-yellow-300 flex gap-x-2 items-center"
        >
          <p>Create Link</p>
          <FaLink />
        </button>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-yellow-200 rounded-xl text-lg text-gray-500 cursor-pointer hover:bg-yellow-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Navbar;
