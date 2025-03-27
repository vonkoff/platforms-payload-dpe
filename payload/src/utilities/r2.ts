import { S3Client } from "@aws-sdk/client-s3";

export const getR2Client = () => {
  return new S3Client({
    region: "auto",
    endpoint: `${process.env.R2_ENDPOINT}`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY!,
      secretAccessKey: process.env.R2_SECRET_KEY!,
    },
  });
};
