import { Link } from "react-router-dom";
import useGet from "../../CustomHooks/useGetPosts";
import axios from "axios";
import headerObject from "../../TemplateLogic/headerObject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faShareNodes,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const PostReactions = ({ post, isDetails, setClickComment, clickComment }) => {
  const queryClient = useQueryClient();
  //?  get likes
  const { data: dataLikes } = useGet(
    ["postLike", post._id],
    `posts/${post._id}/likes?page=1&limit=20`,
    Boolean(post._id),
  );
  const likes = dataLikes?.data?.data?.likes || [];
  
  // ? like and unLike
  const toggleLike = () => {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}/like`,
      null,
      headerObject(),
    );
  };
  const {
    mutate,
    isPending,
    data: toggleLikeData,
  } = useMutation({
    mutationFn: toggleLike,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["postDetails", post._id]);
      queryClient.invalidateQueries(["postLike", post._id]);
      toast.success(res.data.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const postLiked = toggleLikeData?.data?.data.liked;

  // ? Share Post  ===============
  function sharePost() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${post._id}/share`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      },
    );
  }
  const { mutate: sharePostFn, isPending: isSharing } = useMutation({
    mutationFn: sharePost,
    onSuccess: (res) => {
      console.log(res?.data?.message);
      toast.success(res?.data?.message);
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    },
  });
  // ? click on the comment icon

  return (
    <div>
      {/* Stats Section */}
      <div className="px-4 pb-2 pt-3 text-sm text-slate-500">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1877f2] text-white">
              <FontAwesomeIcon icon={faThumbsUp} size="xs" />
            </span>

            <button className="font-semibold transition cursor-pointer hover:text-[#1877f2] hover:underline">
              {post?.likesCount} likes
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm">
            <span>{post.sharesCount} shares</span>
            <span>{post.commentsCount} comments</span>

            {!isDetails && (
              <Link
                to={`/PostDetails/${post._id}`}
                className="rounded-md px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff]"
              >
                View details
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mx-4 border-t border-slate-200"></div>

      {/* Reaction Buttons */}
      <div className="grid grid-cols-3 gap-1 p-1">
        {/* LIKE */}
        <button
          disabled={isPending}
          onClick={() => mutate()}
          className={` disabled:cursor-not-allowed flex cursor-pointer items-center justify-center gap-2 rounded-md p-2 text-xs font-semibold transition-colors sm:text-sm
            ${
              postLiked
                ? "bg-blue-100 text-blue-600"
                : "text-slate-600 hover:bg-slate-100"
            }
          `}
        >
          <FontAwesomeIcon icon={faThumbsUp} />
          <span>{isPending ? "Liking..." : "Like"}</span>
        </button>

        {/* COMMENT */}
        <button
          onClick={() => setClickComment(!clickComment)}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-md p-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 sm:text-sm"
        >
          <FontAwesomeIcon icon={faComment} />
          <span>Comment</span>
        </button>

        {/* SHARE */}
        <button
          disabled={isSharing}
          onClick={sharePostFn}
          className="flex cursor-pointer items-center disabled:cursor-not-allowed justify-center gap-2 rounded-md p-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 sm:text-sm"
        >
          <FontAwesomeIcon icon={faShareNodes} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default PostReactions;
