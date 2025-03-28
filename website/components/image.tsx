import React from "react";
import { Image as UnpicImage } from "@unpic/react";

export interface CustomImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  layout?: "constrained" | "fullWidth" | "fixed";
  aspectRatio?: number;
  [key: string]: any;
}

export const CF_IMAGE_URL = "https://media.dealerproedge.com";
export const CF_DOMAIN = "media.dealerproedge.com";

const Image: React.FC<CustomImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  quality = 75,
  priority = false,
  layout = "constrained",
  aspectRatio,
  ...rest
}) => {
  const baseProps = {
    src: `${CF_IMAGE_URL}/${src}`,
    alt,
    cdn: "cloudflare" as const,
    options: { cloudflare: { domain: CF_DOMAIN } },
    operations: {
      cloudflare: {
        format: "auto" as const,
        metadata: "none" as const,
        quality,
        // TODO: Check over and see why cache is missing sometimes
        // Said to add the below but not sure if wise to do so
        // fit: 'cover' as const, // Explicitly set fit mode
      },
    },
    priority,
    className,
    ...rest,
  };

  // Full width layout only requires aspectRatio if height is not provided
  if (layout === "fullWidth") {
    if (!height && !aspectRatio) {
      console.warn(
        "Either height or aspectRatio is required for fullWidth layout",
      );
      return null;
    }
    return (
      <UnpicImage
        {...baseProps}
        layout="fullWidth"
        height={height}
        aspectRatio={aspectRatio}
      />
    );
  }

  // Both constrained and fixed layouts require width and height
  if (!width || !height) {
    console.warn(
      "Both width and height are required for constrained and fixed layouts",
    );
    return null;
  }

  // Render constrained layout
  if (layout === "constrained") {
    return (
      <UnpicImage
        {...baseProps}
        layout="constrained"
        width={width}
        height={height}
      />
    );
  }

  // Render fixed layout
  return (
    <UnpicImage {...baseProps} layout="fixed" width={width} height={height} />
  );
};

export default Image;
