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

    if (response.ok && response.status === 200) {
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

export const useSwrData = (url, query, runFetch=true) => {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const queryUrl = url + "?" + query;
  const { data, isLoading, isError, mutate, isValidating } = useSWR(runFetch ? queryUrl : null, fetcher);

  return { data, isLoading, isError, mutate, isValidating  };
};

export const useSWRInfiniteData = (url, query, runFetch=true) => {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const queryUrl = url + "?" + query;
  const { data, isLoading, isError, size, setSize } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if(!runFetch) return null;
      if (previousPageData && !previousPageData.newData.pageInfo.hasNextPage) return null;
      if (pageIndex === 0) return queryUrl;
      return `${queryUrl}&lastCursor=${previousPageData.newData.pageInfo.endCursor}&pageIndex=${pageIndex}`;
    },
    fetcher
  );

  return { data, isLoading, isError, size, setSize };
};
