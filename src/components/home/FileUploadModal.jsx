import { useContext, useEffect, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { AuthContext } from "../../provider/AuthProvider";
import { useForm } from "react-hook-form";
import { FaLink } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const FileUploadModal = ({ setLoading, setRefetch }) => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //random taskId
  const linkId = Math.floor(Math.random() * 10000);

  const onSubmit = async (data) => {
    setLoading(true);

    const file = { file: data.file[0] };
    const expirationHours = data.expiration ? parseInt(data.expiration) : null;
    const expirationTime =
      expirationHours !== null
        ? new Date(Date.now() + expirationHours * 60 * 60 * 1000)
        : null;

    await axiosPublic
      .post("/upload/upload-file", file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          const link = [
            {
              privacy: data.privacy,
              fileLink: res.data.file.id,
              fileName: res.data.file.name,
              user: user.email,
              linkId,
              createdAt: new Date().toISOString(),
              expiresAt: expirationTime ? expirationTime.toISOString() : null,
            },
          ];

          Promise.all([
            axiosPublic.post("/link/add-link", {
              privacy: data.privacy,
              fileLink: res.data.file.id,
              fileName: res.data.file.name,
              user: user.email,
              linkId,
              createdAt: new Date().toISOString(),
              expiresAt: expirationTime ? expirationTime.toISOString() : null,
            }),
            axiosPublic.post(`/user/post-link/${user?.email}`, { link }),
          ]).then((responses) => {
            if (
              responses.every((response) => response.data.acknowledged === true)
            ) {
              toast.success("File uploaded successfully");
              document.getElementById("fileUploadModal").close();
              setRefetch((prev) => !prev);
              setLoading(false);
              reset();
            }
          });
        }
        setLoading(false);
        reset();
      });
  };

  //   const onSubmit = async (data) => {
  //     setLoading(true);

  //     const file = { file: data.file[0] };
  //     await axiosPublic
  //       .post("/upload/upload-file", file, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       })
  //       .then((res) => {
  //         if (res.data.success) {
  //           const link = [
  //             {
  //               privacy: data.privacy,
  //               fileLink: res.data.file.id,
  //               fileName: res.data.file.name,
  //               user: user.email,
  //               linkId,
  //             },
  //           ];
  //           Promise.all([
  //             axiosPublic.post("/link/add-link", {
  //               privacy: data.privacy,
  //               fileLink: res.data.file.id,
  //               fileName: res.data.file.name,
  //               user: user.email,
  //               linkId,
  //             }),
  //             axiosPublic.post(`/user/post-link/${user?.email}`, { link }),
  //           ]).then((responses) => {
  //             if (
  //               responses.every((response) => response.data.acknowledged === true)
  //             ) {
  //               toast.success("File uploaded successfully");
  //               document.getElementById("fileUploadModal").close();
  //               setRefetch((prev) => !prev);
  //               setLoading(false);
  //               reset();
  //             }
  //           });
  //         }
  //         setLoading(false);
  //         reset();
  //       });
  //   };
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

          <div className="relative mb-8">
            <label className="block mb-2 font-medium">
              Expiration Time (in hours)
            </label>
            <input
              type="number"
              min="1"
              {...register("expiration", {
                min: {
                  value: 1,
                  message: "Expiration time must be at least 1 hour",
                },
              })}
              placeholder="Leave empty for no expiration"
              className="input w-[265px] max-w-xs bg-gray-200 p-2 rounded"
            />
            {errors.expiration && (
              <span className="text-red-500 absolute bottom-[-25px] left-0">
                {errors.expiration.message}
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
