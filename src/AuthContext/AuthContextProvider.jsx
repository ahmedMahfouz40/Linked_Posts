// import React, { useState } from "react";
// import useGet from "../CustomHooks/useGetPosts";
// import Loading from "../Pages/Loading/Loading";
// import AuthContext from "./authContext";
// import { Navigate } from "react-router-dom";
// import { useQueryClient } from "@tanstack/react-query";
// const AuthContextProvider = ({ children }) => {
//   const [token, setToken] = useState(() => localStorage.getItem("token"));
//   // ? get Profile Data
//   const { data, isLoading } = useGet(
//     ["profileData", token],
//     "users/profile-data",
//     !!token,
//   );
//   const profileData = data?.data.data.user;
//   //? get Unred notification count
//   const { data: unred } = useGet(["unred"], `notifications/unread-count`, true);
//   console.log(unred);
//   const unreadCount = unred?.data.data.unreadCount;

//   function setUserToken(tkn) {
//     queryClient.removeQueries(["profileData"]);
//     queryClient.removeQueries(["unred"]);
//     setToken(tkn);
//     localStorage.setItem("token", tkn);
//   }
//   const queryClient = useQueryClient();
//   function logout() {
//     setToken(null);
//     localStorage.removeItem("token");
//     queryClient.clear();
//   }

//   return (
//     <>
//       {isLoading ? (
//         <Loading />
//       ) : (
//         <AuthContext.Provider
//           value={{
//             setUserToken,
//             token,
//             logout,
//             profileData,
//             unreadCount,
//           }}
//         >
//           {children}
//         </AuthContext.Provider>
//       )}
//     </>
//   );
// };

// export default AuthContextProvider;

import React, { useState } from "react";
import useGet from "../CustomHooks/useGetPosts";
import Loading from "../Pages/Loading/Loading";
import AuthContext from "./authContext";
import { Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null );
  const queryClient = useQueryClient();

  const { data, isLoading } = useGet(
    ["profileData", token],
    "users/profile-data",
    !!token,
  );
  const profileData = data?.data.data.user;

  const { data: unred } = useGet(["unred"], `notifications/unread-count`, true);
  const unreadCount = unred?.data.data.unreadCount;

  function setUserToken(tkn) {
    setToken(tkn);
    localStorage.setItem("token", tkn);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("token");
    queryClient.clear();
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <AuthContext.Provider
          value={{
            setUserToken,
            token,
            logout,
            profileData,
            unreadCount,
          }}
        >
          {children}
        </AuthContext.Provider>
      )}
    </>
  );
};

export default AuthContextProvider;
