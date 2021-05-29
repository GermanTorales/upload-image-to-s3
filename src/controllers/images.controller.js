import httpStatus from 'http-status';
import { loggerError } from '../config/winstonConfig';
import { ImagesService } from '../services';

export default class ImagesController {
  constructor() {
    this.imagesService = new ImagesService();

    this.handleNewImage = this.handleNewImage.bind(this);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
  }

  /**
   * Handle upload image to s3
   * @param {object} req Request object
   * @param {object} res Response object
   * @returns {Promise<object>}
   * @memberof ImagesController
   */
  async handleNewImage(req, res) {
    try {
      const imageData = req.file;
      const newImage = await this.imagesService.uploadImage(imageData);

      return res.status(httpStatus.OK).json({ data: newImage });
    } catch (error) {
      return res.status(httpStatus.NOT_FOUND).json(error);
    }
  }

  /**
   * Handle delete image from s3
   * @param {object} req Request object
   * @param {object} res Response object
   * @return {void} void
   * @memberof ImagesController
   */
  async handleDeleteImage(req, res) {
    try {
      const { s3UrlId } = req.body;
      await this.imagesService.deleteImage(s3UrlId);

      return res.status(httpStatus.OK).json({ data: 'Image deleted' });
    } catch (error) {
      loggerError.error({ error, location: 'images.controller.handleDeleteImage' });
      return res.status(httpStatus.NOT_FOUND).json(error);
    }
  }
}
