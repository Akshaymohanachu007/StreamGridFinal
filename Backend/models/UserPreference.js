import mongoose from "mongoose";


const schema =
    new mongoose.Schema({

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },


        categories: [

            {
                category: String,
                score: Number
            }

        ],


        tags: [

            {
                tag: String,
                score: Number
            }

        ]


    });


export default mongoose.model(
    "UserPreference",
    schema
);