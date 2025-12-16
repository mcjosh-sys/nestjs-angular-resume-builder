import fs from 'fs';
import { unlink } from 'fs/promises';
import { diskStorage } from 'multer';
import path, { extname } from 'path';

const baseDestinationPath = path.join(process.cwd(), 'uploads');

function createDirIfNotExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

createDirIfNotExists(baseDestinationPath);

export function getStorage(filePath?: string) {
  let destinationPath = baseDestinationPath;
  if (filePath) {
    destinationPath = path.join(baseDestinationPath, filePath);
    createDirIfNotExists(destinationPath);
  }
  return diskStorage({
    destination: destinationPath,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
}

export async function deleteFile(filename: string, filepath = 'resume-photos') {
  const fullpath = path.join(baseDestinationPath, filepath, filename);
  try {
    if (fs.existsSync(fullpath)) {
      console.log({ fullpath });
      await unlink(fullpath);
    }
  } catch (err) {
    console.error(`Failed to delete file ${fullpath}:`, err);
  }
}

export function generateFileUrl(
  filename: string,
  path: string = 'resume-photos',
) {
  const baseUrl = process.env.BASE_URL;
  return `${baseUrl}/${path}/${filename}`;
}
