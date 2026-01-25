import { memoryStorage, diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = uuidv4();
      callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  limits: {
    fieldSize: 100 * 1024 * 1024,
    fileSize: 100 * 1024 * 1024,
    parts: 100,
  },
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx)$/)) {
      return callback(
        new Error('Only image and document files are allowed!'),
        false,
      );
    }
    callback(null, true);
  },
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const name = uuidv4();
    const extension = extname(file.originalname);
    callback(null, `${name}${extension}`);
  },
});
