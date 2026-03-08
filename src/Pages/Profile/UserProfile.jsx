import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import useGet from "../../CustomHooks/useGetPosts";
import PostCard from "../../Components/Posts/PostCard";
import ProfileCover from "./ProfileCover";
import LoadingSkeleton from "../../Components/LoadingSkeleton/LoadingSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import useToggleFollow from "../../CustomHooks/useToggleFollow";
import AuthContext from "../../AuthContext/authContext";
import ShowImage from "../../Components/ShowImage";
import { Helmet } from "react-helmet-async";

const UserProfile = () => {
  const navigate = useNavigate();
  const { profileData } = useContext(AuthContext);

  // ! Get User Data
  const { id } = useParams("id");
  const { data: userData } = useGet(["userData", id], `users/${id}/profile`);
  const UserInfo = userData?.data.data.user;
  useEffect(() => {
    if (UserInfo?.name) {
      document.title = `${UserInfo.name} Profile | Route Posts`;
    }
  }, [UserInfo?.name]);
  //   !Get Posts
  const { data: userPosts, isLoading: isPosting } = useGet(
    ["userPosts", UserInfo?._id],
    `users/${UserInfo?._id}/posts`,
  );
  const posts = userPosts?.data?.data.posts;
  //   ! Toggle Follow
  const following = UserInfo?.followers?.some(
    (follower) => follower._id === profileData._id,
  );
  const { mutate, isPending } = useToggleFollow();
  const [isFollowing, setIsFollowing] = useState(following);
  // ? show user image
  const [showImageViewer, setShowImageViewer] = useState(false);
  return (
    <>
      <Helmet>
        <title>{UserInfo?.name || "User Profile"} | Route Posts</title>
      </Helmet>
      <div className="mx-auto max-w-7xl px-3 py-3.5 mt-20">
        <div className="min-w-0">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/feed");
              }
            }}
            class="inline-flex  m-5 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
          <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="h-48 bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)]"></div>
            <div class="relative -mt-14 px-3 pb-5 sm:px-5">
              <div class="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-white/70 bg-white/95 p-4">
                <div class="flex items-end gap-3">
                  <img
                    onClick={() => setShowImageViewer(true)}
                    alt={UserInfo?.name}
                    className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-blue-100"
                    src={UserInfo?.photo}
                  />
                  <div>
                    <p class="text-xl font-black text-slate-900 sm:text-2xl">
                      {UserInfo?.name}
                    </p>
                    <p class="text-sm font-semibold text-slate-500 sm:text-base">
                      {UserInfo?.email || "loading_email@example.com"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    mutate(UserInfo?._id);
                    setIsFollowing(!isFollowing);
                  }}
                  type="button"
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-extrabold transition sm:w-auto ${isPending && "cursor-not-allowed"} ${isFollowing ? " border border-slate-300 bg-white text-slate-700 hover:bg-slate-100" : "bg-[#1877f2] text-white hover:bg-[#166fe5]"} cursor-pointer`}
                >
                  {isFollowing ? (
                    <>
                      {isPending ? (
                        "Loading... "
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faCheck} />
                          Following
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {isPending ? (
                        "Loading..."
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faUserPlus} />
                          Follow
                        </>
                      )}
                    </>
                  )}{" "}
                </button>
              </div>
            </div>
          </section>
          <div className="my-5">
            {isPosting ? (
              <LoadingSkeleton />
            ) : (
              <>
                {posts?.map((post) => (
                  <PostCard post={post} key={post._id} />
                ))}
              </>
            )}
          </div>
        </div>
        <ShowImage
          showImageViewer={showImageViewer}
          setShowImageViewer={setShowImageViewer}
          Info={{
            photo: UserInfo?.photo,
            name: UserInfo?.name,
          }}
        />
      </div>
    </>
  );
};

export default UserProfile;
