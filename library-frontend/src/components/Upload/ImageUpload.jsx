"use client";

import { useState, useRef, useEffect } from "react";

/**
 * An enhanced Cloudinary upload widget with drag & drop and preview
 * @param {Object} props - Component props
 * @param {Function} props.onUpload - Function called when upload is complete with the secure URL
 * @param {string} props.className - Optional className for the container
 * @param {number} props.maxSizeMB - Optional max file size in MB (default 10MB)
 * @param {string[]} props.allowedFormats - Optional array of allowed formats
 * @returns {React.ReactElement} - Enhanced upload widget component
 */

export function ImageUpload({
  onUpload,
  className = "",
  maxSizeMB = 10,
  allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"],
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  // Fallback values in case environment variables are not available
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dis1rhp8s";
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "neewplatform";

  useEffect(() => {
    setIsMounted(true);

    // Cleanup preview URL on unmount
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Set up drag and drop event listeners
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const preventDefault = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragEnter = (e) => {
      preventDefault(e);
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      preventDefault(e);
      setIsDragging(false);
    };

    const handleDragOver = (e) => {
      preventDefault(e);
      if (!isDragging) {
        setIsDragging(true);
      }
    };

    const handleDrop = (e) => {
      preventDefault(e);
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        validateAndUploadFile(files[0]);
      }
    };

    dropArea.addEventListener("dragenter", handleDragEnter);
    dropArea.addEventListener("dragleave", handleDragLeave);
    dropArea.addEventListener("dragover", handleDragOver);
    dropArea.addEventListener("drop", handleDrop);

    return () => {
      dropArea.removeEventListener("dragenter", handleDragEnter);
      dropArea.removeEventListener("dragleave", handleDragLeave);
      dropArea.removeEventListener("dragover", handleDragOver);
      dropArea.removeEventListener("drop", handleDrop);
    };
  }, [isDragging]);

  const validateAndUploadFile = (file) => {
    setError(null);

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size exceeds the maximum limit of ${maxSizeMB}MB`);
      return false;
    }

    // Check file format
    const fileExt = file.name.split(".").pop().toLowerCase();
    if (!allowedFormats.includes(fileExt)) {
      setError(
        `File format .${fileExt} is not supported. Allowed formats: ${allowedFormats.join(
          ", "
        )}`
      );
      return false;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Upload file
    uploadFile(file);
    return true;
  };

  const uploadFile = async (file) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create FormData for the upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("cloud_name", cloudName);

      // Use XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/upload`);

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          onUpload(response.secure_url);
          setIsUploading(false);

          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          setError("Upload failed: " + (xhr.statusText || "Unknown error"));
          setIsUploading(false);
        }
      };

      xhr.onerror = () => {
        setError("Network error occurred");
        setIsUploading(false);
      };

      xhr.send(formData);
    } catch (err) {
      setError(err.message || "Upload failed");
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndUploadFile(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetUpload = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isMounted) {
    return null; // Return nothing during server-side rendering
  }

  return (
    <div className={`upload-widget ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={allowedFormats.map((format) => `.${format}`).join(",")}
        className="hidden"
      />

      <div
        ref={dropAreaRef}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } ${preview ? "bg-gray-50" : ""}
        ${
          isUploading
            ? "cursor-not-allowed"
            : "cursor-pointer hover:border-blue-400 hover:bg-blue-50"
        }`}
        onClick={!preview && !isUploading ? triggerFileInput : undefined}
      >
        {!preview ? (
          <>
            <div className="flex flex-col items-center justify-center space-y-3">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div className="text-lg font-medium text-gray-700">
                {isDragging ? "Drop to upload" : "Drag and drop files here"}
              </div>
              <div className="text-sm text-gray-500">
                or{" "}
                <span className="text-blue-500 font-medium">browse files</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Accepted formats: {allowedFormats.join(", ")} (Max: {maxSizeMB}
                MB)
              </div>
            </div>
          </>
        ) : (
          <div className="preview-container">
            <div className="relative">
              <img
                src={preview}
                alt="Upload preview"
                className="max-h-64 mx-auto rounded-md object-contain"
              />
              {!isUploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetUpload();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {preview && !isUploading && (
        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            onClick={resetUpload}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={triggerFileInput}
            className="px-3 py-1.5 bg-blue-500 rounded text-sm text-white hover:bg-blue-600"
          >
            Choose Another
          </button>
        </div>
      )}
    </div>
  );
}
