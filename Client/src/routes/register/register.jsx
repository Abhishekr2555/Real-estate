import { useState } from "react";
import "./register.scss";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Move useState here
  const [isloading, setisLoading] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();
    setError("")
    setisLoading(true)
    
    const formdata = new FormData(e.target);
    const username = formdata.get("username");
    const email = formdata.get("email");
    const password = formdata.get("password");

    try {
      const response = await fetch("http://localhost:8800/api/auth/register", {
        method: "POST", // Use the POST method
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }), // Convert the body object to a JSON string
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      navigate("/login");
    } catch (er) {
      console.error('Error:', er);
      setError(er.message);
    }
  };

  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handlesubmit}>
          <h1>Create an Account</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="email" type="text" placeholder="Email" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={isloading}>Register</button>
          {error && <span>{error}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
