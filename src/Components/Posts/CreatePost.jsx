import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEarthAmericas,
  faImage,
  faPaperPlane,
  faSmile,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

import { useForm } from "react-hook-form";
import axios from "axios";
import headerObject from "../../TemplateLogic/headerObject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ProfileHeaderSkeleton from "../LoadingSkeleton/ProfileHeaderSkeleton";
import AuthContext from "../../AuthContext/authContext";

const CreatePost = () => {
  const { profileData } = useContext(AuthContext);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      body: "",
      image: null,
    },
  });
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: handleCreatePost,
    onSuccess: (res) => {
      console.log(res);
      toast.success(res?.data?.message);
      reset();
      queryClient.invalidateQueries(['posts'])
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
  function handleCreatePost(values) {
    const formData = new FormData();
    if (values?.body) formData.append("body", values.body);
    if (values?.image) formData.append("image", values.image[0]);

    return axios.post(
      "https://route-posts.routemisr.com/posts",
      formData,
      headerObject(),
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {!profileData ? (
          <ProfileHeaderSkeleton />
        ) : (
          <>
            {" "}
            <div className="mb-3 flex items-start gap-3">
              <img
                src={profileData?.photo}
                className="h-11 w-11 rounded-full object-cover"
                alt={profileData?.name}
              />
              <div className="flex-1">
                <p className="text-base font-extrabold text-slate-900">
                  {profileData?.name}
                </p>
                <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                  <FontAwesomeIcon icon={faEarthAmericas} />
                  <select className="bg-transparent outline-none">
                    <option value="public">Public</option>
                    <option value="following">Followers</option>
                    <option value="only_me">Only me</option>
                  </select>
                </div>
              </div>
            </div>{" "}
          </>
        )}
        <form action="" onSubmit={handleSubmit(mutate)}>
          <div className="relative">
            <textarea
              {...register("body")}
              rows="4"
              placeholder={`What's on your mind, ${name}?`}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[17px] leading-relaxed text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"
            ></textarea>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            <div className="relative flex items-center gap-2">
              <label
                htmlFor="postImage"
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <FontAwesomeIcon icon={faImage} className="text-teal-500" />{" "}
                Photo/Video
              </label>
              <input
                {...register("image")}
                type="file"
                name="image"
                id="postImage"
                className="hidden"
              />
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <FontAwesomeIcon icon={faSmile} className="text-amber-500" />

                <span className="hidden sm:inline">Feeling/activity</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-[#1877f2] px-5 py-2 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#166fe5] disabled:opacity-60"
              >
                {isPending ? (
                  <FontAwesomeIcon icon={faSpinner} spin size="2-xl" />
                ) : (
                  <>
                    Send <FontAwesomeIcon icon={faPaperPlane} />{" "}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
