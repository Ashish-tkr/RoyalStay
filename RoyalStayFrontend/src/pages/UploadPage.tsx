import { useState } from "react";
import axios from "axios";

interface UploadResponse {
  url: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    

  try {
      const res = await axios.post<UploadResponse>(
        "http://localhost:5000/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUrl(res.data.url); // ✅ works safely
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="p-6">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload</button>

      {url && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={url} alt="uploaded" width="200" />
        </div>
      )}
    </div>
  );
}
