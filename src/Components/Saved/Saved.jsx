import React, { useContext } from "react";
import PostCard from "../Posts/PostCard";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import AuthContext from "../../AuthContext/authContext";
import useGet from "../../CustomHooks/useGetPosts";

const Saved = () => {
  const { profileData } = useContext(AuthContext);
  const { data: bookmarksData, isLoading: isSaving } = useGet(
    ["bookmarks"],
    "users/bookmarks",
    Boolean(profileData?._id),
  );
  const bookmarks = bookmarksData?.data?.data?.bookmarks;

  return (
    <>
      {isSaving ? (
        <LoadingSkeleton />
      ) : (
        <>
          {bookmarks?.length > 0 ? (
            <>
              {bookmarks?.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </>
          ) : (
            <>
              <div className="my-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                  No posts yet. Be the first one to publish.
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Saved;
