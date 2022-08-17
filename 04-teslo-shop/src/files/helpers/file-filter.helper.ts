import { Request } from 'express';

export const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
    if (!file) {
        return cb(new Error('File empty'), false);
    }

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png'];

    if (validExtensions.includes(fileExtension.toLowerCase())) {
        return cb(null, true);
    }

    cb(null, false);
}