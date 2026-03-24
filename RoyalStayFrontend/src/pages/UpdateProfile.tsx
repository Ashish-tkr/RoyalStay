import React, { useState } from "react";
import { Camera, User, Phone, Lock, Save, CheckCircle } from "lucide-react";

type UserProfile = {
  name: string;
  phone: string;
  email: string;
  avatar: string;
};

const UpdateProfile: React.FC<{ user?: UserProfile }> = ({ user }) => {
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState(user?.avatar || "/default-avatar.png");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    if (password) formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);

    try {
      // Add back localStorage in your actual app:
      // Authorization: `Bearer ${localStorage.getItem("token")}`,
      const res = await fetch("http://localhost:5000/auth/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: `Bearer your_token_here`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log(data);
      
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 text-lg">Update your personal information and preferences</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-500">
          <div className="space-y-8" onSubmit={handleSubmit}>
            
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-purple-100 to-blue-100 transform group-hover:scale-105 transition-all duration-300">
                  <img
                    src={preview || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjY0IiBjeT0iNDQiIHI9IjIwIiBmaWxsPSIjOUI5QkE4Ii8+CjxwYXRoIGQ9Ik0yNCA5NkMyNCA4MC41MzYgMzYuNTM2IDY4IDUyIDY4SDc2Qzk1LjQ2NCA2OCA5NiA4MC41MzYgOTYgOTZWMTAwSDI0Vjk2WiIgZmlsbD0iIzlCOUJBOCIvPgo8L3N2Zz4K";
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 text-center">Click the camera icon to change your profile picture</p>
            </div>

            {/* Input Fields */}
            <div className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white text-black placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white text-black placeholder-gray-400"
                    placeholder="Enter your phone number"    
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    placeholder="Enter new password (optional)"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white text-black placeholder-gray-400"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Leave blank to keep current password</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || isSuccess}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-lg shadow-lg transform transition-all duration-300 ${
                  isSuccess
                    ? "bg-green-500 hover:bg-green-600 scale-105"
                    : isSubmitting
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 hover:shadow-xl"
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving Changes...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Saved Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Your information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;