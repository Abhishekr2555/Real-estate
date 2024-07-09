import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {
  const { currrntUser } = useContext(AuthContext)
  // console.log(currrntUser)
  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Elite Estate Solutions</h1>
          <div class="elite-estate-description">
            <p>
              "Elite Estate Solutions stands at the forefront of luxury real estate, offering unparalleled service and exclusive listings. Our mission is to provide discerning clients with bespoke solutions, ensuring a superior experience and exceptional outcomes."
            </p>
          </div>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;
