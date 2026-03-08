import { useNavigate, useParams } from "react-router-dom";
import useGet from "../../CustomHooks/useGetPosts";
import PostCard from "../../Components/Posts/PostCard";
import LoadingSkeleton from "../../Components/LoadingSkeleton/LoadingSkeleton";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGet(
    ["postDetails", id],
    `posts/${id}`,
    Boolean(id),
  );
  const post = data?.data?.data?.post;
  useEffect(() => {
    if (post?.body) {
      document.title = `${post.body || "Post Details"}  | Route Posts`;
    }
  }, [post?.body]);

  return (
    <>
      <Helmet>
        <title>{`${post?.body} `} | Route Posts</title>
      </Helmet>
      <div className="bg-[#F0F2F5]">
        <div className="w-[80%] mx-auto my-10">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/feed");
              }
            }}
            className="mt-5 cursor-pointer rounded-lg bg-white px-4 py-2 hover:bg-slate-200 transition"
          >
            ← Back
          </button>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <PostCard post={post} isDetails={true} />
          )}
        </div>
      </div>
    </>
  );
};

export default PostDetails;
