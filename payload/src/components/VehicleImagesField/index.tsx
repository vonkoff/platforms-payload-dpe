// src/components/VehicleImagesField.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@payloadcms/ui";
import { UIFieldClient } from "payload";
import { useDocumentInfo } from "@payloadcms/ui";
import "./index.scss";

interface VehicleImage {
  name: string;
  url: string;
}

export const VehicleImagesField: React.FC<
  UIFieldClient & {
    path?: string;
    schemaPath?: string;
    permissions?: any;
    data?: Record<string, any>;
  }
> = (props) => {
  const { path } = props;
  const { id, initialData } = useDocumentInfo();

  const [images, setImages] = useState<VehicleImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [documentData, setDocumentData] = useState<Record<string, any> | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const documentId = id || "";
  const vin =
    (documentData?.vin as string) || (initialData?.vin as string) || "";
  const dealerId =
    (documentData?.dealerId as string) ||
    (initialData?.dealerId as string) ||
    "";

  const R2_PUBLIC_URL = "https://vehicle-images.dealerproedge.com";

  useEffect(() => {
    const fetchDocumentData = async () => {
      if (
        documentId &&
        (!initialData || !initialData.vin || !initialData.dealerId)
      ) {
        try {
          const response = await fetch(`/api/vehicles/${documentId}`);
          const data = await response.json();
          setDocumentData(data.doc);
        } catch (error) {
          console.error("Error fetching document data:", error);
        }
      } else if (initialData) {
        setDocumentData(initialData);
      }
    };

    console.log("DocumentInfo:", { id, initialData, path });
    fetchDocumentData();

    if (vin && dealerId && documentId) {
      fetchImages();
    }
  }, [documentId, initialData, vin, dealerId]);

  const fetchImages = async () => {
    if (!documentId) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/vehicles/${documentId}/images/list`);
      const responseData = await response.json();
      console.log("Fetch images response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to fetch images");
      }

      const imageList = (responseData.images || []).map((img: string) => ({
        name: img,
        url: `${R2_PUBLIC_URL}/${dealerId}/${vin}/${img}`,
      }));

      // Sort images numerically based on the filename number
      const sortedImageList = imageList.sort((a, b) => {
        const numA = parseInt(a.name.split(".")[0], 10); // Extract number from "X.jpg"
        const numB = parseInt(b.name.split(".")[0], 10);
        return numA - numB; // Ascending order
      });

      setImages(sortedImageList);
    } catch (error) {
      console.error("Error fetching images:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : String(error) || "Error loading images",
      );
    }
    setIsLoading(false);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !vin || !dealerId || !documentId) return;

    const fileCount = images.length + 1;
    const fileName = `${fileCount}.jpg`;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);

      const response = await fetch(
        `/api/vehicles/${documentId}/images/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const responseData = await response.json();
      console.log("Upload response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Upload failed");
      }

      await fetchImages();
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : String(error) || "Error uploading image",
      );
    }
  };

  const handleDelete = async (imageName: string) => {
    if (!vin || !dealerId || !documentId) return;

    try {
      const response = await fetch(
        `/api/vehicles/${documentId}/images/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: imageName }),
        },
      );
      const responseData = await response.json();
      console.log("Delete response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Delete failed");
      }

      await fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : String(error) || "Error deleting image",
      );
    }
  };

  if (!documentId) {
    return (
      <div>
        <p>Please save the document first to manage images</p>
        <div
          style={{ marginTop: "1rem", padding: "1rem", background: "#f5f5f5" }}
        >
          <h4>Debug Info:</h4>
          <pre>
            {JSON.stringify(
              {
                id: id ?? "Not found",
                vin: initialData?.vin ?? "Not found",
                dealerId: initialData?.dealerId ?? "Not found",
                documentData,
                initialData,
              },
              null,
              2,
            )}
          </pre>
        </div>
      </div>
    );
  }

  if (!vin || !dealerId) {
    return (
      <div>
        <p>
          Please provide VIN and Dealer ID and save the document to manage
          images
        </p>
        <div
          style={{ marginTop: "1rem", padding: "1rem", background: "#f5f5f5" }}
        >
          <h4>Debug Info:</h4>
          <pre>
            {JSON.stringify(
              {
                id: documentId,
                vin: vin || "Not found",
                dealerId: dealerId || "Not found",
                documentData,
                initialData,
              },
              null,
              2,
            )}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicle-images-field">
      <h3>Vehicle Images</h3>
      {isLoading ? (
        <div>Loading images...</div>
      ) : errorMessage ? (
        <div style={{ color: "red" }}>{errorMessage}</div>
      ) : (
        <>
          <div className="image-grid">
            {images.map((image) => (
              <div key={image.name} className="image-item">
                <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                  {image.name}
                </div>
                <img src={image.url} alt={image.name} />
                <Button
                  size="small"
                  buttonStyle="secondary"
                  onClick={() => handleDelete(image.name)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
          <div className="upload-section">
            <label htmlFor="image-upload">Add New Image:</label>
            <input
              type="file"
              id="image-upload"
              accept="image/jpeg"
              onChange={handleUpload}
            />
          </div>
        </>
      )}
    </div>
  );
};
