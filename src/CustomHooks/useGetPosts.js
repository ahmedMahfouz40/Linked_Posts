// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";
// import headerObject from "../TemplateLogic/headerObject";

// function useGet(queryKey, endPoint, isEnabled) {
//   const getPosts = () =>
//     axios.get(`https://route-posts.routemisr.com/${endPoint}`, headerObject);
//   const { data, isError, isFetched, isLoading, isFetching } = useQuery({
//     queryKey: [...queryKey],
//     queryFn: getPosts,
//     enabled: isEnabled,
//     refetchOnWindowFocus: false,
//     staleTime: 1000 * 60 * 5,
//     keepPreviousData: true,
//   });
//   return { data, isError, isFetched, isLoading, isFetching };
// }

// export default useGet;

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import getHeaderObject from "../TemplateLogic/headerObject";

function useGet(queryKey, endPoint, isEnabled, staleTime = " 1000 * 60 * 5") {
  const getPosts = () =>
    axios.get(
      `https://route-posts.routemisr.com/${endPoint}`,
      getHeaderObject(), // ✅ called as a function, reads fresh token every time
    );

  const { data, isError, isFetched, isLoading, isFetching } = useQuery({
    queryKey: [...queryKey],
    queryFn: getPosts,
    enabled: isEnabled,
    refetchOnWindowFocus: false,
    staleTime: { staleTime },
    keepPreviousData: true,
  });

  return { data, isError, isFetched, isLoading, isFetching };
}

export default useGet;
