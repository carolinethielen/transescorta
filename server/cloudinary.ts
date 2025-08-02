import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dfdzhyosd',
  api_key: '368975572136879',
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'transescorta', // All uploads go to this folder
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 1200, crop: 'limit' }, // Max size
      { quality: 'auto' }, // Auto quality optimization
      { fetch_format: 'auto' } // Auto format optimization
    ]
  } as any
});

// Profile image storage with different transformations
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'transescorta/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'fill', gravity: 'face' }, // Square profile images
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  } as any
});

// Chat image storage - smaller sizes
const chatStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'transescorta/chat',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1000, height: 1000, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  } as any
});

// Multer upload configurations
export const uploadProfile = multer({
  storage: profileStorage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
});

export const uploadChat = multer({
  storage: chatStorage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit for chat images
  },
});

export const uploadGeneral = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
});

// Private album storage with higher quality
export const uploadPrivateAlbum = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'transescorta/private-albums',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { width: 1800, height: 1800, crop: 'limit' }, // Higher quality for private albums
        { quality: 'auto:best' }, // Best quality
        { fetch_format: 'auto' }
      ]
    } as any
  }),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
});

// Utility functions
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image: ${publicId}`);
  } catch (error) {
    console.error(`Error deleting image ${publicId}:`, error);
    throw error;
  }
};

export const getOptimizedUrl = (publicId: string, width?: number, height?: number): string => {
  return cloudinary.url(publicId, {
    width: width || 500,
    height: height || 500,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  });
};

export { cloudinary };