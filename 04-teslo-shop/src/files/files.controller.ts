import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/file-filter.helper';
import { fileNamer } from './helpers/file-namer.helper';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  findProductImage(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getStatisProductImage(imageName);
    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: {
    //   fileSize: 100
    // },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    }),
  }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {

    if (!file) {
      throw new BadRequestException('Make sure that file is an image');
    }

    const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;

    return {
      secureUrl
    };
  }
}