import React, { useContext } from "react";
import { FaLink } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);

  const handleLogout = async () => {
    if (user) {
      try {
        await logoutUser();
        navigate("/");
      } catch (error) {
        console.error("Error logging out:", error.message);
      }
    }
  };

  return (
    <div className="navbar bg-indigo-300 text-yellow-100 shadow-sm px-8">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl">ShareLink</a>
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
        {user?.email ? (
          <button
            onClick={() => handleLogout()}
            className="px-4 py-2 bg-yellow-200 rounded-xl text-lg text-gray-500 cursor-pointer hover:bg-yellow-300"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-yellow-200 rounded-xl text-lg text-gray-500 cursor-pointer hover:bg-yellow-300"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
