import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import timeAgoShort from "../../TemplateLogic/timeAgo";
import { faEllipsis, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import headerObject from "../../TemplateLogic/headerObject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import AuthContext from "../../AuthContext/authContext";

const AllComments = ({ post, comments, likeCommentFn, isPending }) => {
  const { profileData } = useContext(AuthContext);

  const queryClient = useQueryClient();
  //? destructing data from comments and commentCreator
  const { content, createdAt, image } = comments || "";
  const { name, photo, username } = comments?.commentCreator || "";
  // ? handle show menu
  const commentCreatorId = comments.commentCreator._id;
  const profileUserId = profileData._id;
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // ! handle Delete Comment
  function deleteComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${post._id}/comments/${comments._id}`,
      headerObject(),
    );
  }
  const { mutate: deleteFn, isPending: isdeleting } = useMutation({
    mutationFn: deleteComment,
    onSuccess: (res) => {
      toast.success(res.data.message);
      setIsOpen(false);
      queryClient.invalidateQueries(["postComments", post._id]);
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });
  // ? handle update clicked
  const [clickUpdate, setClickUpdate] = useState(false);
  //  ! Hanle Update Comment
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      content: "",
      image: "",
    },
  });
  const handleUpdateComment = (values) => {
    const formData = new FormData();
    if (values?.content) formData.append("content", values.content);
    if (values?.image[0]) formData.append("image", values.image[0]);

    return axios.put(
      `https://route-posts.routemisr.com/posts/${post._id}/comments/${comments._id}`,
      formData,
      headerObject(),
    );
  };
  const { mutate: updateCommentFn } = useMutation({
    mutationFn: handleUpdateComment,
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries(["postComments", post._id]);
      setClickUpdate(false);
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });
  return (
    <>
      {/* Comment item */}
      <div className="space-y-2 my-4 px-2  flex justify-between relative">
        <div className="relative flex items-start gap-2 ">
          <img
            src={photo}
            className="mt-0.5 h-8 w-8 rounded-full object-cover"
            alt={name}
          />
          <div className="min-w-0 flex-1">
            <div className="relative inline-block max-w-full rounded-2xl bg-[#f0f2f5] px-3 py-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-500">
                    @{username} · {timeAgoShort(createdAt)}
                  </p>
                </div>
              </div>

              {clickUpdate ? (
                <>
                  <form
                    onSubmit={handleSubmit(updateCommentFn)}
                    className="mt-2 flex items-center gap-2"
                  >
                    <input
                      {...register("content")}
                      className="w-full rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm"
                    ></input>
                    <button
                      type="submit"
                      className="rounded-full bg-[#1877f2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#166fe5] disabled:opacity-60"
                    >
                      Save
                    </button>
                    <button className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100">
                      Cancel
                    </button>
                  </form>
                </>
              ) : (
                <>
                  {" "}
                  <div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
                      {content}
                    </p>
                    {image && (
                      <img
                        src={image}
                        className="mt-2 max-h-52 w-full rounded-lg object-cover"
                        alt="comment"
                      />
                    )}
                  </div>{" "}
                </>
              )}
            </div>
            <div className="mt-1.5 flex items-center justify-between px-1">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-400">
                  {timeAgoShort(createdAt)}
                </span>
                <button
                  disabled={isPending}
                  onClick={() => likeCommentFn(comments._id)}
                  className="text-xs font-semibold hover:underline disabled:opacity-60 text-slate-500 disabled:cursor-not-allowed"
                >
                  Like ({comments.likes.length})
                </button>
                <button className="text-xs font-semibold transition hover:underline disabled:opacity-60 text-slate-500 hover:text-[#1877f2]">
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
        {commentCreatorId === profileUserId && (
          <>
            <div ref={menuRef}>
              <span onClick={() => setIsOpen(!isOpen)}>
                {" "}
                <FontAwesomeIcon
                  icon={faEllipsis}
                  className="text-gray-600 cursor-pointer"
                />{" "}
              </span>
              <div
                className={`absolute  end-10 bg-white shadow rounded-xl border border-gray-300  flex flex-col  gap-2 text-sm ${!isOpen && "hidden"}`}
              >
                <button
                  onClick={() => {
                    setClickUpdate(true);
                    setValue("content", comments?.content);
                  }}
                  className="text-gray-600 cursor-pointer w-full text-start hover:bg-gray-200 py-2 px-3 rounded"
                >
                  <FontAwesomeIcon icon={faPen} /> Edit
                </button>
                <button
                  onClick={deleteFn}
                  className="text-red-600 cursor-pointer hover:bg-red-100 py-2 px-3 rounded"
                >
                  <FontAwesomeIcon icon={faTrash} />{" "}
                  {isdeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AllComments;
