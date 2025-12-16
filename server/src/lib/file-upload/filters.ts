import { BadRequestException } from '@nestjs/common';

export type FileFilterFn = (
  req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => void;

export function combineFilters(...filters: FileFilterFn[]): FileFilterFn {
  return (req, file, cb) => {
    let called = false;
    const chainCb: typeof cb = (err, accept) => {
      if (called) return;
      if (err || !accept) {
        called = true;
        return cb(err, accept);
      }
    };

    for (const filter of filters) {
      filter(req, file, chainCb);
      if (called) return;
    }

    cb(null, true);
  };
}
export function imageFilter(...args: Parameters<FileFilterFn>) {
  const [_req, file, cb] = args;
  if (!file.mimetype.startsWith('image/')) {
    return cb(new BadRequestException('Only images are allowed'), false);
  }
  cb(null, true);
}

export function maxFileSize(size: number): FileFilterFn {
  return (req, file, cb) => {
    if (file.size > size) {
      return cb(
        new BadRequestException(`File must be less than ${size} bytes`),
        false,
      );
    }
    cb(null, true);
  };
}
