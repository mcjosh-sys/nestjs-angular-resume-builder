import { PrismaClient } from '@/lib/generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function flushResume() {
  await prisma.workExperience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.resume.deleteMany();
  console.log('Resumes flushed');
}

flushResume();
