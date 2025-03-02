import { useContext, useEffect, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContext } from "../../provider/AuthProvider";
import { useForm } from "react-hook-form";
import { FaLink } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const FileUploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //check if user exist or not
  //   useEffect(() => {
  //     if (!user?.email) {
  //       navigate("/login");
  //     }
  //   }, [user, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const file = { file: data.file[0] };
    await axiosPublic
      .post("/upload/upload-file", file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          axiosPublic
            .post("/link/add-link", {
              privacy: data.privacy,
              fileLink: res.data.file.id,
              user: user.email,
            })
            .then((res) => {
              if (res.data.success) {
                toast.success("File uploaded successfully");
                setIsLoading(false);
                reset();
              }
            });
        }
        setIsLoading(false);
        reset();
      });
  };
  return (
    <dialog id="fileUploadModal" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col items-center"
        >
          <h3 className="font-bold text-lg">
            Upload File to create sharable link
          </h3>
          <div className="relative mb-8 ">
            <label className="block mb-2 font-medium">Select File</label>
            <input
              {...register("file", {
                required: "File is required",
              })}
              type="file"
              className="file-input w-[265px] max-w-xs bg-gray-200"
            />
            {errors.file && (
              <span className="text-red-500 absolute bottom-[-25px] left-0">
                {errors.file.message}
              </span>
            )}
          </div>

          <div className="relative mb-8">
            <label className="block mb-2 font-medium">Privacy</label>
            <select
              {...register("privacy", {
                required: "Privacy selection is required",
              })}
              className="select-input w-[265px] max-w-xs bg-gray-200"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            {errors.privacy && (
              <span className="text-red-500 absolute bottom-[-25px] left-0">
                {errors.privacy.message}
              </span>
            )}
          </div>

          <div className="my-8">
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-200 rounded-xl text-lg text-gray-500 cursor-pointer hover:bg-yellow-300 flex gap-x-2 items-center"
            >
              <p>Create Link</p>
              <FaLink />
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default FileUploadModal;
