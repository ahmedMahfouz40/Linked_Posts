import useGet from "../../CustomHooks/useGetPosts";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import PostCard from "./PostCard";

export default function Post() {
  const { data, isLoading } = useGet(["posts"], "posts", true);
  const posts = data?.data?.data.posts;

  return (
    <>
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {posts?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </>
      )}
    </>
  );
}
