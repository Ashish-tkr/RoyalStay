import Apartment from "../models/adminApartment.js";

// @desc    Create new apartment
// @route   POST /api/apartments
// @access  Admin
export const createApartment = async (req, res) => {
  try {
    const apartment = await Apartment.create(req.body);
    res.status(201).json(apartment);
  } catch (err) {
    res.status(400).json({ message: "Failed to create apartment", error: err.message });
  }
};

// @desc    Get all apartments
// @route   GET /api/apartments
// @access  Public

export const getApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find();
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch apartments", error: err.message });
  }
};

// @desc    Get single apartment
// @route   GET /api/apartments/:id
// @access  Public
export const getApartmentById = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) return res.status(404).json({ message: "Apartment not found" });
    res.json(apartment);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch apartment", error: err.message });
  }
};

// @desc    Update apartment
// @route   PUT /api/apartments/:id
// @access  Admin
export const updateApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!apartment) return res.status(404).json({ message: "Apartment not found" });
    res.json(apartment);
  } catch (err) {
    res.status(400).json({ message: "Failed to update apartment", error: err.message });
  }
};

// @desc    Delete apartment
// @route   DELETE /api/apartments/:id
// @access  Admin
export const deleteApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findByIdAndDelete(req.params.id);
    if (!apartment) return res.status(404).json({ message: "Apartment not found" });
    res.json({ message: "Apartment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete apartment", error: err.message });
  }
};


//-------------------------------------FLAT LEVEL----------------------------

// ✅ Add new flat to an apartment
export const addFlat = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) return res.status(404).json({ message: "Apartment not found" });

    apartment.flats.push(req.body); // push new flat object
    await apartment.save();

    res.status(201).json(apartment);
  } catch (err) {
    res.status(400).json({ message: "Failed to add flat", error: err.message });
  }
};

// ✅ Update specific flat
export const updateFlat = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) return res.status(404).json({ message: "Apartment not found" });

    const flat = apartment.flats.id(req.params.flatId);
    if (!flat) return res.status(404).json({ message: "Flat not found" });

    Object.assign(flat, req.body); // merge updates
    await apartment.save();

    res.json(apartment);
  } catch (err) {
    res.status(400).json({ message: "Failed to update flat", error: err.message });
  }
};

// ✅ Delete specific flat
export const deleteFlat = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    const flat = apartment.flats.id(req.params.flatId);
    if (!flat) {
      return res.status(404).json({ message: "Flat not found" });
    }

    // ✅ Use pull instead of remove
    apartment.flats.pull(req.params.flatId);

    await apartment.save();

    res.json({
      message: "Flat deleted successfully",
      apartment,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete flat", error: err.message });
  }
};


// @desc    Get all flats in an apartment
// @route   GET /api/apartments/:id/flats
// @access  Public
export const getFlats = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) return res.status(404).json({ message: "Apartment not found" });
    res.json(apartment.flats);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch flats", error: err.message });
  }
};

// @desc    Get a single flat in an apartment
// @route   GET /api/apartments/:id/flats/:flatId
// @access  Public
export const getFlatById = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (!apartment) return res.status(404).json({ message: "Apartment not found" });

    const flat = apartment.flats.id(req.params.flatId);
    if (!flat) return res.status(404).json({ message: "Flat not found" });

    res.json(flat);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch flat", error: err.message });
  }
};