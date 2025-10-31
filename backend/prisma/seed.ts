import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

const categoriesData = [
    { name: 'Protein', slug: 'protein' },
    { name: 'Spor Gıdaları', slug: 'spor-gidalari' },
    { name: 'Sağlık', slug: 'saglik' },
    { name: 'Gıda', slug: 'gida' },
    { name: 'Vitamin', slug: 'vitamin' },
    { name: 'Aksesuar', slug: 'aksesuar' },
    { name: 'Paketler', slug: 'paketler' },
];

// Tip güvenliği için ürün verisi arayüzü
type ProductSeedData = {
    name: string;
    slug: string;
    short_explanation: string;
    price: number;
    discounted_price?: number;
    discount_percentage?: number;
    images: string[];
    categorySlug: string;
    comment_count: number;
    average_star: number;
    stock: number;
    isBestseller: boolean;
};

const productsData: ProductSeedData[] = [
    {
        name: 'Whey Isolate',
        slug: 'whey-isolate',
        short_explanation: '%90 Proteinli En Saf Whey',
        price: 749.00,
        images: ['https://fe1111.projects.academy.onlyjs.com/media/whey-isolate_400_biscuit.webp'],
        categorySlug: 'protein',
        comment_count: 5,
        average_star: 4.5,
        stock: 50,
        isBestseller: true,
    },
    {
        name: 'Whey Protein',
        slug: 'whey-protein',
        short_explanation: 'En Saf Whey',
        price: 494.10,
        discounted_price: 494.1,
        discount_percentage: 10,
        images: ['https://fe1111.projects.academy.onlyjs.com/media/whey-protein_400_biscuit.webp'],
        categorySlug: 'protein',
        comment_count: 3,
        average_star: 5,
        stock: 100,
        isBestseller: true,
    },
    {
        name: 'Pea Protein',
        slug: 'pea-protein',
        short_explanation: 'En Popüler Vegan Protein Kaynağı',
        price: 282.69,
        discounted_price: 282.69,
        discount_percentage: 19,
        images: ['https://fe1111.projects.academy.onlyjs.com/media/pea-protein_400_strawberry.webp'],
        categorySlug: 'protein',
        comment_count: 16,
        average_star: 5,
        stock: 80,
        isBestseller: false,
    },
    {
        name: 'Micellar Casein',
        slug: 'micellar-casein',
        short_explanation: 'Yavaş Sindirilen Protein Kaynağı',
        price: 599.00,
        images: ['https://fe1111.projects.academy.onlyjs.com/media/micellar-casein_400_strawberry.webp'],
        categorySlug: 'protein',
        comment_count: 0,
        average_star: 0,
        stock: 40,
        isBestseller: false,
    },
    {
        name: 'Egg White Powder',
        slug: 'egg-white-powder',
        short_explanation: 'Proteinin Altın Standartı',
        price: 899.00,
        images: ['https://fe1111.projects.academy.onlyjs.com/media/egg-white-powder_400_natural.webp'],
        categorySlug: 'protein',
        comment_count: 0,
        average_star: 0,
        stock: 30,
        isBestseller: false,
    },
    {
        name: 'Milk Protein',
        slug: 'milk-protein',
        short_explanation: '%80 Kazein, %20 Whey Proteini',
        price: 699.00,
        images: ['https://fe1111.projects.academy.onlyjs.com/media/pro-protein_400_strawberry.webp'],
        categorySlug: 'protein',
        comment_count: 0,
        average_star: 0,
        stock: 35,
        isBestseller: false,
    },
    {
        name: 'Soya Protein',
        slug: 'soya-protein',
        short_explanation: 'Vegan Protein Kaynağı',
        price: 449.00,
        images: ['https://fe1111.projects.academy.onlyjs.com/media/soya-protein_400_strawberry.webp'],
        categorySlug: 'protein',
        comment_count: 0,
        average_star: 0,
        stock: 65,
        isBestseller: false,
    },
    {
        name: 'Collagen',
        slug: 'collagen',
        short_explanation: 'Vücuttaki En Bol Protein',
        price: 449.00,
        images: ['https://fe1111.projects.academy.onlyjs.com/media/collagen_300_natural.webp'],
        categorySlug: 'saglik',
        comment_count: 0,
        average_star: 0,
        stock: 70,
        isBestseller: true,
    },
    {
        name: 'Mass Gainer',
        slug: 'mass-gainer',
        short_explanation: 'Yüksek Kalorili Pratik Öğün',
        price: 839.16,
        discounted_price: 839.16,
        discount_percentage: 16,
        images: ['https://fe1111.projects.academy.onlyjs.com/media/mass-gainer_2500_strawberry.webp'],
        categorySlug: 'spor-gidalari',
        comment_count: 0,
        average_star: 0,
        stock: 25,
        isBestseller: true,
    },
    {
        name: 'Vegan Gainer',
        slug: 'vegan-gainer',
        short_explanation: 'Veganlar İçin Yüksek Proteinli ve Kalorili Öğün',
        price: 999.00,
        images: ['https://fe1111.projects.academy.onlyjs.com/media/vegan-gainer_2500_strawberry.webp'],
        categorySlug: 'spor-gidalari',
        comment_count: 0,
        average_star: 0,
        stock: 20,
        isBestseller: false,
    },
    {
        name: 'Creatine',
        slug: 'creatine',
        short_explanation: 'En Popüler Sporcu Takviyesi',
        price: 239.00,
        images: ['https://fe1111.projects.academy.onlyjs.com/media/creatine_120_.webp'],
        categorySlug: 'spor-gidalari',
        comment_count: 3,
        average_star: 4,
        stock: 200,
        isBestseller: true,
    },
    {
        name: 'Creatine Creapure',
        slug: 'creatine-creapure',
        short_explanation: 'Patentli Alman Hammadde',
        price: 539.10,
        discounted_price: 539.1,
        discount_percentage: 10,
        images: ['https://fe1111.projects.academy.onlyjs.com/media/creatine-creapure_250_natural.webp'],
        categorySlug: 'spor-gidalari',
        comment_count: 0,
        average_star: 0,
        stock: 150,
        isBestseller: false,
    },
    {
        name: 'Cream of Rice',
        slug: 'cream-of-rice',
        short_explanation: 'En lezzetli pirinç kreması',
        price: 239.00,
        images: ['https://fe1111.projects.academy.onlyjs.com/media/cream-of-rice_1000_chocolate.webp'],
        categorySlug: 'gida',
        comment_count: 6543,
        average_star: 4.8,
        stock: 120,
        isBestseller: false,
    },
];

