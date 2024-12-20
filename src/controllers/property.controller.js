import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Property } from "../model/property.model.js";
import mongoose, { isValidObjectId } from "mongoose";

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

//get product by id
const getPropertyById = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  if (!isValidObjectId(propertyId)) {
    throw new ApiError(400, "Invalid propertyId");
  }

  const property = await Property.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(propertyId),
      },
    },
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
    },
  ]);

  if (!property) {
    throw new ApiError(404, "Property not found");
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, property, "Property fetched successfully"));
  }
});

export { addProperty, getAllProperties, getPropertyById };
