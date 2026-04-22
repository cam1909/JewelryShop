const { Sequelize, DataTypes } = require('sequelize');

// Khởi tạo kết nối Sequelize (dùng thông tin mặc định của XAMPP)
const sequelize = new Sequelize('jewelry_shop', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // tắt log query cho đỡ rối console
});

// Định nghĩa Model Product
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true, // dùng string id từ data mock
  },
  name: DataTypes.STRING,
  category: DataTypes.STRING,
  price: DataTypes.FLOAT,
  originalPrice: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  rating: DataTypes.FLOAT,
  reviews: DataTypes.INTEGER,
  badge: {
    type: DataTypes.STRING,
    allowNull: true
  },
  badgeType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  inStock: DataTypes.BOOLEAN,
  description: DataTypes.TEXT,
}, { timestamps: false });

// Định nghĩa Model Collection
const Collection = sequelize.define('Collection', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  subtitle: DataTypes.STRING,
  description: DataTypes.TEXT,
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, { timestamps: false });

// Định nghĩa Model Order
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  userId: DataTypes.STRING,
  items: DataTypes.JSON,     // Lưu mảng sản phẩm dưới dạng JSON cực kì tiện lợi
  total: DataTypes.FLOAT,
  shipping: DataTypes.FLOAT,
  paymentMethod: DataTypes.STRING,
  status: DataTypes.STRING,
  createdAt: DataTypes.STRING, // Dùng string dạng ISO string cho đơn giản theo mock
}, { timestamps: false });

// Định nghĩa Model UserProfile
const UserProfile = sequelize.define('UserProfile', {
  userId: { type: DataTypes.STRING, primaryKey: true },
  defaultPaymentMethod: { type: DataTypes.STRING, defaultValue: 'COD' }
}, { timestamps: false });

// Định nghĩa Model Address
const Address = sequelize.define('Address', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  isDefault: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: false });

// Định nghĩa Model BankAccount
const BankAccount = sequelize.define('BankAccount', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  bankName: { type: DataTypes.STRING, allowNull: false },
  accountNumber: { type: DataTypes.STRING, allowNull: false },
  accountName: { type: DataTypes.STRING, allowNull: false },
  isDefault: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: false });

// Định nghĩa Model Voucher
const Voucher = sequelize.define('Voucher', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  discount: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true },
  expiryDate: { type: DataTypes.STRING, allowNull: true } // Lưu dạng date ISO string đơn giản
}, { timestamps: false });

// Định nghĩa Model Review
const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  productId: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.STRING, allowNull: false },
  userName: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 5 },
  comment: { type: DataTypes.TEXT, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { timestamps: false });

module.exports = {
  sequelize,
  Product,
  Collection,
  Order,
  UserProfile,
  Address,
  BankAccount,
  Voucher,
  Review
};
