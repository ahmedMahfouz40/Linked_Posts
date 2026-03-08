import { useState } from "react";

import ShowImage from "../ShowImage";

const PostImage = ({ postImage }) => {
  const [showImageViewer, setShowImageViewer] = useState(false);

  return (
    <div>
      <div className="max-h-120 overflow-hidden border-y border-slate-200">
        <button
          onClick={() => setShowImageViewer(true)}
          type="button"
          className="group relative block w-full cursor-pointer"
        >
          {postImage && (
            <img
              src={postImage}
              alt="post"
              className="w-150 mx-auto object-cover"
            />
          )}
          <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10"></span>
        </button>
      </div>

      <ShowImage
        showImageViewer={showImageViewer}
        setShowImageViewer={setShowImageViewer}
        Info={{
          photo: postImage,
        }}
      />
    </div>
  );
};

export default PostImage;
