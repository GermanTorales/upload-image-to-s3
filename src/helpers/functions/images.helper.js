import sizeOf from 'image-size';
import { v4 as uuid } from 'uuid';
import { MimeTypes, ImageExtension } from '../constants/';

/**
 * Get the image extension from url [jpg | jpeg | png | gif]
 * @param {string | null} url Image url
 * @return {string | null} Extension
 */
export const getImageExtensionFromURL = url => {
  const match = url?.match(ImageExtension);

  if (!match) return null;

  const [, extension] = match;

  return extension.replace('.', '');
};

/**
 * Get image dimensions from buffer
 * @param {Buffer} image Image buffer
 * @returns {{width: number, height: number, type: string}} Image dimensions
 */
export const getImageDimensionsFromBuffer = async image => sizeOf(image);

/**
 * Get file content type
 * @param {string} extension File extension
 * @returns {string} Content type
 */
export const getContentType = extension => MimeTypes[extension.toUpperCase()];

/**
 *  Build url query to save in s3
 * @param {number} width Image width
 * @param {number} height Image height
 * @param {string} extension image extension
 * @returns {string} Url to save in s3
 */
export const buildImageUrlQuery = (width, height, extension) => `images/${uuid()}/${width}x${height}.${extension}`;

/**
 * Remove query params from s3 url
 * @param {string} url S3 url
 * @returns {string} Url without query params
 */
export const cleanUrl = url => url?.substring(0, url.indexOf('?'));
