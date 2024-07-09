import { useState,useContext } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isloading, setisLoading] = useState(false);

  const { updateUser } = useContext(AuthContext)
  // console.log(updateUser)

  const handlesubmit = async (e) => {
    e.preventDefault();
    setisLoading(true)
    const formdata = new FormData(e.target);
    
    const username = formdata.get("username");
    const email = formdata.get("email");
    const password = formdata.get("password");

    try {
      const response = await fetch("http://localhost:8800/api/auth/login", {
        method: "POST", // Use the POST method
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }), // Convert the body object to a JSON string
        credentials: 'include', // Include credentials such as cookies
      });
      

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // localStorage.setItem("user", JSON.stringify(data));
      // console.log(data);

      updateUser(data)

      navigate("/");
    } catch (er) {  
      console.error('Error:', er);
      setError(er.message);
    }
    finally {
      setisLoading(false)
    }
  }
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handlesubmit}>
          <h1>Welcome back</h1>
          <input name="username" required minLength={3} maxLength={20} type="text" placeholder="Username" />
          <input name="password" required type="password" placeholder="Password" />
          <button disabled={isloading}>Login</button>
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
