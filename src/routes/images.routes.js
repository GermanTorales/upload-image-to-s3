import express from 'express';
import { loggerInfo } from '../config/winstonConfig.js';
import { ImagesController } from '../controllers/index.js';
import { upload } from '../middlewares/Multer/upload_image.js';

const addImagesRoutes = app => {
  const controller = new ImagesController();
  const router = express.Router();

  app.use('/api/images', router);

  router.post('/', upload.single('image'), controller.handleNewImage);
  router.delete('/', controller.handleDeleteImage);

  loggerInfo.info(`Images routes - OK`)
};

export default addImagesRoutes;
