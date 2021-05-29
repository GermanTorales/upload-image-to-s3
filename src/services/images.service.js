import { CloudStorageService } from '.';

export default class ImagesService {
  constructor() {
    this.cloudStorageService = new CloudStorageService();

    this.uploadImage = this.uploadImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  /**
   * Upload image to s3
   * @param {{buffer: Buffer, mimetype: string}} imageData
   * @return {Promise<object>}
   * @memberof ImagesService
   */
  async uploadImage(imageData) {
    return new Promise(async (resolve, reject) => {
      try {
        const { buffer, mimetype } = imageData;
        const imageUploaded = await this.cloudStorageService.uploadImage(buffer, null, mimetype);

        resolve(imageUploaded);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Delete image from s3 by s3 key
   * @param {string} s3UrlId S3 generate key
   * @return {Promise<void>} void
   * @memberof ImagesService
   */
  async deleteImage(s3UrlId) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.cloudStorageService.deleteImage(s3UrlId);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