async function main() {
    console.log('Tohumlama işlemi başlıyor...');

    console.log('Mevcut veriler siliniyor...');
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    console.log('Mevcut veriler silindi.');

    console.log('Kategoriler oluşturuluyor...');
    const categoryMap = new Map<string, Category['id']>();
    for (const category of categoriesData) {
        const newCategory: Category = await prisma.category.create({
            data: category,
        });
        categoryMap.set(newCategory.slug, newCategory.id);
        console.log(`- ${newCategory.name} oluşturuldu.`);
    }
    console.log('Kategoriler başarıyla oluşturuldu.');

    console.log('Ürünler oluşturuluyor...');
    for (const product of productsData) {
        const categoryId = categoryMap.get(product.categorySlug);
        if (categoryId) {
            await prisma.product.create({
                data: {
                    name: product.name,
                    slug: product.slug,
                    short_explanation: product.short_explanation,
                    price: product.price,
                    discounted_price: product.discounted_price,
                    discount_percentage: product.discount_percentage,
                    comment_count: product.comment_count,
                    average_star: product.average_star,
                    images: product.images,
                    stock: product.stock,
                    isBestseller: product.isBestseller,
                    categoryId: categoryId,
                },
            });
            console.log(`- ${product.name} ürünü oluşturuldu.`);
        } else {
            console.warn(`- Uyarı: "${product.name}" için "${product.categorySlug}" kategorisi bulunamadı. Ürün atlandı.`);
        }
    }
    console.log('Ürünler başarıyla oluşturuldu.');

    console.log('Tohumlama işlemi başarıyla tamamlandı.');
}

main()
    .catch((e) => {
        console.error('Tohumlama sırasında bir hata oluştu:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


