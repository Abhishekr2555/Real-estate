import { useContext, useEffect } from "react";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useLoaderData, Await } from "react-router-dom";
import { Suspense } from "react";

function ProfilePage() {
  const data = useLoaderData();
  console.log("Loader Data:", data);

  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8800/api/auth/logout", {
        credentials: 'include'
      });
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profilePage">
    <div className="details">
      <div className="wrapper">
        <div className="title">
          <h1>User Information</h1>
          <Link to="/profile/update">
            <button>Update Profile</button>
          </Link>
        </div>
        <div className="info">
          <span>
            Avatar:
            <img
              src={currentUser?.avatar || "/noavatar.png"}
              alt=""
            />
          </span>
          <span>
            Username: <b>{currentUser?.username}</b>
          </span>
          <span>
            E-mail: <b>{currentUser?.email}</b>
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="title">
          <h1>My List</h1>
          <Link to="/add">
            <button>Create New Post</button>
          </Link>
        </div>
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={data?.postResponse}
            errorElement={<p>Error loading posts!</p>}
          >
            {(postResponse) => {
              console.log("Post Response:", postResponse);
              return (
                <>
                  <List posts={postResponse?.userPosts || []} />
                  <div className="title">
                    <h1>Saved List</h1>
                  </div>
                  <List posts={postResponse?.savedPosts || []} />
                </>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </div>
    <div className="chatContainer">
      <div className="wrapper">
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={data?.chatResponse}
            errorElement={<p>Error loading chats!</p>}
          >
            {(chatResponse) => {
              console.log("Chat Response:", chatResponse);
              return <Chat chats={chatResponse || []} />;
            }}
          </Await>
        </Suspense>
        <Chat />
      </div>
    </div>
  </div>
);
}

export default ProfilePage;