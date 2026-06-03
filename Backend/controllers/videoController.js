import Video from "../models/Video.js";
import Category from "../models/Category.js";

import {
  calculateTrendingScore
} from "../services/trendingService.js";

export const createVideo = async (req, res) => {
  try {
    const video = await Video.create(req.body);

    res.status(201).json({
      success: true,
      data: video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVideos = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let sortOption = {};

    if (req.query.sort === "latest") {
      sortOption = { createdAt: -1 };
    }

    if (req.query.sort === "views") {
      sortOption = { views: -1 };
    }

    let filter = {};

    if (req.query.category) {
      const category = await Category.findOne({
        slug: req.query.category,
      });

      if (category) {
        filter.categoryId = category._id;
      }
    }

    const videos = await Video.find(filter)
      .populate("categoryId", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments(filter);

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate(
      "categoryId",
      "name slug"
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.json({
      success: true,
      data: video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchVideos = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query required",
      });
    }

    const videos = await Video.find({
      $or: [
        {
          title: {
            $regex: q,
            $options: "i",
          },
        },
        {
          description: {
            $regex: q,
            $options: "i",
          },
        },
        {
          tags: {
            $elemMatch: {
              $regex: q,
              $options: "i",
            },
          },
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: videos.length,
      videos,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

export const getTrendingVideos = async (req, res) => {

  try {


    // get all videos

    const videos =
    await Video.find();



    // update scores

    for (const video of videos) {


      const newScore =
      calculateTrendingScore(
        video
      );


      video.trendingScore =
      newScore;


      await video.save();

    }



    // return highest ranked

    const trending =
    await Video.find()

    .sort({
      trendingScore:-1
    })

    .limit(20);



    res.json({

      success:true,

      count:trending.length,

      data:trending

    });



  }

  catch(error){


    res.status(500).json({

      success:false,

      message:error.message

    });


  }


};