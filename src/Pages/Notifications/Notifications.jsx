import { useState } from "react";
import NotificationsHeader from "./NotificationsHeader";
import NotificationItem from "./NotificationItem";
import useGet from "../../CustomHooks/useGetPosts";
import axios from "axios";
import headerObject from "../../TemplateLogic/headerObject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthContext from "../../AuthContext/authContext";
import NotificationItemSkeleton from "../../Components/LoadingSkeleton/NotificationItemSkeleton";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const Notifications = () => {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("all");

  const { data: notificationsData, isLoading } = useGet(
    ["notifications"],
    `notifications?all=true&page=1&limit=20`,
    true,
    1000 * 60 * 60 * 24,
  );

  const notifications = notificationsData?.data.data.notifications;

  // Mutation to mark one notification as read
  const markAsRed = (id) =>
    axios.patch(
      `https://route-posts.routemisr.com/notifications/${id}/read`,
      {},
      headerObject(),
    );

  const { mutate: markAsRedFn, isPending } = useMutation({
    mutationFn: markAsRed,
    onSuccess: (res) => {
      console.log(res.data);
      queryClient.invalidateQueries(["notifications"]);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries(["notifications"]);
      const previousNotifications = queryClient.getQueryData(["notifications"]);

      // Optimistically update notification
      queryClient.setQueryData(["notifications"], (oldData) => ({
        ...oldData,
        data: {
          ...oldData.data,
          data: {
            // ✅ extra "data" level
            ...oldData.data.data,
            notifications: oldData.data.data.notifications.map((n) =>
              n._id === id ? { ...n, isRead: true } : n,
            ),
          },
        },
      }));

      return { previousNotifications };
    },

    onError: (err, context) => {
      queryClient.setQueryData(
        ["notifications"],
        context.previousNotifications,
      );
      toast.error(err.response.data.message);
    },
  });

  // Filter unread notifications for the Unread tab
  const unreadNotifications = notifications?.filter((n) => !n.isRead);

  return (
    <>
      <Helmet>
        <title>Notifications | Route Posts</title>
      </Helmet>
      <div className="p-1 bg-[#F0F2F5] sm:px-5 md:px-10 lg:px-20">
        <div className="bg-white my-20 rounded-2xl">
          <NotificationsHeader
            unreadCount={unreadNotifications?.length || 0}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="px-5">
            {isLoading ? (
              <NotificationItemSkeleton />
            ) : (
              <>
                {(activeTab === "all"
                  ? notifications
                  : unreadNotifications
                )?.map((item) => (
                  <NotificationItem
                    key={item._id}
                    notification={item}
                    markAsRedFn={markAsRedFn}
                    isPending={isPending}
                  />
                ))}
              </>
            )}
            {activeTab !== "all" && !unreadNotifications && (
              <>
                <div className="space-y-2 p-3 sm:p-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                    <p className="text-sm font-semibold text-slate-500">
                      No unread notifications yet.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
