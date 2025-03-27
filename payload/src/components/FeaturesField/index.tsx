"use client";
import React, { useCallback, useMemo, memo } from "react";
import { useField, useForm, useFormFields } from "@payloadcms/ui";

// Define the shape of each feature item
interface FeatureItem {
  id: string;
  feature: string;
}

// Memoized Feature component for display
const Feature = memo(
  ({
    id,
    value,
    onRemove,
    index,
  }: {
    id: string;
    value: string;
    onRemove: (index: number) => void;
    index: number;
  }) => (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        padding: "8px 12px",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
        border: "1px solid #e5e5e5",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          fontWeight: "500",
          cursor: "default",
          color: "#333",
        }}
      >
        {value}
      </span>
      <button
        onClick={() => onRemove(index)}
        type="button"
        style={{
          border: "none",
          backgroundColor: "#e2e2e2",
          color: "#666",
          padding: "2px 6px",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: "bold",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "20px",
          transition: "all 0.2s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#d32f2f";
          e.currentTarget.style.color = "white";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#e2e2e2";
          e.currentTarget.style.color = "#666";
        }}
      >
        ×
      </button>
    </div>
  ),
);
Feature.displayName = "Feature";

export const FeaturesField: React.FC<{
  path: string;
  readOnly?: boolean;
  value?: FeatureItem[];
  field: any;
}> = ({ path, readOnly, value: propValue, field }) => {
  const label = typeof field.label === "string" ? field.label : "Features";

  //TODO: Add back in once finally adding in virtualfield from vehicles collection
  // if (readOnly) {
  //   const displayValue = propValue || [];
  //   return (
  //     <div style={{ marginBottom: "32px" }}>
  //       <div>HI!</div>
  //       <h4
  //         style={{
  //           fontSize: "16px",
  //           fontWeight: "600",
  //           color: "#333",
  //           marginBottom: "16px",
  //           paddingBottom: "8px",
  //           borderBottom: "1px solid #eaeaea",
  //         }}
  //       >
  //         {label}
  //       </h4>
  //       <div style={{ marginTop: "16px" }}>
  //         {displayValue.map((item, index) => (
  //           <div key={index} style={{ marginBottom: "8px" }}>
  //             {item.feature}
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  const { rows } = useField({ path, hasRows: true });
  const { dispatchFields, setModified } = useForm();
  const [newFeatureValue, setNewFeatureValue] = React.useState("");

  const features =
    useFormFields(([fields]) =>
      rows?.map((row, index) => ({
        id: row.id,
        value: fields[`${path}.${index}.feature`]?.value || "",
      })),
    ) || [];

  const handleAddFeature = useCallback(() => {
    if (!newFeatureValue.trim()) return;

    dispatchFields({
      type: "ADD_ROW",
      path,
      subFieldState: {
        feature: { value: newFeatureValue.trim() },
      },
    });
    setNewFeatureValue("");
    setModified(true);
  }, [dispatchFields, path, newFeatureValue, setModified]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddFeature();
      }
    },
    [handleAddFeature],
  );

  const handleRemoveFeature = useCallback(
    (index: number) => {
      dispatchFields({
        type: "REMOVE_ROW",
        path,
        rowIndex: index,
      });
      setModified(true);
    },
    [dispatchFields, path, setModified],
  );

  const featureList = useMemo(
    () => (
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          minHeight: features.length === 0 ? "0" : "40px",
        }}
      >
        {features.map((feature, index) => (
          <Feature
            key={feature.id}
            id={feature.id}
            value={feature.value as string}
            onRemove={handleRemoveFeature}
            index={index}
          />
        ))}
      </div>
    ),
    [features, handleRemoveFeature],
  );

  const categoryName = label.split(" ")[0].toLowerCase();

  return (
    <div
      style={{
        marginBottom: "32px",
        padding: "16px",
        backgroundColor: "#fafafa",
        borderRadius: "8px",
        border: "1px solid #eaeaea",
      }}
    >
      <h4
        style={{
          fontSize: "16px",
          fontWeight: "600",
          color: "#333",
          marginBottom: "16px",
          paddingBottom: "8px",
          borderBottom: "1px solid #eaeaea",
        }}
      >
        {label}
      </h4>
      <div
        style={{
          marginTop: "16px",
          marginBottom: "16px",
        }}
      >
        {featureList}
      </div>
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={newFeatureValue}
          onChange={(e) => setNewFeatureValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={`Add a ${categoryName} feature`}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
            width: "260px",
            transition: "border-color 0.3s ease",
            outline: "none",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#0070f3";
            e.target.style.boxShadow = "0 0 0 3px rgba(0, 112, 243, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#ccc";
            e.target.style.boxShadow = "none";
          }}
        />
        <button
          onClick={handleAddFeature}
          type="button"
          disabled={!newFeatureValue.trim()}
          style={{
            backgroundColor: newFeatureValue.trim() ? "#0070f3" : "#e0e0e0",
            color: newFeatureValue.trim() ? "white" : "#999",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: newFeatureValue.trim() ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            if (newFeatureValue.trim()) {
              e.currentTarget.style.backgroundColor = "#0060df";
            }
          }}
          onMouseOut={(e) => {
            if (newFeatureValue.trim()) {
              e.currentTarget.style.backgroundColor = "#0070f3";
            }
          }}
        >
          Add Feature
        </button>
      </div>
    </div>
  );
};

export default memo(FeaturesField);
