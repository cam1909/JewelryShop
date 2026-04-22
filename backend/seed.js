const { sequelize, Product, Collection } = require('./db');
const { products, collections } = require('./data');

async function runSeed() {
  try {
    console.log('🔄 Đang đồng bộ cấu trúc Database...');
    // Xóa bảng cũ nếu có và tạo lại toàn bộ
    await sequelize.sync({ force: true });
    console.log('✅ Đã tạo các bảng (Products, Collections, Orders) thành công!');

    console.log(`🔄 Đang nạp ${products.length} sản phẩm và ${collections.length} bộ sưu tập...`);
    
    // Nạp Products
    await Product.bulkCreate(products);
    
    // Nạp Collections
    await Collection.bulkCreate(collections);
    
    console.log('🎉 Seed dữ liệu thành công! (Dữ liệu từ data.js đã được chuyển vào MySQL)');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi nạp dữ liệu:', error);
    process.exit(1);
  }
}

runSeed();
