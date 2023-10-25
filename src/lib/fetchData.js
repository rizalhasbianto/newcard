import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

export const useDataService = async (url, method, body = null) => {
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

export const useSwrData = (url, query) => {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const queryUrl = url + "?" + query;
  const { data, isLoading, isError } = useSWR(queryUrl, fetcher);

  return { data, isLoading, isError };
};

export const useSWRInfiniteData = (url, query) => {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const queryUrl = url + "?" + query;
  const { data, isLoading, isError, size, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.newData.pageInfo.hasNextPage) return null;
      if (pageIndex === 0) return queryUrl;
      return `${queryUrl}&lastCursor=${previousPageData.newData.pageInfo.endCursor}&pageIndex=${pageIndex}`;
    },
    fetcher
  );

  return { data, isLoading, isError, size, setSize };
};
