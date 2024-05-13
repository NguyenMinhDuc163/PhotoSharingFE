import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { path } from "../../path";
import "./styles.css";
function UploadPhoto() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // new state for storing the preview URL
  const navigate = useNavigate();
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // create a URL representing the selected file
  };
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);
    // them title vao
    const title = event.target.title.value;
    formData.append("title", title);

    const response = await fetch(`${path}api/photo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (response.ok) {
      alert("File uploaded successfully");
      navigate(`/photos/${user._id}`)
    } else {
      alert("Failed to upload file");
    }
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <label className="custom-file-upload">
        Select File
        <input type="file" onChange={handleFileChange} />
      </label>
      {previewUrl && (
        <div className="preview-container">
          <img src={previewUrl} alt="Preview" className="preview-image" />
        </div>
      )}
      <input
        type="text"
        name="title"
        placeholder="Title"
        className="input-title"
      />
      <button type="submit" className="button-upload">
        Upload Photo
      </button>
    </form>
  );
}

export default UploadPhoto;