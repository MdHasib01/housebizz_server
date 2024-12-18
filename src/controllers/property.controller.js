import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Property } from "../model/property.model.js";

const addProperty = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    location,
    city,
    divission,
    price,
    image,
    size,
    bedrooms,
    bathrooms,
    garage,
    yearBuilt,
    appartmentType,
    porertyStatus,
    owner,
  } = req.body;

  if ([title].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Tittle is required");
  }

  const imageLocalPath = req?.files?.image?.[0]?.path || null;
  const propertyImage = await uploadOnCloudinary(imageLocalPath);

  const property = await Property.create({
    title,
    description,
    location,
    city,
    divission,
    price,
    image: propertyImage?.url,
    size,
    bedrooms,
    bathrooms,
    garage,
    yearBuilt,
    appartmentType,
    porertyStatus,
    owner: req.user?._id,
  });

  const createProperty = await Property.findById(property._id).select();

  if (!createProperty) {
    throw new ApiError(500, "Something went wrong while listing the property");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createProperty, "Property listed Successfully"));
});

const getAllProperties = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType } = req.query;
  const pipeline = [];

  if (query) {
    pipeline.push({
      $search: {
        index: "search-property",
        text: {
          query: query,
          path: ["title", "description"], //search only on title, desc
        },
      },
    });
  }

  if (sortBy && sortType) {
    pipeline.push({
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$ownerDetails",
    }
  );

  const propertyAggregate = Property.aggregate(pipeline);

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const property = await Property.aggregatePaginate(propertyAggregate, options);
  // const all = await Property.find();
  return res
    .status(200)
    .json(new ApiResponse(200, property, "Property fetched successfully"));
});

// get video by id
// const getVideoById = asyncHandler(async (req, res) => {
//   const { videoId } = req.params;
//   // let userId = req.body;

//   // userId = new mongoose.Types.ObjectId(userId)
//   if (!isValidObjectId(videoId)) {
//     throw new ApiError(400, "Invalid videoId");
//   }

//   if (!isValidObjectId(req.user?._id)) {
//     throw new ApiError(400, "Invalid userId");
//   }

//   const video = await Video.aggregate([
//     {
//       $match: {
//         _id: new mongoose.Types.ObjectId(videoId),
//       },
//     },
//     {
//       $lookup: {
//         from: "likes",
//         localField: "_id",
//         foreignField: "video",
//         as: "likes",
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "owner",
//         foreignField: "_id",
//         as: "owner",
//         pipeline: [
//           {
//             $lookup: {
//               from: "subscriptions",
//               localField: "_id",
//               foreignField: "channel",
//               as: "subscribers",
//             },
//           },
//           {
//             $addFields: {
//               subscribersCount: {
//                 $size: "$subscribers",
//               },
//               isSubscribed: {
//                 $cond: {
//                   if: {
//                     $in: [req.user?._id, "$subscribers.subscriber"],
//                   },
//                   then: true,
//                   else: false,
//                 },
//               },
//             },
//           },
//           {
//             $project: {
//               username: 1,
//               "avatar.url": 1,
//               subscribersCount: 1,
//               isSubscribed: 1,
//             },
//           },
//         ],
//       },
//     },
//     {
//       $addFields: {
//         likesCount: {
//           $size: "$likes",
//         },
//         owner: {
//           $first: "$owner",
//         },
//         isLiked: {
//           $cond: {
//             if: { $in: [req.user?._id, "$likes.likedBy"] },
//             then: true,
//             else: false,
//           },
//         },
//       },
//     },
//     {
//       $project: {
//         "videoFile.url": 1,
//         title: 1,
//         description: 1,
//         views: 1,
//         createdAt: 1,
//         duration: 1,
//         comments: 1,
//         owner: 1,
//         likesCount: 1,
//         isLiked: 1,
//       },
//     },
//   ]);

//   if (!video) {
//     throw new ApiError(500, "failed to fetch video");
//   }

//   // increment views if video fetched successfully
//   await Video.findByIdAndUpdate(videoId, {
//     $inc: {
//       views: 1,
//     },
//   });

//   // add this video to user watch history
//   await User.findByIdAndUpdate(req.user?._id, {
//     $addToSet: {
//       watchHistory: videoId,
//     },
//   });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, video[0], "video details fetched successfully"));
// });

export { addProperty, getAllProperties };
