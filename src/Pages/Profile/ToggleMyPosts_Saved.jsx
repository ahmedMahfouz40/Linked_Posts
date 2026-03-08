import { faBookmark, faFileText } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ToggleMyPosts_Saved = ({
  setToggle,
  toggleHeader,
  savedCount,
  postsCount,
}) => {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5 sm:inline-flex sm:w-auto sm:gap-0">
          <button
            onClick={() => setToggle("myPosts")}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${toggleHeader === "myPosts" ? "bg-white text-[#1877f2] shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            <FontAwesomeIcon icon={faFileText} />
            My Posts
          </button>
          <button
            onClick={() => setToggle("saved")}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${toggleHeader === "saved" ? "bg-white text-[#1877f2] shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            <FontAwesomeIcon icon={faBookmark} />
            Saved
          </button>
        </div>
        <span className="rounded-full bg-[#e7f3ff] px-3 py-1 text-xs font-bold text-[#1877f2]">
          {toggleHeader == "myPosts" ? postsCount : savedCount}
        </span>
      </div>
    </div>
  );
};

export default ToggleMyPosts_Saved;
