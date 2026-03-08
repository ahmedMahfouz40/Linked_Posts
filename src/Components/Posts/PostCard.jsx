import PostReactions from "./PostReactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import headerObject from "../../TemplateLogic/headerObject";
import { toast } from "react-toastify";
import DeleteModal from "../DeleteModal/DeleteModal";
import PostHeader from "./PostHeader";
import Comments from "../Comments/Comments";
import PostShared from "./PostShared";
import PostImage from "./PostImage";
import { useState } from "react";
import TopComment from "../Comments/TopComment";

const PostCard = ({ post, isDetails }) => {
  //* destructing data from post  =============
  const { image: postImage, id: postId } = post;
  //! handle delete post using mutation =======
  const queryClient = useQueryClient();
  const { mutate: deletePostFn } = useMutation({
    mutationFn: deletePost,
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["postDetails", postId]);
    },
    onError: () => toast.error("post Not deleted"),
  });
  function deletePost() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}`,
      headerObject(),
    );
  }
  const modalId = `delete_modal_${postId}`;
  const [clickComment, setClickComment] = useState(false);

  return (
    <>
      <DeleteModal modalId={modalId} onConfirm={() => deletePostFn()} />
      <div className="bg-white shadow-xl rounded-2xl  my-5">
        {/* Post Header & TextContent */}
        <PostHeader post={post} />
        {/* Post Content */}
        {post?.isShare && <PostShared post={post} />}
        <PostImage postImage={postImage} />
        {/* Post Reactions */}
        <PostReactions
          post={post}
          isDetails={isDetails}
          setClickComment={setClickComment}
          clickComment={clickComment}
        />
        {/* Post Comments */}
        {}
        {clickComment ? (
          <Comments post={post} />
        ) : (
          post?.topComment && (
            <TopComment
              setClickComment={setClickComment}
              clickComment={clickComment}
              comments={post.topComment}
            />
          )
        )}
      </div>
    </>
  );
};

export default PostCard;
