import React from "react";
import useGet from "../../CustomHooks/useGetPosts";
import PostCard from "../Posts/PostCard";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";

const MyFeed = () => {
  const { data, isLoading } = useGet(
    ["homefeed"],
    "posts/feed?only=following&limit=10",
    Boolean(localStorage.getItem("token")),
  );
  const posts = data?.data?.data?.posts;
  return (
    <>
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {" "}
          {posts?.map((post) => (
            <PostCard post={post} key={post._id} />
          ))}
        </>
      )}
    </>
  );
};

export default MyFeed;
