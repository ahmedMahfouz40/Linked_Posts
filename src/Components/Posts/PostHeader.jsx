import React, { useContext, useRef, useState } from "react";
import timeAgoShort from "../../TemplateLogic/timeAgo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faEarth,
  faEllipsis,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import headerObject from "../../TemplateLogic/headerObject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AuthContext from "../../AuthContext/authContext";

const PostHeader = ({ post }) => {
  const { profileData } = useContext(AuthContext);

  const [showListPost, setShowListPost] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowListPost(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //* destructing data from post
  const { body: postText, createdAt: postDate, privacy, id: postId } = post;
  //* destructing data from creator
  const { name, photo: userImage } = post?.user || "";
  const modalId = `delete_modal_${postId}`;

  // ==================
  // ! handle update post
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      body: "",
      image: null,
    },
  });
  function updateForm(values) {
    const formData = new FormData();
    if (values?.body) formData.append("body", values.body);
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}`,
      formData,
      headerObject(),
    );
  }
  const { mutate } = useMutation({
    mutationFn: updateForm,
    onSuccess: (res) => {
      toast.success(res?.data?.message);

      queryClient.invalidateQueries(["posts"], postId);
      queryClient.invalidateQueries(["postDetails", postId]);
      setUpdatePost(false);
    },
    onError: (err) => toast.error(err.response.data.message),
  });
  // show form to update
  const [updatePostForm, setUpdatePost] = useState(false);

  // ! Bookmark/Unbookmark Post
  function bookmark() {
    return axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/bookmark`,
      null,
      headerObject(),
    );
  }
  const { mutate: bookmarkFn, isPending } = useMutation({
    mutationFn: bookmark,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["bookmarks"]);
      toast.success(res?.data?.message);
      setShowListPost(false);
    },
    onError: (error) => toast.error(error?.response?.message),
  });

  return (
    <div>
      <div className="postHeader  rounded-t-2xl border border-slate-200 bg-white  shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post?.user._id}`}>
              <img
                src={userImage}
                className="h-11 w-11 rounded-full object-cover"
                alt={name}
              />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1 text-sm">
                <Link
                  className="font-extrabold text-foreground hover:underline"
                  to={`/profile/${post?.user._id}`}
                >
                  {name}
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                {/* time from adding post  */}
                <button
                  type="button"
                  className="rounded px-0.5 py-0.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 hover:underline"
                >
                  {timeAgoShort(postDate)}
                </button>
                <span className="mx-1">·</span>
                <span className="inline-flex items-center gap-1">
                  <FontAwesomeIcon icon={faEarth} />
                  {privacy}
                </span>
              </div>
            </div>

            <>
              <div ref={menuRef} className="relative z-50">
                <button
                  onClick={() => setShowListPost(!showListPost)}
                  className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                >
                  <FontAwesomeIcon icon={faEllipsis} />
                </button>
                <div
                  className={`absolute ${!showListPost && "hidden"} right-5   z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg`}
                >
                  <button
                    onClick={bookmarkFn}
                    className=" flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {isPending && post.bookmarked ? (
                      "UnSaving..."
                    ) : isPending && !post.bookmark ? (
                      "Saving..."
                    ) : (
                      <>
                        {" "}
                        <FontAwesomeIcon icon={faBookmark} />
                        {post.bookmarked ? "Unsave" : "Save"}{" "}
                      </>
                    )}
                  </button>
                  {post?.user?._id === profileData?._id && (
                    <>
                      <button
                        onClick={() => {
                          setUpdatePost(true);
                          setShowListPost(false);
                          setValue("body", postText);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <FontAwesomeIcon icon={faPencil} />
                        Edit post
                      </button>
                      <label
                        htmlFor={modalId}
                        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        Delete post
                      </label>
                    </>
                  )}
                </div>
              </div>
            </>
          </div>
          <div className="mt-3">
            {!updatePostForm ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {postText}
              </p>
            ) : (
              <div className={`relative `}>
                <form onSubmit={handleSubmit(mutate)}>
                  <textarea
                    {...register("body")}
                    rows="4"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[17px] leading-relaxed text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"
                  ></textarea>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      className="btn btn-error"
                      onClick={() => setUpdatePost(false)}
                    >
                      Cancle
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
