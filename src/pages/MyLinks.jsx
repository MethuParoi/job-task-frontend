import { useContext, useEffect, useState } from "react";
import FileUploadModal from "../components/home/FileUploadModal";
import { AuthContext } from "../provider/AuthProvider";
import Loader from "../components/ui/Loader/Loader";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useNavigate } from "react-router";
import MyLinksCard from "../components/my-links/MyLinksCard";

const MyLinks = () => {
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axiosPublic
      .get(`/user/get-link/${user?.email}`)
      .then((res) => {
        setLinks(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user?.email, refetch]);

  return (
    <div className="relative overflow-x-hidden">
      {/* loader */}
      {loading && (
        <div className="absolute top-1/2 left-1/2 z-50">
          <Loader />
        </div>
      )}

      {/* main section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-10">
        {links?.length === 0 && (
          <div className="flex justify-center items-center gap-x-2 mb-2 sm:col-span-2 md:col-span-3 lg:col-span-4">
            <h2 className="text-xl font-semibold text-indigo-400">
              No links found!
            </h2>
          </div>
        )}
        {links?.map((link) => (
          <MyLinksCard key={link._id} link={link} setRefetch={setRefetch} />
        ))}
      </div>

      <FileUploadModal setLoading={setLoading} setRefetch={setRefetch} />
    </div>
  );
};

export default MyLinks;
