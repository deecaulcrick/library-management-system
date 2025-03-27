// Cloudinary configuration
"use client";

import { CldUploadWidget } from "next-cloudinary";

/**
 * A component that provides a Cloudinary upload widget
 * @param {Object} props - Component props
 * @param {Function} props.onUpload - Function called when upload is complete
 * @param {React.ReactNode} props.children - Button or element to trigger the upload widget
 * @returns {React.ReactElement} - Upload widget component
 */
export function CloudinaryUploadWidget({ onUpload, children }) {
  return (
    <CldUploadWidget
      uploadPreset="library_uploads" // You'll need to create this preset in your Cloudinary dashboard
      options={{
        maxFiles: 1,
        resourceType: "image",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        maxFileSize: 2000000, // 2MB
      }}
      onSuccess={(result, { widget }) => {
        onUpload(result.info.secure_url);
        widget.close();
      }}
    >
      {children}
    </CldUploadWidget>
  );
}
