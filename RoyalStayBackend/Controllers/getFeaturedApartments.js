// controllers/apartmentController.js
//import Apartment from '../models/adminApartment';

// Get featured apartments - latest 3 apartments
export const getFeaturedApartments = async (req, res) => {
  try {
    // Get latest 3 apartments with populated data
    const apartments = await Apartment.find()
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .limit(3) // Limit to only 3 results
      .select({
        name: 1,
        location: 1,
        coverImage: 1,
        amenities: 1,
        rating: 1,
        reviews: 1,
        hasRestaurant: 1,
        hasGym: 1,
        hasPool: 1,
        hasSpa: 1,
        flats: 1,
        createdAt: 1,
        updatedAt: 1
      })
      .lean(); // Use lean() for better performance

    // Transform data to match frontend requirements
    const featuredStays = apartments.map(apartment => {
      // Get minimum price from all flats
      const minPrice = apartment.flats.length > 0 
        ? Math.min(...apartment.flats.map(flat => flat.price))
        : 0;

      // Get all unique BHK options
      const bhkOptions = [...new Set(apartment.flats.map(flat => flat.type))];

      // Combine apartment amenities with boolean amenities
      const allAmenities = [...apartment.amenities];
      if (apartment.hasRestaurant) allAmenities.push('Restaurant');
      if (apartment.hasGym) allAmenities.push('Gym');
      if (apartment.hasPool) allAmenities.push('Pool');
      if (apartment.hasSpa) allAmenities.push('Spa');

      return {
        id: apartment._id,
        name: apartment.name,
        location: apartment.location,
        image: apartment.coverImage,
        price: minPrice,
        rating: apartment.rating || 0,
        reviews: apartment.reviews || 0,
        amenities: allAmenities,
        bhkOptions: bhkOptions,
        flats: apartment.flats, // Include flat details for booking
        hasRestaurant: apartment.hasRestaurant,
        hasGym: apartment.hasGym,
        hasPool: apartment.hasPool,
        hasSpa: apartment.hasSpa
      };
    });

    res.status(200).json({
      success: true,
      data: featuredStays,
      count: featuredStays.length
    });

  } catch (error) {
    console.error('Error fetching featured apartments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured apartments',
      error: error.message
    });
  }
};

// Get all apartments with pagination
export const getAllApartments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Optional filters
    const filters = {};
    if (req.query.location) {
      filters.location = { $regex: req.query.location, $options: 'i' };
    }
    if (req.query.minRating) {
      filters.rating = { $gte: parseFloat(req.query.minRating) };
    }

    const apartments = await Apartment.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalApartments = await Apartment.countDocuments(filters);

    const transformedApartments = apartments.map(apartment => {
      const minPrice = apartment.flats.length > 0 
        ? Math.min(...apartment.flats.map(flat => flat.price))
        : 0;

      const bhkOptions = [...new Set(apartment.flats.map(flat => flat.type))];

      const allAmenities = [...apartment.amenities];
      if (apartment.hasRestaurant) allAmenities.push('Restaurant');
      if (apartment.hasGym) allAmenities.push('Gym');
      if (apartment.hasPool) allAmenities.push('Pool');
      if (apartment.hasSpa) allAmenities.push('Spa');

      return {
        id: apartment._id,
        name: apartment.name,
        location: apartment.location,
        image: apartment.coverImage,
        price: minPrice,
        rating: apartment.rating || 0,
        reviews: apartment.reviews || 0,
        amenities: allAmenities,
        bhkOptions: bhkOptions,
        flats: apartment.flats
      };
    });

    res.status(200).json({
      success: true,
      data: transformedApartments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalApartments / limit),
        totalItems: totalApartments,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Error fetching apartments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch apartments',
      error: error.message
    });
  }
};