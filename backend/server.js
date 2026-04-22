const express = require('express');
const cors = require('cors');
const { Op } = require('sequelize');
const PayOS = require('@payos/node');
const { sequelize, Product, Collection, Order, UserProfile, Address, BankAccount, Voucher, Review } = require('./db');

const payos = new PayOS(
  "8211ac4e-c9f2-4e32-bfce-51644188496a",
  "fcccc68b-f427-4477-8c83-636d4bba00f0",
  "0a9b4713ed34ed1ee7bbe635380ca172dc5983b92d00609e1d6ea5dfb079d917"
);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Cho phép React Native gọi API
app.use(express.json()); // Parse JSON body

// =============================================
// API ENDPOINTS
// =============================================

// ---------- SẢN PHẨM ----------

// Lấy tất cả sản phẩm
app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let whereClause = {};

    if (category) {
      whereClause.category = category;
    }

    if (search) {
      whereClause.name = {
        [Op.like]: `%${search}%`
      };
    }

    const result = await Product.findAll({ where: whereClause });

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// Lấy sản phẩm theo ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// ---------- ĐÁNH GIÁ (REVIEWS) ----------

// Lấy danh sách đánh giá của 1 sản phẩm
app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// Thêm đánh giá mới
app.post('/api/products/:id/reviews', async (req, res) => {
  try {
    const { userId, userName, rating, comment } = req.body;
    const productId = req.params.id;

    if (!userId || !userName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin đánh giá' });
    }

    const newReview = await Review.create({
      productId,
      userId,
      userName,
      rating,
      comment,
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// ---------- BỘ SƯU TẬP ----------

// Lấy tất cả bộ sưu tập
app.get('/api/collections', async (req, res) => {
  try {
    const result = await Collection.findAll();
    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// Lấy bộ sưu tập theo ID
app.get('/api/collections/:id', async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bộ sưu tập',
      });
    }

    res.json({
      success: true,
      data: collection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// ---------- ĐƠN HÀNG ----------

// Tạo đơn hàng mới
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, total, shipping, paymentMethod } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin đơn hàng',
      });
    }

    const newOrder = await Order.create({
      id: `order_${Date.now()}`,
      userId,
      items,
      total,
      shipping,
      paymentMethod: paymentMethod || 'COD',
      status: paymentMethod === 'COD' ? 'shipping' : 'pending',
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: 'Đơn hàng đã được tạo thành công!',
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// Lấy 1 đơn hàng cụ thể để check trạng thái (Dành cho Polling Webhook)
app.get('/api/orders/single/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success: false });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Lấy đơn hàng theo userId
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const userOrders = await Order.findAll({ where: { userId: req.params.userId } });

    res.json({
      success: true,
      count: userOrders.length,
      data: userOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// Cập nhật trạng thái đơn hàng
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    if (!['pending', 'shipping', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// PAYOS API
app.post('/api/orders/:id/payment-link', async (req, res) => {
  try {
    const orderIdStr = req.params.id;
    const numericId = Number(orderIdStr.replace('order_', '')); // Extract number from order_171...

    const order = await Order.findByPk(orderIdStr);
    if (!order) return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });

    // The host below should be updated to App scheme if you want deep linking back
    const body = {
      orderCode: numericId,
      amount: order.total,
      description: orderIdStr.substring(0, 25),
      cancelUrl: 'https://velmora.vn/cancel',
      returnUrl: 'https://velmora.vn/success'
    };

    const paymentLinkRes = await payos.createPaymentLink(body);
    res.json({ success: true, checkoutUrl: paymentLinkRes.checkoutUrl, qrCode: paymentLinkRes.qrCode, data: paymentLinkRes });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message || 'Lỗi PayOS' });
  }
});

app.post('/api/payos/webhook', async (req, res) => {
  try {
    const webhookData = payos.verifyPaymentWebhookData(req.body);
    console.log("PAYOS WEBHOOK RECEIVED:", webhookData);
    
    if (webhookData && webhookData.orderCode) {
      const orderId = `order_${webhookData.orderCode}`;
      const order = await Order.findByPk(orderId);
      
      // PayOS webhook sends 'code' = '00' for success payment
      if (order && webhookData.code === "00") {
        order.status = 'shipping'; // Update payment success
        await order.save();
        console.log(`ORDER ${orderId} UPDATED TO SHIPPING VIA WEBHOOK`);
      }
    }
    res.json({ success: true });
  } catch (e) {
    console.error("WEBHOOK ERROR:", e);
    // Vẫn return 200 để PayOS không gửi lại nhiều lần
    res.json({ success: true });
  }
});

// ---------- ĐỊA CHỈ & HỒ SƠ ----------

// Lấy hồ sơ user (payment method)
app.get('/api/users/:userId/profile', async (req, res) => {
  try {
    let profile = await UserProfile.findByPk(req.params.userId);
    if (!profile) {
      profile = await UserProfile.create({ userId: req.params.userId, defaultPaymentMethod: 'COD' });
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// Cập nhật payment method
app.post('/api/users/:userId/payment', async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    let profile = await UserProfile.findByPk(req.params.userId);
    if (!profile) {
      profile = await UserProfile.create({ userId: req.params.userId, defaultPaymentMethod: paymentMethod });
    } else {
      profile.defaultPaymentMethod = paymentMethod;
      await profile.save();
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// Lấy danh sách địa chỉ
app.get('/api/users/:userId/addresses', async (req, res) => {
  try {
    const addresses = await Address.findAll({ where: { userId: req.params.userId } });
    res.json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// Thêm địa chỉ mới
app.post('/api/users/:userId/addresses', async (req, res) => {
  try {
    const { name, phone, address, isDefault } = req.body;
    const userId = req.params.userId;
    
    // Nếu là default, bỏ default các cái cũ
    if (isDefault) {
      await Address.update({ isDefault: false }, { where: { userId } });
    }

    const newAddress = await Address.create({ userId, name, phone, address, isDefault });
    res.status(201).json({ success: true, data: newAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// Đặt địa chỉ làm số default
app.put('/api/users/:userId/addresses/:id/default', async (req, res) => {
  try {
    const { userId, id } = req.params;
    await Address.update({ isDefault: false }, { where: { userId } });
    await Address.update({ isDefault: true }, { where: { id, userId } });
    res.json({ success: true, message: 'Đã cập nhật địa chỉ mặc định' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// ---------- NGÂN HÀNG (BANK ACCOUNTS) ----------

// Lấy danh sách ngân hàng
app.get('/api/users/:userId/banks', async (req, res) => {
  try {
    const banks = await BankAccount.findAll({ where: { userId: req.params.userId } });
    res.json({ success: true, data: banks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// Thêm ngân hàng mới
app.post('/api/users/:userId/banks', async (req, res) => {
  try {
    const { bankName, accountNumber, accountName, isDefault } = req.body;
    const userId = req.params.userId;
    
    // Nếu là default, bỏ default các cái cũ
    if (isDefault) {
      await BankAccount.update({ isDefault: false }, { where: { userId } });
    }

    const newBank = await BankAccount.create({ userId, bankName, accountNumber, accountName, isDefault });
    res.status(201).json({ success: true, data: newBank });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// Đặt ngân hàng làm mặc định
app.put('/api/users/:userId/banks/:id/default', async (req, res) => {
  try {
    const { userId, id } = req.params;
    await BankAccount.update({ isDefault: false }, { where: { userId } });
    await BankAccount.update({ isDefault: true }, { where: { id, userId } });
    res.json({ success: true, message: 'Đã cập nhật ngân hàng mặc định' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// ---------- VOUCHER & STATS ----------

app.get('/api/vouchers/count', async (req, res) => {
  try {
    const count = await Voucher.count();
    res.json({ success: true, data: count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

app.get('/api/users/:userId/orders/count', async (req, res) => {
  try {
    const count = await Order.count({ where: { userId: req.params.userId } });
    res.json({ success: true, data: count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error });
  }
});

// ---------- SERVER INFO ----------

app.get('/', (req, res) => {
  res.json({
    name: 'Jewelry Shop API',
    version: '1.0.0 (MySQL Version)',
    endpoints: {
      products: 'GET /api/products',
      productById: 'GET /api/products/:id',
      productsByCategory: 'GET /api/products?category=NHẪN',
      searchProducts: 'GET /api/products?search=kim cương',
      collections: 'GET /api/collections',
      createOrder: 'POST /api/orders',
      ordersByUser: 'GET /api/orders/:userId',
    },
  });
});

// Khởi động server trên 0.0.0.0 để điện thoại thật có thể kết nối
app.listen(PORT, '0.0.0.0', async () => {
  const os = require('os');
  const nets = os.networkInterfaces();
  let localIP = 'localhost';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        localIP = net.address;
        break;
      }
    }
  }

  try {
    await sequelize.sync();
    const prodCount = await Product.count();
    const colCount = await Collection.count();
    
    const voucherCount = await Voucher.count();
    if (voucherCount === 0) {
      await Voucher.bulkCreate([
        { code: 'GIAM50K', discount: 50000, description: 'Giảm 50K cho đơn từ 1 Tr', expiryDate: '2026-12-31' },
        { code: 'GIAM100K', discount: 100000, description: 'Giảm 100K cho đơn từ 5 Tr', expiryDate: '2026-12-31' },
        { code: 'VIP200K', discount: 200000, description: 'Voucher Thành Viên VIP', expiryDate: '2027-01-01' },
      ]);
      console.log('🌱 Đã chèn dữ liệu Voucher mẫu vào DB');
    }

    const reviewCount = await Review.count();
    if (reviewCount === 0) {
      await Review.bulkCreate([
        { productId: 'p1', userId: 'user_1', userName: 'Trần Vũ', rating: 5, comment: 'Dây chuyền rất sáng và đẹp, vợ mình rất thích!', createdAt: new Date(Date.now() - 1000000) },
        { productId: 'p1', userId: 'user_2', userName: 'Nguyễn Thị Hoa', rating: 4.5, comment: 'Chất liệu tốt, tuy nhiên giao hàng hơi lâu một chút xíu.', createdAt: new Date(Date.now() - 500000) },
        { productId: 'p1', userId: 'user_3', userName: 'Hoàng Anh', rating: 5, comment: 'Sản phẩm tinh xảo, xứng đáng từng đồng tiền bát gạo.', createdAt: new Date() },
        { productId: 'p2', userId: 'user_4', userName: 'Lê Thủy', rating: 5, comment: 'Đá kim cương nhân tạo nhưng sáng lấp lánh như thật, khuyên dùng nhé.', createdAt: new Date() }
      ]);
      console.log('🌱 Đã chèn dữ liệu Đánh Giá (Review) mẫu vào DB');
    }

    console.log('');
    console.log('🚀 ═══════════════════════════════════════════');
    console.log(`   Jewelry Shop API đang chạy! (Đã kết nối MySQL)`);
    console.log(`   Local:   http://localhost:${PORT}`);
    console.log(`   Network: http://${localIP}:${PORT}`);
    console.log('   ───────────────────────────────────────────');
    console.log(`   📦 Sản phẩm:    ${prodCount} sản phẩm`);
    console.log(`   🎨 Bộ sưu tập:  ${colCount} bộ sưu tập`);
    console.log('═══════════════════════════════════════════════');
    console.log('');
  } catch (error) {
    console.error('Lỗi khởi động Server:', error);
  }
});
