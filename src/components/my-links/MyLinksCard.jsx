import { MdOutlinePublic } from "react-icons/md";
import { RiDeleteBinFill, RiGitRepositoryPrivateFill } from "react-icons/ri";
import { IoLink } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toast } from "react-toastify";
import { useState, useEffect, useRef, useContext } from "react";
import { FaEdit } from "react-icons/fa";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContext } from "../../provider/AuthProvider";

const MyLinksCard = ({ link, setRefetch }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const dropdownRef = useRef(null);
  const axiosPublic = useAxiosPublic();

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //handle delete
  const handleDelete = async () => {
    try {
      const responses = await Promise.all([
        axiosPublic.delete(`/user/delete-link/${user?.email}/${link?.linkId}`),
        axiosPublic.delete(`/link/delete-link/${link?.linkId}`),
      ]);

      if (responses.every((response) => response.data.acknowledged === true)) {
        toast.success("Link deleted successfully!");
        setRefetch((prev) => !prev);
      }
    } catch (error) {
      toast.error(`Error deleting task: ${error.message}`);
    }
  };

  return (
    <div
      key={link._id}
      className="bg-gray-200 p-4 rounded-md flex flex-col justify-center items-start gap-2 cursor-pointer hover:shadow-lg hover:bg-gray-100 relative"
      onClick={() =>
        window.open(
          `https://drive.google.com/file/d/${link.fileLink}/view`,
          "_blank"
        )
      }
    >
      <div className="self-end flex gap-x-2 items-center" ref={dropdownRef}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(
              `https://drive.google.com/file/d/${link.fileLink}/view`
            );
            toast.success("Link copied to clipboard");
          }}
          className="px-2 py-1 hover:bg-yellow-300 bg-yellow-200 rounded-md"
        >
          <IoLink className="text-2xl" />
        </div>
        <div
          onClick={toggleDropdown}
          className="px-1 py-1 hover:bg-yellow-300 bg-yellow-200 rounded-md"
        >
          <BsThreeDotsVertical className="text-2xl" />
        </div>
        {isDropdownOpen && (
          <ul
            onClick={(e) => e.stopPropagation()}
            className="dropdown menu w-20 rounded-box bg-base-100 shadow-sm absolute top-14 z-50"
          >
            <li>
              <button className="flex items-center justify-center">
                <FaEdit className="text-2xl text-indigo-400" />
              </button>
            </li>
            <li>
              <button
                onClick={handleDelete}
                className="flex items-center justify-center"
              >
                <RiDeleteBinFill className="text-2xl text-red-400" />
              </button>
            </li>
          </ul>
        )}
      </div>
      <h3 className="text-xl font-semibold line-clamp-2">{link.fileName}</h3>
      <div className="badge badge-success bg-indigo-300 border-transparent text-yellow-100 text-md font-semibold rounded-md">
        {link.privacy === "public" ? (
          <MdOutlinePublic />
        ) : (
          <RiGitRepositoryPrivateFill />
        )}

        {link.privacy}
      </div>
    </div>
  );
};

export default MyLinksCard;
