// src/elements/Dashboard/MissingPostsGroup/loading.tsx
import React from "react";
import { Loader } from "lucide-react";

import "./index.scss";

export const MissingPostsLoading: React.FC = () => {
  return (
    <div className="dashboard__group missing-posts-group loading">
      <p className="dashboard__label">
        <Loader
          size={16}
          style={{ marginRight: "8px", verticalAlign: "middle" }}
          className="animate-spin"
        />
        Checking Posts Status...
      </p>
    </div>
  );
};
