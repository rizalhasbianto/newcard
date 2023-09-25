import useSWR from "swr";

export const usePostData = async (url, method, body = null) => {
    try {
      // console.log(body);
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        ...(body && { body: JSON.stringify(body) }),
      });
      if (response.ok) {
        return await response.json();
      } else {
        console.log(response);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

export const useGetData = (url, query) => {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const queryUrl = url + "?" + query
  const {
    data,
    isLoading,
    isError,
  } = useSWR(
    queryUrl,
    fetcher
  );

  return { data, isLoading, isError };
}