import mongoose from "mongoose";

const flatTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Single", "1BHK", "2BHK", "3BHK"],
      required: true,
    },
    title: { type: String, required: true }, // e.g. "Cozy Single Room"
    description: { type: String },
    price: { type: Number, required: true }, // rent price
    baseprice: { type: Number, required: true }, // base price
    size: { type: String }, // "350 sq.ft"
    maxOccupancy: { type: Number, default: 1 },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    images: [{ type: String }],
    features: [{ type: String }],
    amenities: [{ type: String }],
     rating: { type: Number, default: 0, min: 0, max: 5 }, // Added rating for individual flats
    reviews: { type: Number, default: 0 } // Added reviews count for individual flats
  },
  { _id: true } 
);

const apartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Luxury Apartment"
    location: { type: String, required: true, trim: true },
    coverImage: { type: String, required: true }, // main image of property
    amenities: [{ type: String }], // global amenities for entire apartment
    flats: [flatTypeSchema], // all flat types available
     // New fields for overall apartment rating and reviews
    rating: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 5 
    },
    reviews: { 
      type: Number, 
      default: 0 
    },
    // New boolean fields for specific amenities
    hasRestaurant: { 
      type: Boolean, 
      default: false 
    },
    hasGym: { 
      type: Boolean, 
      default: false 
    },
    // You might want to add more specific amenities
    hasPool: { 
      type: Boolean, 
      default: false 
    },
    hasSpa: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

const Apartment = mongoose.model("Apartment", apartmentSchema);
export default Apartment;
