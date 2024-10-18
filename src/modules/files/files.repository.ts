import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
const toStream = require('buffer-to-stream');
@Injectable()
export class FilesRepository {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new BadRequestException(`Error uploading image file.`));
          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async removeSingleImage(publicId: string): Promise<Object> {
    try {
      await v2.uploader.destroy(publicId);
      return { message: 'Image removed successfully.' };
    } catch (error) {
      throw new BadRequestException(`Asset with ${publicId} ID didn't exist.`);
    }
  }

  async removeMultipleImages() {}
}
