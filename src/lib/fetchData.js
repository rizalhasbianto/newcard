export const fetchData = async (url, method, body = null) => {
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