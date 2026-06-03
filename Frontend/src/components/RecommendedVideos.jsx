import {useEffect,useState} from "react";

import {
fetchRecommendations
}
from "../services/recommendationService";


import VideoCard from "./VideoCard";



function RecommendedVideos(){


const [videos,setVideos]=useState([]);



useEffect(()=>{

const token = localStorage.getItem("token");
if (!token) return; // skip if not logged in

fetchRecommendations()
.then(setVideos)
.catch(()=>{}); // silently ignore errors


},[]);




return(

<div>


<h2 className="text-white text-xl mb-5">

Recommended for you

</h2>



<div className="
grid
grid-cols-4
gap-5
">


{
videos.map((video)=>(

<VideoCard

key={video._id}

id={video._id}

title={video.title}

thumbnail={
 video.thumbnail?.high ||
 video.thumbnail?.medium ||
 video.thumbnail?.low
}

channelName={
 video.channelName
}

views={
 video.views
}

duration={
 video.duration
}

/>

))
}


</div>



</div>


)

}


export default RecommendedVideos;