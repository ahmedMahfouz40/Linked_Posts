import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import MainLayout from "./Components/Layouts/MainLayout/MainLayout";
import HomeLayout from "./Components/Layouts/HomeLayout/HomeLayout";
import FeedLayout from "./Components/Layouts/FeedLayout/FeedLayout";
import { ToastContainer } from "react-toastify";

import MyFeed from "./Components/MyFeed/MyFeed";
import MyPosts from "./Components/MyPosts/MyPosts";
import Post from "./Components/Posts/Post";
import Saved from "./Components/Saved/Saved";
import Notifications from "./Pages/Notifications/Notifications";
import PostDetails from "./Pages/PostDetails/PostDetails";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Profile from "./Pages/Profile/Profile";
import AuthContextProvider from "./AuthContext/AuthContextProvider";
import UserProfile from "./Pages/Profile/UserProfile";
import Settings from "./Pages/Settings/Settings";

function App() {
  const client = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <HomeLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "", element: <Navigate to="/feed/myFeed" replace /> },

        {
          path: "feed",
          element: (
            <ProtectedRoute>
              <FeedLayout />
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <Navigate to="myFeed" replace /> },
            { path: "myFeed", element: <MyFeed /> },
            { path: "myPosts", element: <MyPosts /> },
            { path: "community", element: <Post /> },
            { path: "saved", element: <Saved /> },
          ],
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile/:id",
          element: (
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "notifications",
          element: (
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          ),
        },
        {
          path: "/postDetails/:id",
          element: (
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "settings",
          element: (
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/auth",
      element: <MainLayout />,
      children: [
        { index: true, element: <Navigate to="login" replace /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
      ],
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);

  return (
    <QueryClientProvider client={client}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;
