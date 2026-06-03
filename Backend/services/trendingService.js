export const calculateTrendingScore=(video)=>{


const ageHours =
(
Date.now()
-
new Date(video.createdAt)
)
/
(1000*60*60);



const score =

(video.views * 0.5)

+

(video.watchCount * 3)

+

(video.likes * 5)

-

(ageHours * 2);



return Math.max(score,0);

};