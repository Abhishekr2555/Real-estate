import { defer } from "react-router-dom";
export const singlePageLoader = async ({ request, params }) => {
  try {
    const response = await fetch(
      "http://localhost:8800/api/post/" + params.id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  // const query = new URL(request.url).searchParams.toString();
  console.log(query);
  try {
    const response = await fetch(`http://localhost:8800/api/post?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const profilePageLoader = async () => {
  try {
    const postResponse = await fetch("http://localhost:8800/api/user/profilepost/", {
      method: 'GET',
      credentials: 'include',
    });

    if (!postResponse.ok) {
      throw new Error('Network response was not ok ' + postResponse.statusText);
    }

    const postData = await postResponse.json();

    // -----

    const chatResponse = await fetch("http://localhost:8800/api/chat/", {
      method: 'GET',
      credentials: 'include',
    });

    if (!chatResponse.ok) {
      throw new Error('Network response was not ok ' + chatResponse.statusText);
    }

    const chatData = await chatResponse.json();

    return {
      postResponse: postData,
      chatResponse:chatData
    };
  } catch (error) {
    console.error('Error loading profile page:', error);
    throw error;
  }
};
