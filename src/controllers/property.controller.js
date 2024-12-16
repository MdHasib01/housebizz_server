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

export { addProperty };
