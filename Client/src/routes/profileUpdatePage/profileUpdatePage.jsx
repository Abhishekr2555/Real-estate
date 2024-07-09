import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CloudinaryUploadWidget from "../../components/upload/upload";

function ProfileUpdatePage() {
  const { updateUser, currentUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  // const [avatar, setAvatar] = useState(currentUser ? currentUser.avatar : "/noavatar.png");
  const [avatar, setAvatar] = useState([]);
  const navigate = useNavigate();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formdata);

    try {
      const response = await fetch(`http://localhost:8800/api/user/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password,avatar:avatar[0] }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const { password: userPassword, ...rest } = data;
      updateUser(rest); // Update the user context with the response data

      setSuccess("Profile updated successfully!");
      setError(null);

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button type="submit">Update</button>
          {error && <span className="error">{error}</span>}
          {success && <span className="success">{success}</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img
          src={avatar[0]|| currentUser.avatar || "/noavatar.png"}
          alt="Avatar"
          className="avatar"
        />
        <CloudinaryUploadWidget
          uwConfig={{
            cloudName: "dg64h0qzb",
            uploadPreset: "Estate",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
