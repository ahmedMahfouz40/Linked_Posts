import { useContext } from "react";
import PostCard from "../Posts/PostCard";
import useGet from "../../CustomHooks/useGetPosts";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import AuthContext from "../../AuthContext/authContext";

const MyPosts = () => {
  const { profileData } = useContext(AuthContext);

  const { data, isLoading } = useGet(
    ["userPosts"],
    `users/${profileData?._id}/posts`,
  );

  const posts = data?.data?.data.posts;

  return (
    <>
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div>
          {posts?.map((post) => (
            <PostCard post={post} key={post._id} />
          ))}
        </div>
      )}
    </>
  );
};

export default MyPosts;
