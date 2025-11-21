import { promises as fs } from 'fs';
import path from 'path';
import { supabase } from '../core/services/supabase.service';

const CATEGORY_BUCKET = 'category-images';
const categoriesDir = path.resolve(
  __dirname,
  '../../..',
  'frontend',
  'public',
  'assets',
  'image',
  'categories',
);

const filesToUpload: Array<{ slug: string; filename: string }> = [
  { slug: 'protein', filename: 'ProteinCategories.webp' },
  { slug: 'gida', filename: 'GidaCategories.webp' },
  { slug: 'spor-gidalari', filename: 'SporCategories.webp' },
  { slug: 'saglik', filename: 'SaglikCategories.webp' },
  { slug: 'vitamin', filename: 'VitaminCategories.webp' },
  { slug: 'tum-urunler', filename: 'TumUrun.webp' },
];

async function uploadCategoryImages() {
  console.log('Kategori görselleri Supabase bucketına yükleniyor...');

  for (const fileInfo of filesToUpload) {
    const localPath = path.join(categoriesDir, fileInfo.filename);
    const fileBuffer = await fs.readFile(localPath);
    const remoteFileName = `${fileInfo.slug}.webp`;

    const { error: uploadError } = await supabase.storage
      .from(CATEGORY_BUCKET)
      .upload(remoteFileName, fileBuffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadError) {
      console.error(
        `✖ ${fileInfo.filename} -> ${remoteFileName} yüklenemedi:`,
        uploadError.message,
      );
      continue;
    }

    const { data: publicData } = supabase.storage
      .from(CATEGORY_BUCKET)
      .getPublicUrl(remoteFileName);

    console.log(`✔ ${fileInfo.filename} yüklendi. URL: ${publicData.publicUrl}`);
  }

  console.log('Yükleme işlemi tamamlandı.');
}

uploadCategoryImages().catch((error) => {
  console.error('Kategori görselleri yüklenirken hata oluştu:', error);
  process.exit(1);
});

