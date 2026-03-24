import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Upload, X, Home, Building, Users, Camera, Star, Wifi, Car, Utensils, Dumbbell, Shield, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminBookingsPage from './AdminBookingsPage';
import { set } from 'date-fns';
// Types
interface FlatType {
  _id?: string;
  type: 'Single' | '1BHK' | '2BHK' | '3BHK';
  title: string;
  description?: string;
  price: number;
  baseprice: number;
  size?: string;
  maxOccupancy: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  features: string[];
  amenities: string[];
}

interface Apartment {
  _id?: string;
  name: string;
  location: string;
  coverImage: string;
  amenities: string[];
  flats: FlatType[];
  createdAt?: string;
  updatedAt?: string;
}

const ApartmentAdminDashboard: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [showApartmentModal, setShowApartmentModal] = useState(false);
  const [showFlatModal, setShowFlatModal] = useState(false);
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
  const [editingFlat, setEditingFlat] = useState<FlatType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [view, setView] = useState<'apartments' | 'flats' | 'bookings'>('apartments');
  const navigate = useNavigate();
  
  
  // Form states
  const [apartmentForm, setApartmentForm] = useState<Apartment>({
    name: '',
    location: '',
    coverImage: '',
    amenities: [],
    flats: []
  });
  
  const [flatForm, setFlatForm] = useState<FlatType>({
    type: 'Single',
    title: '',
    description: '',
    price: 0,
    baseprice: 0,
    size: '',
    maxOccupancy: 1,
    bedrooms: 1,
    bathrooms: 1,
    images: [],
    features: [],
    amenities: []
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch apartments
  const fetchApartments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/apartments');
      const data = await response.json();
      setApartments(data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  // Image upload handler
  const handleImageUpload = async (file: File, isFlat = false): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    setUploadingImage(true);
    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await response.json();
      
      if (data.success) {
        return data.url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  // CRUD Operations for Apartments
  const createApartment = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/apartments', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apartmentForm),
      });
      
      if (response.ok) {
        await fetchApartments();
        resetApartmentForm();
        setShowApartmentModal(false);
      }
    } catch (error) {
      console.error('Error creating apartment:', error);
    }
  };

  const updateApartment = async () => {
    if (!editingApartment?._id) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/apartments/${editingApartment._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apartmentForm),
      });
      
      if (response.ok) {
        await fetchApartments();
        resetApartmentForm();
        setShowApartmentModal(false);
        setEditingApartment(null);
      }
    } catch (error) {
      console.error('Error updating apartment:', error);
    }
  };

  const deleteApartment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this apartment?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/apartments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        await fetchApartments();
      }
    } catch (error) {
      console.error('Error deleting apartment:', error);
    }
  };

  // CRUD Operations for Flats
  const addFlat = async () => {
    if (!selectedApartment?._id) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/apartments/${selectedApartment._id}/flats`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flatForm),
      });
      
      if (response.ok) {
        await fetchApartments();
        resetFlatForm();
        setShowFlatModal(false);
      }
    } catch (error) {
      console.error('Error adding flat:', error);
    }
  };

  const updateFlat = async () => {
    if (!selectedApartment?._id || !editingFlat?._id) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/apartments/${selectedApartment._id}/flats/${editingFlat._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flatForm),
      });
      
      if (response.ok) {
        await fetchApartments();
        resetFlatForm();
        setShowFlatModal(false);
        setEditingFlat(null);
      }
    } catch (error) {
      console.error('Error updating flat:', error);
    }
  };

  const deleteFlat = async (flatId: string) => {
    if (!selectedApartment?._id || !confirm('Are you sure you want to delete this flat?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/apartments/${selectedApartment._id}/flats/${flatId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        await fetchApartments();
      }
    } catch (error) {
      console.error('Error deleting flat:', error);
    }
  };

  // Form helpers
  const resetApartmentForm = () => {
    setApartmentForm({
      name: '',
      location: '',
      coverImage: '',
      amenities: [],
      flats: []
    });
  };

  const resetFlatForm = () => {
    setFlatForm({
      type: 'Single',
      title: '',
      description: '',
      price: 0,
      baseprice: 0,
      size: '',
      maxOccupancy: 1,
      bedrooms: 1,
      bathrooms: 1,
      images: [],
      features: [],
      amenities: []
    });
  };

  const openEditApartment = (apartment: Apartment) => {
    setEditingApartment(apartment);
    setApartmentForm({...apartment});
    setShowApartmentModal(true);
  };

  const openEditFlat = (flat: FlatType) => {
    setEditingFlat(flat);
    setFlatForm({...flat});
    setShowFlatModal(true);
  };

  const addAmenityToForm = (isFlat = false) => {
    if (!newAmenity.trim()) return;
    
    if (isFlat) {
      setFlatForm(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
    } else {
      setApartmentForm(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
    }
    setNewAmenity('');
  };

  const addFeatureToForm = () => {
    if (!newFeature.trim()) return;
    
    setFlatForm(prev => ({
      ...prev,
      features: [...prev.features, newFeature.trim()]
    }));
    setNewFeature('');
  };

  const removeAmenity = (index: number, isFlat = false) => {
    if (isFlat) {
      setFlatForm(prev => ({
        ...prev,
        amenities: prev.amenities.filter((_, i) => i !== index)
      }));
    } else {
      setApartmentForm(prev => ({
        ...prev,
        amenities: prev.amenities.filter((_, i) => i !== index)
      }));
    }
  };

  const removeFeature = (index: number) => {
    setFlatForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const removeImage = (index: number) => {
    setFlatForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Filter apartments
  const filteredApartments = apartments.filter(apartment => {
    const matchesSearch = apartment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apartment.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Get all flats for flat view
  const allFlats = apartments.flatMap(apartment => 
    apartment.flats.map(flat => ({
      ...flat,
      apartmentId: apartment._id,
      apartmentName: apartment.name,
      apartmentLocation: apartment.location
    }))
  );

  const filteredFlats = allFlats.filter(flat => {
    const matchesSearch = flat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flat.apartmentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || flat.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 to-purple-900/40 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Building className="text-purple-400" />
            Apartment Management Dashboard
          </h1>
          <p className="text-gray-300">Manage your apartments and flat types</p>
        </div>

        {/* Navigation & Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setView('apartments')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                view === 'apartments' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Building className="inline mr-2 h-4 w-4" />
              Apartments
            </button>
            <button
              onClick={() => setView('flats')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                view === 'flats' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Home className="inline mr-2 h-4 w-4" />
              All Flats
            </button>
            <button
              onClick={() =>setView('bookings')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                view === 'bookings' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <Home className="inline mr-2 h-4 w-4" />
              Booking Details
            </button>
          </div>


          
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${view}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            {view === 'flats' && (
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-gray-900 backdrop-blur border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="" >All Types</option>
                <option value="Single">Single</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
              </select>
            )}
            
            <button
              onClick={() => {
                resetApartmentForm();
                setEditingApartment(null);
                setShowApartmentModal(true);
              }}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Apartment
            </button>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {view === 'apartments' && (
              /* Apartments Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApartments.map((apartment) => (
                  <div key={apartment._id} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all shadow-lg">
                    {/* Cover Image */}
                    <div className="relative mb-4 h-48 rounded-lg overflow-hidden">
                      <img
                        src={apartment.coverImage || '/api/placeholder/400/300'}
                        alt={apartment.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-purple-600/80 backdrop-blur px-2 py-1 rounded text-white text-sm">
                        {apartment.flats.length} flats
                      </div>
                    </div>
                    
                    {/* Apartment Info */}
                    <h3 className="text-xl font-bold text-white mb-2">{apartment.name}</h3>
                    <p className="text-gray-300 mb-3 flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {apartment.location}
                    </p>
                    
                    {/* Amenities */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {apartment.amenities.slice(0, 3).map((amenity, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-600/30 text-purple-200 rounded text-xs">
                            {amenity}
                          </span>
                        ))}
                        {apartment.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-600/30 text-gray-300 rounded text-xs">
                            +{apartment.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedApartment(apartment)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button
                        onClick={() => openEditApartment(apartment)}
                        className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteApartment(apartment._id!)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) }
            {view === 'flats' && (
              /* Flats Table */
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-600/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-white font-medium">Image</th>
                        <th className="px-6 py-3 text-left text-white font-medium">Title</th>
                        <th className="px-6 py-3 text-left text-white font-medium">Type</th>
                        <th className="px-6 py-3 text-left text-white font-medium">Apartment</th>
                        <th className="px-6 py-3 text-left text-white font-medium">Price</th>
                        <th className="px-6 py-3 text-left text-white font-medium">Size</th>
                        <th className="px-6 py-3 text-left text-white font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFlats.map((flat) => (
                        <tr key={flat._id} className="border-b border-white/10 hover:bg-white/5">
                          <td className="px-6 py-4">
                            <img
                              src={flat.images[0] || '/api/placeholder/80/60'}
                              alt={flat.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                          </td>
                          <td className="px-6 py-4 text-white font-medium">{flat.title}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-sm">
                              {flat.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{flat.apartmentName}</td>
                          <td className="px-6 py-4 text-green-400 font-bold">₹{flat.price.toLocaleString()}</td>
                          <td className="px-6 py-4 text-gray-300">{flat.size || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const apartment = apartments.find(apt => apt._id === flat.apartmentId);
                                  setSelectedApartment(apartment || null);
                                  openEditFlat(flat);
                                }}
                                className="p-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const apartment = apartments.find(apt => apt._id === flat.apartmentId);
                                  setSelectedApartment(apartment || null);
                                  deleteFlat(flat._id!);
                                }}
                                className="p-1 bg-red-600 hover:bg-red-700 text-white rounded"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {view === 'bookings' && <AdminBookingsPage />}
          </>
        )}

        {/* Apartment Detail Modal */}
        {selectedApartment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900/95 backdrop-blur border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">{selectedApartment.name}</h2>
                  <button
                    onClick={() => setSelectedApartment(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Cover Image */}
                <img
                  src={selectedApartment.coverImage}
                  alt={selectedApartment.name}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                
                {/* Apartment Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Details</h3>
                    <p className="text-gray-300 mb-2">📍 {selectedApartment.location}</p>
                    <p className="text-gray-300">🏠 {selectedApartment.flats.length} flat types available</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApartment.amenities.map((amenity, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-sm">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Flats */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Available Flats</h3>
                    <button
                      onClick={() => {
                        resetFlatForm();
                        setEditingFlat(null);
                        setShowFlatModal(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Flat
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApartment.flats.map((flat) => (
                      <div key={flat._id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-white">{flat.title}</h4>
                            <span className="text-purple-400 text-sm">{flat.type}</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => openEditFlat(flat)}
                              className="p-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => deleteFlat(flat._id!)}
                              className="p-1 bg-red-600 hover:bg-red-700 text-white rounded"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-gray-300 text-sm space-y-1">
                          <p>💰 ₹{flat.price.toLocaleString()}/month</p>
                          <p>📏 {flat.size || 'Size not specified'}</p>
                          <p>👥 Max {flat.maxOccupancy} occupants</p>
                          <p>🛏️ {flat.bedrooms} bed • 🚿 {flat.bathrooms} bath</p>
                        </div>
                        
                        {flat.images.length > 0 && (
                          <div className="mt-3 flex gap-1 overflow-x-auto">
                            {flat.images.slice(0, 3).map((img, index) => (
                              <img
                                key={index}
                                src={img}
                                alt={`${flat.title} ${index + 1}`}
                                className="w-16 h-12 object-cover rounded flex-shrink-0"
                              />
                            ))}
                            {flat.images.length > 3 && (
                              <div className="w-16 h-12 bg-gray-700 rounded flex items-center justify-center text-gray-300 text-xs flex-shrink-0">
                                +{flat.images.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Apartment Form Modal */}
        {showApartmentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900/95 backdrop-blur border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingApartment ? 'Edit Apartment' : 'Add New Apartment'}
                </h2>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  editingApartment ? updateApartment() : createApartment();
                }} className="space-y-4">
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={apartmentForm.name}
                      onChange={(e) => setApartmentForm(prev => ({...prev, name: e.target.value}))}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Luxury Apartment Complex"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={apartmentForm.location}
                      onChange={(e) => setApartmentForm(prev => ({...prev, location: e.target.value}))}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Downtown, City Name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Cover Image</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={apartmentForm.coverImage}
                        onChange={(e) => setApartmentForm(prev => ({...prev, coverImage: e.target.value}))}
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const url = await handleImageUpload(file);
                              setApartmentForm(prev => ({...prev, coverImage: url}));
                            } catch (error) {
                              alert('Image upload failed');
                            }
                          }
                        }}
                        className="hidden"
                        id="apartment-cover-upload"
                      />
                      <label
                        htmlFor="apartment-cover-upload"
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer flex items-center gap-2 transition-colors"
                      >
                        {uploadingImage ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        Upload
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Amenities</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Swimming Pool, Gym, Parking"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenityToForm())}
                      />
                      <button
                        type="button"
                        onClick={() => addAmenityToForm()}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {apartmentForm.amenities.map((amenity, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-sm flex items-center gap-1">
                          {amenity}
                          <button
                            type="button"
                            onClick={() => removeAmenity(index)}
                            className="text-purple-200 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="flex-1 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                    >
                      {editingApartment ? 'Update Apartment' : 'Create Apartment'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowApartmentModal(false);
                        resetApartmentForm();
                        setEditingApartment(null);
                      }}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Flat Form Modal */}
        {showFlatModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900/95 backdrop-blur border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingFlat ? 'Edit Flat' : 'Add New Flat'}
                </h2>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  editingFlat ? updateFlat() : addFlat();
                }} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Type</label>
                      <select
                        value={flatForm.type}
                        onChange={(e) => setFlatForm(prev => ({...prev, type: e.target.value as any}))}
                        className="w-full px-4 py-2 bg-gray-900 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="Single">Single</option>
                        <option value="1BHK">1BHK</option>
                        <option value="2BHK">2BHK</option>
                        <option value="3BHK">3BHK</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={flatForm.title}
                        onChange={(e) => setFlatForm(prev => ({...prev, title: e.target.value}))}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Cozy Studio Apartment"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Description</label>
                    <textarea
                      value={flatForm.description}
                      onChange={(e) => setFlatForm(prev => ({...prev, description: e.target.value}))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Describe the flat, its features, and what makes it special..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Price (₹)</label>
                      <input
                        type="number"
                        value={flatForm.price}
                        onChange={(e) => setFlatForm(prev => ({...prev, price: parseInt(e.target.value) || 0}))}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="25000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Base Price (₹)</label>
                      <input
                        type="number"
                        value={flatForm.baseprice}
                        onChange={(e) => setFlatForm(prev => ({...prev, baseprice: parseInt(e.target.value) || 0}))}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="25000"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-2">Size</label>
                      <input
                        type="text"
                        value={flatForm.size}
                        onChange={(e) => setFlatForm(prev => ({...prev, size: e.target.value}))}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="500 sq.ft"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-2">Max Occupancy</label>
                      <input
                        type="number"
                        value={flatForm.maxOccupancy}
                        onChange={(e) => setFlatForm(prev => ({...prev, maxOccupancy: parseInt(e.target.value) || 1}))}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-2">Bedrooms</label>
                      <input
                        type="number"
                        value={flatForm.bedrooms}
                        onChange={(e) => setFlatForm(prev => ({...prev, bedrooms: parseInt(e.target.value) || 1}))}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-white font-medium">Bathrooms</label>
                      <input
                        type="number"
                        value={flatForm.bathrooms}
                        onChange={(e) => setFlatForm(prev => ({...prev, bathrooms: parseInt(e.target.value) || 1}))}
                        className="w-20 px-3 py-1 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="1"
                      />
                    </div>
                  </div>
                  
                  {/* Images */}
                  <div>
                    <label className="block text-white font-medium mb-2">Images</label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Image URL"
                          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              if (input.value.trim()) {
                                setFlatForm(prev => ({
                                  ...prev,
                                  images: [...prev.images, input.value.trim()]
                                }));
                                input.value = '';
                              }
                            }
                          }}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            for (const file of files) {
                              try {
                                const url = await handleImageUpload(file, true);
                                setFlatForm(prev => ({
                                  ...prev,
                                  images: [...prev.images, url]
                                }));
                              } catch (error) {
                                alert(`Failed to upload ${file.name}`);
                              }
                            }
                          }}
                          className="hidden"
                          id="flat-images-upload"
                        />
                        <label
                          htmlFor="flat-images-upload"
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer flex items-center gap-2 transition-colors"
                        >
                          {uploadingImage ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Camera className="h-4 w-4" />
                          )}
                          Upload
                        </label>
                      </div>
                      
                      {flatForm.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {flatForm.images.map((img, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={img}
                                alt={`Flat image ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div>
                    <label className="block text-white font-medium mb-2">Features</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Balcony, AC, Furnished"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeatureToForm())}
                      />
                      <button
                        type="button"
                        onClick={() => addFeatureToForm()}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {flatForm.features.map((feature, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-sm flex items-center gap-1">
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-blue-200 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Amenities */}
                  <div>
                    <label className="block text-white font-medium mb-2">Flat-Specific Amenities</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Private Kitchen, Wardrobe"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenityToForm(true))}
                      />
                      <button
                        type="button"
                        onClick={() => addAmenityToForm(true)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {flatForm.amenities.map((amenity, index) => (
                        <span key={index} className="px-3 py-1 bg-green-600/30 text-green-200 rounded-full text-sm flex items-center gap-1">
                          {amenity}
                          <button
                            type="button"
                            onClick={() => removeAmenity(index, true)}
                            className="text-green-200 hover:text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t border-white/20">
                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 font-medium"
                    >
                      {editingFlat ? 'Update Flat' : 'Create Flat'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowFlatModal(false);
                        resetFlatForm();
                        setEditingFlat(null);
                      }}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApartmentAdminDashboard;