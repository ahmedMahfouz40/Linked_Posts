import {
  faCheck,
  faDotCircle,
  faMessage,
  faThumbsUp,
  faShare,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import timeAgoShort from "../../TemplateLogic/timeAgo";
import { Link, useNavigate } from "react-router-dom";

const NotificationItem = ({ notification, markAsRedFn, isPending }) => {
  const [isReadLocal, setIsReadLocal] = useState(notification?.isRead);

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    console.log("button clicked", notification._id);
    if (!isReadLocal) {
      markAsRedFn(notification._id);
      setIsReadLocal(true);
    }
  };

  // Determine icon based on type
  const getIcon = (type) => {
    switch (type) {
      case "like_post":
        return faThumbsUp;
      case "comment_post":
        return faMessage;
      case "share_post":
        return faShare;
      case "follow_user":
        return faUserPlus;
      default:
        return faDotCircle;
    }
  };
  const navigate = useNavigate();
  const handleCardClick = () => {
    // if (event.target !== event.currentTarget) return;

    if (!isReadLocal) {
      markAsRedFn(notification._id);
      setIsReadLocal(true);
    }
    navigate(`/PostDetails/${notification.entityId}`);
  };
  console.log(notification);

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`group my-5 relative flex gap-3 rounded-xl border p-3 transition sm:rounded-2xl sm:p-4 border-[#dbeafe] ${
          isReadLocal ? "bg-white" : "bg-[#edf4ff]"
        }`}
      >
        {/* Actor photo + type icon */}
        <div className="relative shrink-0">
          <Link
            to={`/profile/${notification?.actor?._id}`}
            className="hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={notification?.actor?.photo}
              alt={notification?.actor?.name}
              className="h-11 w-11 rounded-full object-cover"
            />
          </Link>

          <span className="absolute -bottom-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white ring-2 ring-white text-[#1877f2]">
            <FontAwesomeIcon icon={getIcon(notification?.type)} />
          </span>
        </div>

        {/* Content */}
        <div className="flex justify-between w-full items-center">
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-6 text-slate-800">
              <Link
                to={`/profile/${notification?.actor?._id}`}
                className="hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="font-extrabold">
                  {notification?.actor?.name}
                </span>
              </Link>
              {notification?.type === "follow_user"
                ? "Started Following You"
                : notification?.type === "comment_post"
                  ? "Commented on Your Post"
                  : notification?.type === "share_post"
                    ? "Shared Your Post"
                    : notification?.type === "like_post"
                      ? "Liked Your Post"
                      : ""}
            </p>

            <p className="mt-0.5 text-sm text-slate-600">
              {notification?.entity.body}
            </p>

            <div className="mt-2 flex items-center gap-2">
              <button
                disabled={isPending || isReadLocal}
                onClick={handleMarkAsRead}
                className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#1877f2] ring-1 ring-[#dbeafe] transition hover:bg-[#e7f3ff] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FontAwesomeIcon icon={faCheck} />
                {isReadLocal ? "Read" : "Mark as read"}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-semibold text-slate-500">
              {timeAgoShort(notification?.createdAt)}
            </span>

            <FontAwesomeIcon icon={faDotCircle} className="text-[#1877f2]" />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationItem;
