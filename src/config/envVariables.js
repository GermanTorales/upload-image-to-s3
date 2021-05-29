import dotenv from 'dotenv';
dotenv.config();

const { PORT } = process.env;
const { AWS_BUCKET_NAME, AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_REGION } = process.env;

export const server_port = PORT || '3000';
export const s3Config = {
  bucket: AWS_BUCKET_NAME,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
};
