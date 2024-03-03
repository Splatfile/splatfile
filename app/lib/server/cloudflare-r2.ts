import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v1 as uuidVer1 } from "uuid";

type R2Client = S3Client;

export const createR2Client = () => {
  const CLOUDFLARE_R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const CLOUDFLARE_R2_SECRET_ACCESS_KEY =
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

  if (
    !CLOUDFLARE_R2_ACCOUNT_ID ||
    !CLOUDFLARE_R2_ACCESS_KEY_ID ||
    !CLOUDFLARE_R2_SECRET_ACCESS_KEY
  ) {
    throw new Error(
      `CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY must be defined`,
    );
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  }) as R2Client;
};

export const uploadFile = async (
  client: R2Client,
  file: Buffer,
  filename: string,
) => {
  const CLOUDFLARE_R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET;
  const CLOUDFLARE_R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL;
  if (!CLOUDFLARE_R2_BUCKET || !CLOUDFLARE_R2_PUBLIC_URL) {
    throw new Error(
      `CLOUDFLARE_R2_BUCKET, CLOUDFLARE_R2_PUBLIC_URL must be defined`,
    );
  }

  const key = `${uuidVer1()}-${encodeURIComponent(filename)}`;

  const command = new PutObjectCommand({
    Bucket: CLOUDFLARE_R2_BUCKET,
    Key: key,
    Body: file,
  });

  await client.send(command);

  return `${CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
};
