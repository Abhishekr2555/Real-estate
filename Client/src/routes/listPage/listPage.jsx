import { listData } from "../../lib/dummydata";
import "./listPage.scss";
import Filter from "../../components/filter/Filter"
import Card from "../../components/card/Card"
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
function ListPage() {
  const post = useLoaderData();
  console.log(post)

  return <div className="listPage">
    <div className="listContainer">
      <div className="wrapper">
        <Filter />
        {post.map(item => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </div>
    <div className="mapContainer">
      <Map items={post}/>
    </div>
  </div>;
}

export default ListPage;
