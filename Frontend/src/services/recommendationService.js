import api from "../lib/api";


export const fetchRecommendations =
async()=>{


const response =
await api.get(
"/recommendations"
);


return response.data.data;


};