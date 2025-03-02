import { MdOutlinePublic } from "react-icons/md";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { IoLink } from "react-icons/io5";
import { toast } from "react-toastify";

const FileCard = ({ link }) => {
  return (
    <div
      key={link._id}
      className="bg-gray-200 p-4 rounded-md flex flex-col justify-center items-start gap-2 cursor-pointer hover:shadow-lg hover:bg-gray-100"
      onClick={() =>
        window.open(
          `https://drive.google.com/file/d/${link.fileLink}/view`,
          "_blank"
        )
      }
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(
            `https://drive.google.com/file/d/${link.fileLink}/view`
          );
          toast.success("Link copied to clipboard");
        }}
        className="self-end px-2 py-1 hover:bg-yellow-300 bg-yellow-200 rounded-md"
      >
        <IoLink className="text-2xl" />
      </div>
      <h3 className="text-xl font-semibold line-clamp-2">{link.fileName}</h3>
      <div className="badge badge-success">
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

export default FileCard;
