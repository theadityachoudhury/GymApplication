
export const AWS_REGION = process.env.AWS_REGION || 'eu-west-2';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const MONGODB_URI = process.env.MONGO_URI;
export const USER_IMAGES_BUCKET = process.env.USER_IMAGES_BUCKET;