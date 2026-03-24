import { useEffect, useState } from "react";
import axios from "axios";

interface Apartment {
  _id: string;
  name: string;
  location: string;
  flats: { number: string }[];
  coverImage: string;
  amenities: string[];
}

// ✅ Define response type for Cloudinary upload
interface UploadResponse {
  url: string;
}

export default function AdminDashboard() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    coverImage: "",
    amenities: "",
  });

  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Fetch Apartments
  const fetchApartments = async () => {
    const res = await axios.get<Apartment[]>(
      "http://localhost:5000/admin/apartments",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setApartments(res.data);
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  // ✅ Handle Image Upload to backend (which uploads to Cloudinary)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axios.post<UploadResponse>(
        "http://localhost:5000/api/upload", // backend route that uploads to Cloudinary
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUrl(res.data.url); // ✅ Now TypeScript knows res.data.url exists
      setForm({ ...form, coverImage: res.data.url }); // ✅ store image URL in form
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Handle new apartment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/admin/apartments",
        {
          ...form,
          amenities: form.amenities.split(",").map((a) => a.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ name: "", location: "", coverImage: "", amenities: "" });
      setUrl("");
      fetchApartments();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error creating apartment");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* ✅ Add Apartment Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded-lg shadow-md mb-6 bg-gray-50"
      >
        <h2 className="text-xl font-semibold mb-3">Add New Apartment</h2>

        <input
          type="text"
          placeholder="Apartment Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border mb-3"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full p-2 border mb-3"
          required
        />

        {/* ✅ File Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="mb-3"
        />
        {uploading && <p>Uploading image...</p>}
        {url && <img src={url} alt="Uploaded" className="w-32 h-32 mb-3" />}

        <input
          type="text"
          placeholder="Amenities (comma separated)"
          value={form.amenities}
          onChange={(e) => setForm({ ...form, amenities: e.target.value })}
          className="w-full p-2 border mb-3"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Apartment
        </button>
      </form>

      {/* ✅ List Apartments */}
      <div>
        <h2 className="text-2xl font-bold mb-4">All Apartments</h2>
        {apartments.map((apt) => (
          <div
            key={apt._id}
            className="border p-4 mb-3 rounded-lg shadow-md bg-white"
          >
            <h2 className="text-xl font-semibold">{apt.name}</h2>
            <p>{apt.location}</p>
            <p>{apt.flats.length} Flats</p>
            {apt.coverImage && (
              <img
                src={apt.coverImage}
                alt={apt.name}
                className="w-40 h-32 mt-2 object-cover rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
