import AWS from 'aws-sdk';
import Axios from 'axios';
import { s3Config } from '../config/envVariables.js';
import { getContentType, buildImageUrlQuery, getImageExtensionFromURL } from '../helpers/functions/images.helper.js';
import { getImageDimensionsFromBuffer, cleanUrl } from '../helpers/functions/images.helper';

export default class CloudStorageService {
  constructor() {
    AWS.config.update({
      accessKeyId: s3Config.accessKeyId,
      secretAccessKey: s3Config.secretAccessKey,
    });

    this.s3 = new AWS.S3({ signatureVersion: 'v4', region: s3Config.region });

    this.uploadImage = this.uploadImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  /**
   * Get url uploaded and pre signed by s3
   * @param {string} Key name that you want to reserve for the url
   * @param {string} ContentType file mime type
   * @returns {Promise<string>} Url pre signed
   * @memberof CloudStorageService
   */
  async getPreSignedUploadUrl(Key, ContentType) {
    const assignedUrl = await this.s3.getSignedUrl('putObject', {
      Bucket: s3Config.bucket,
      Key,
      ContentType,
      Expires: 86400,
    });

    return assignedUrl;
  }

  /**
   * Upload file to s3
   * @param {Buffer} file File type buffer
   * @param {string} s3Url S3 Url pre signed
   * @param {string} mime File mimetype
   * @returns {Promise<string> | throw}
   * @memberof CloudStorageService
   */
  async uploadToS3(file, s3Url, mime) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await Axios.put(s3Url, file, { headers: { 'Content-Type': mime } });

        resolve(data.config.url);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Funtion to delete an object from s3 bucket
   * @param {string} filename S3 file name
   * @returns {Promise<void>} void
   * @memberof CloudStorageService
   */
  async deleteFromS3(filename) {
    const params = { Bucket: s3Config.bucket, Key: filename };

    return new Promise((resolve, reject) => {
      try {
        this.s3.deleteObject(params, error => {
          if (error) throw new Error(error.message);

          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Function to prepare the upload of the image to s3
   * @param {Buffer} file Image in buffer format
   * @param {string} url Image url
   * @param {string} mimetype Image mimetype [image/png | image/jpg | image/jpeg]
   * @param {ImageTypes} type Image type [front, back, other, etc]
   * @returns {Promise<object>} Image partia object
   * @memberof CloudStorageService
   */
  async uploadImage(file, url, mimetype) {
    try {
      const extension = getImageExtensionFromURL(url);
      const { width, height, type: mime } = await getImageDimensionsFromBuffer(file);

      if (!mimetype) mimetype = extension ? getContentType(extension) : getContentType(mime);

      const urlQuery = buildImageUrlQuery(width, height, mime);
      const urlPreSigned = await this.getPreSignedUploadUrl(urlQuery, mimetype);
      const completeUrl = await this.uploadToS3(file, urlPreSigned, mimetype);
      const s3Url = cleanUrl(completeUrl);

      return { url: s3Url, width, height, s3ImageKey: urlQuery };
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Delete image from s3
   * @param {string} filename S3 image name
   * @returns {Promise<void>} void
   * @memberof CloudStorageService
   */
  async deleteImage(filename) {
    try {
      await this.deleteFromS3(filename);
    } catch (error) {
      throw new Error(error);
    }
  }
}
