import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPaperPlane,
  faSmile,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useForm } from "react-hook-form";
import headerObject from "../../TemplateLogic/headerObject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AuthContext from "../../AuthContext/authContext";

const CreateComment = ({ post }) => {
  const { profileData } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({
    content: "",
    image: null,
  });
  function createComment(values) {
    const formData = new FormData();
    if (values.content) formData.append("content", values.content);
    if (values.image[0]) formData.append("image", values.image[0]);

    return axios.post(
      `https://route-posts.routemisr.com/posts/${post._id}/comments`,
      formData,
      headerObject,
    );
  }
  const { mutate: creatCommentFn, isPending } = useMutation({
    mutationFn: createComment,
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries(["postComments", post._id]);
      reset();
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });
  return (
    <>
      <div className="mt-3 px-2">
        <div className="flex items-start gap-2">
          <img
            src={profileData?.photo}
            alt={profileData?.name}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div
            className="w-full rounded-2xl border border-slate-200 bg-[#f0f2f5] px-2.5 py-1.5 focus-within:border-[#c7dafc] focus-within:bg-white"
            data-comment-mention-root="true"
          >
            <form onSubmit={handleSubmit(creatCommentFn)}>
              <textarea
                {...register("content")}
                placeholder={`Comment as ${profileData?.name}`}
                rows={1}
                className="max-h-35 min-h-10 w-full resize-none bg-transparent px-2 py-1.5 text-sm leading-5 outline-none placeholder:text-slate-500"
              ></textarea>

              <div className="mt-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <label
                    htmlFor="image"
                    className="inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-emerald-600"
                  >
                    <FontAwesomeIcon icon={faImage} />
                    <input
                      {...register("image")}
                      type="file"
                      className="hidden"
                      id="image"
                    />
                  </label>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-amber-500"
                  >
                    <FontAwesomeIcon icon={faSmile} />
                  </button>
                </div>

                <button
                  type="submit"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:bg-[#9ec5ff] disabled:opacity-100"
                >
                  {isPending ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faPaperPlane} />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/*  */}
    </>
  );
};

export default CreateComment;
