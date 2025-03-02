import { useContext, useEffect, useState } from "react";
import FileUploadModal from "../components/home/FileUploadModal";
import { AuthContext } from "../provider/AuthProvider";
import Loader from "../components/ui/Loader/Loader";
import useAxiosPublic from "../hooks/useAxiosPublic";
import FileCard from "../components/home/FileCard";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const axiosPublic = useAxiosPublic();
  // const { user, loading, setLoading } = useContext(AuthContext);

  useEffect(() => {
    axiosPublic
      .get("/link/get-all-link")
      .then((res) => {
        setLinks(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="relative">
      {/* loader */}
      {loading && (
        <div className="absolute top-1/2 left-1/2 z-50">
          <Loader />
        </div>
      )}
      {/* main section */}
      <div className="grid grid-cols-3 gap-6">
        {links.map((link) => (
          <FileCard key={link._id} link={link} />
        ))}
      </div>

      <FileUploadModal setLoading={setLoading} />
    </div>
  );
};

export default Home;
