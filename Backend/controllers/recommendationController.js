import History from "../models/History.js";
import Video from "../models/Video.js";


export const getRecommendations = async (req, res) => {


    try {


        const userId = req.user._id;


        // Get last watched videos

        const history =
            await History.find({
                userId
            })
                .populate("videoId")
                .sort({
                    watchedAt: -1
                })
                .limit(20);



        if (history.length === 0) {

            const trending =
                await Video.find()
                    .sort({
                        views: -1
                    })
                    .limit(20);


            return res.json({
                success: true,
                data: trending
            });

        }



        // collect user interests


        const categories = [];

        const tags = [];

        const watchedIds = [];



        history.forEach(item => {


            if (item.videoId) {


                watchedIds.push(
                    item.videoId._id
                );


                categories.push(
                    item.videoId.categoryId
                );


                tags.push(
                    ...item.videoId.tags
                );

            }


        });




        // Find similar videos


        const recommendations =
            await Video.find({

                _id: {
                    $nin: watchedIds
                },


                $or: [

                    {
                        categoryId: {
                            $in: categories
                        }
                    },

                    {
                        tags: {
                            $in: tags
                        }
                    }

                ]


            })
                .sort({

                    trendingScore: -1,
                    views: -1

                })
                .limit(30);



        res.json({

            success: true,
            count: recommendations.length,
            data: recommendations

        });



    } catch (error) {


        res.status(500)
            .json({

                success: false,
                message: error.message

            });


    }


};