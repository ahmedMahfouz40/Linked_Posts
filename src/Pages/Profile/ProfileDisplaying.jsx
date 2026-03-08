import React, { useState } from "react";
import ToggleMyPosts_Saved from "./ToggleMyPosts_Saved";
import PostCard from "../../Components/Posts/PostCard";
import LoadingSkeleton from "../../Components/LoadingSkeleton/LoadingSkeleton";

const ProfileDisplaying = ({ posts, bookmarks, isSaving, isPosting }) => {
  const [toggleHeader, setToggle] = useState("myPosts");

  return (
    <div>
      <ToggleMyPosts_Saved
        setToggle={setToggle}
        toggleHeader={toggleHeader}
        postsCount={posts?.length}
        savedCount={bookmarks?.length}
      />
      {isSaving ||
        (isPosting ? (
          <LoadingSkeleton />
        ) : (
          <>
            {toggleHeader == "myPosts" && (
              <>
                {posts?.map((post) => (
                  <PostCard post={post} key={post._id} />
                ))}
              </>
            )}
            {toggleHeader == "saved" && (
              <>
                {bookmarks?.map((post) => (
                  <PostCard post={post} key={post._id} />
                ))}
              </>
            )}
          </>
        ))}
    </div>
  );
};

export default ProfileDisplaying;
