import AllComments from "./AllComments";
import TopComment from "./TopComment";
import CreateComment from "./CreateComment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import headerObject from "../../TemplateLogic/headerObject";
import { toast } from "react-toastify";
import CommentHeader from "./CommentHeader";
import useGet from "../../CustomHooks/useGetPosts";
import CommentSkeleton from "../LoadingSkeleton/CommentSkeleton";
import NoComments from "./NoComments";

const Comments = ({ post }) => {
  //? get post comments using custom hook =====
  const { data, isLoading: commentFetching } = useGet(
    ["postComments", post._id],
    `posts/${post._id}/comments?page=1&limit=10`,
    Boolean(post._id),
  );
  const postComments = data?.data?.data?.comments;

  // ?========= comment like toggle  ============
  const queryClient = useQueryClient();
  function likeComment(commentId) {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}/comments/${commentId}/like`,
      null,
      headerObject(),
    );
  }
  const { mutate: likeCommentFn, isPending } = useMutation({
    mutationFn: likeComment,
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries(["postComments", post._id]);
    },
    onError: (err) => {
      console.log(err.response.data.message);
    },
  });

  return (
    <>
      <div className="py-2">
        <CommentHeader post={post} />
        {/* check if there are comments or not  */}
        {postComments?.length == 0 && <NoComments />}
        <>
          {/* show skeleton at fetching */}
          {commentFetching ? (
            <CommentSkeleton />
          ) : (
            <>
              {" "}
              {postComments?.map((comment) => (
                <AllComments
                  comments={comment}
                  post={post}
                  key={comment._id}
                  likeCommentFn={likeCommentFn}
                  isPending={isPending}
                />
              ))}
            </>
          )}
        </>

        <CreateComment post={post} />
      </div>
    </>
  );
};

export default Comments;
