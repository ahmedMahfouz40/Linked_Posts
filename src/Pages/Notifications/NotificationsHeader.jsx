// import { faCheck } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import axios from "axios";
// import getHeaderObject from "../../TemplateLogic/headerObject";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// const NotificationsHeader = ({ unreadCount }) => {
//   const queryClient = useQueryClient();
//   function markAllRead() {
//     return axios.patch(
//       "https://route-posts.routemisr.com/notifications/read-all",
//       null,
//       getHeaderObject(),
//     );
//   }
//   const { mutate, isPending } = useMutation({
//     mutationFn: markAllRead,
//     onSuccess: (res) => {
//       console.log(res.data);
//       queryClient.invalidateQueries(["notifications"]);
//     },
//     onError: (err) => {
//       console.log(err.response.data);
//     },
//   });
//   return (
//     <div>
//       <div className="border-b border-slate-200 p-4 sm:p-5">
//         <div className="flex flex-wrap items-start justify-between gap-3">
//           <div>
//             <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
//               Notifications
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Realtime updates for likes, comments, shares, and follows.
//             </p>
//           </div>
//           <button
//             disabled={isPending}
//             onClick={mutate}
//             className={`${unreadCount == 0 && "cursor-not-allowed opacity-60"}  inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto`}
//           >
//             <FontAwesomeIcon icon={faCheck} />
//             Mark all as read
//           </button>
//         </div>
//         <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:items-center">
//           <button
//             type="button"
//             className="rounded-full px-4 py-1.5 text-sm font-bold transition bg-[#1877f2] text-white"
//           >
//             All
//           </button>
//           <button
//             type="button"
//             className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold transition bg-slate-100 text-slate-700 hover:bg-slate-200"
//           >
//             Unread
//             <span className="rounded-full px-2 py-0.5 text-xs bg-white text-[#1877f2]">
//               {unreadCount}
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotificationsHeader;






import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import getHeaderObject from "../../TemplateLogic/headerObject";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NotificationsHeader = ({ unreadCount, activeTab, setActiveTab }) => {
  const queryClient = useQueryClient();

  function markAllRead() {
    return axios.patch(
      "https://route-posts.routemisr.com/notifications/read-all",
      null,
      getHeaderObject(),
    );
  }

  const { mutate, isPending } = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      // Optimistically mark all as read
      queryClient.setQueryData(["notifications"], (oldData) => ({
        ...oldData,
        data: {
          ...oldData.data,
          notifications: oldData.data.notifications.map(n => ({ ...n, isRead: true }))
        }
      }));
    },
  });

  return (
    <div>
      <div className="border-b border-slate-200 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 sm:text-2xl">Notifications</h2>
            <p className="mt-1 text-sm text-slate-500">
              Realtime updates for likes, comments, shares, and follows.
            </p>
          </div>
          <button
            disabled={unreadCount === 0 || isPending}
            onClick={mutate}
            className={`${unreadCount === 0 && "cursor-not-allowed opacity-60"} inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto`}
          >
            <FontAwesomeIcon icon={faCheck} />
            Mark all as read
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${activeTab === "all" ? "bg-[#1877f2] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("unread")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold transition ${activeTab === "unread" ? "bg-[#1877f2] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          >
            Unread
            <span className="rounded-full px-2 py-0.5 text-xs bg-white text-[#1877f2]">
              {unreadCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsHeader;