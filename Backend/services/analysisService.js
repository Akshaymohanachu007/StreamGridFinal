import UserPreference
    from "../models/UserPreference.js";


export const updateUserPattern =
    async (user, video) => {


        let pref =
            await UserPreference.findOne({
                userId: user
            });


        if (!pref) {

            pref =
                await UserPreference.create({

                    userId: user,

                    categories: [],

                    tags: []

                });

        }




        pref.categories.push({

            category: video.categoryId,

            score: 5

        });




        video.tags.forEach(tag => {


            pref.tags.push({

                tag,

                score: 2

            });


        });


        await pref.save();


    };