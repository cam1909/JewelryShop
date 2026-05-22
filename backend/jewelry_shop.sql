-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 22, 2026 at 10:17 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jewelry_shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `isDefault` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `userId`, `name`, `phone`, `address`, `isDefault`) VALUES
(2, 'vFDqEPXds9fpySkwghRBqgIHst93', 'Quỳnh Anh', '+84962977820', '123, Phường Ngọc Khánh, Quận Ba Đình, Thành phố Hà Nội', 1),
(3, 's4kWoEq0WkVUypKpWtoCWuAtovD2', 'Quỳnh Anh', '0962977820', '235 Hoàng Quốc Việt , Phường Nghĩa Đô, Quận Cầu Giấy, Thành phố Hà Nội', 1);

-- --------------------------------------------------------

--
-- Table structure for table `bankaccounts`
--

CREATE TABLE `bankaccounts` (
  `id` int(11) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `bankName` varchar(255) NOT NULL,
  `accountNumber` varchar(255) NOT NULL,
  `accountName` varchar(255) NOT NULL,
  `isDefault` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bankaccounts`
--

INSERT INTO `bankaccounts` (`id`, `userId`, `bankName`, `accountNumber`, `accountName`, `isDefault`) VALUES
(1, 's4kWoEq0WkVUypKpWtoCWuAtovD2', 'Techcombank', '0123', 'TRAN QUYNH ANH', 1),
(2, 's4kWoEq0WkVUypKpWtoCWuAtovD2', 'VietinBank', '4567', 'TRAN QUYNH ANH', 0);

-- --------------------------------------------------------

--
-- Table structure for table `collections`
--

CREATE TABLE `collections` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `collections`
--

INSERT INTO `collections` (`id`, `title`, `subtitle`, `description`, `image`) VALUES
('1', 'Bộ Sưu Tập Mùa Xuân', '12 sản phẩm', 'Những thiết kế mới nhất lấy cảm hứng từ hoa xuân', NULL),
('2', 'Trang Sức Cưới', '24 sản phẩm', 'Bộ sưu tập dành riêng cho ngày trọng đại', NULL),
('3', 'Kim Cương Tự Nhiên', '18 sản phẩm', 'Vẻ đẹp vĩnh cửu từ thiên nhiên', NULL),
('4', 'Ngọc Trai Biển Đông', '9 sản phẩm', 'Tinh hoa từ đại dương Việt Nam', NULL),
('5', 'Vàng Ý 18K', '32 sản phẩm', 'Đẳng cấp châu Âu với chất liệu thượng hạng', NULL),
('6', 'Minimalist', '15 sản phẩm', 'Đơn giản nhưng tinh tế cho phong cách hiện đại', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` varchar(255) NOT NULL,
  `userId` varchar(255) DEFAULT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`items`)),
  `total` float DEFAULT NULL,
  `shipping` float DEFAULT NULL,
  `paymentMethod` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `createdAt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `userId`, `items`, `total`, `shipping`, `paymentMethod`, `status`, `createdAt`) VALUES
('order_1776836075928', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"1\",\"name\":\"Dây Chuyền Hoa Vàng Rực Rỡ\",\"category\":\"DÂY CHUYỀN\",\"price\":4500000,\"originalPrice\":5500000,\"rating\":4.5,\"reviews\":124,\"badge\":\"-18%\",\"badgeType\":\"sale\",\"image\":26,\"inStock\":true,\"description\":\"Dây chuyền được chế tác từ vàng 18K nguyên khối với họa tiết hoa tinh xảo, mỗi cánh hoa được đánh bóng tỉ mỉ để bắt sáng tự nhiên dưới mọi ánh đèn. Thiết kế mang đậm phong cách nữ tính, nhẹ nhàng nhưng vẫn nổi bật, rất phù hợp để diện trong những buổi hẹn hò lãng mạn hay các sự kiện sang trọng. Sợi dây được gia công bằng công nghệ Ý, đảm bảo độ bền cao và không gây kích ứng da. Đây là món quà ý nghĩa dành tặng người phụ nữ bạn yêu thương.\",\"quantity\":1,\"selectedSize\":\"default\"}]', 4550000, 50000, 'BANK_1', 'cancelled', '2026-04-22T05:34:35.928Z'),
('order_1776844482451', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"10\",\"name\":\"Dây Chuyền Vàng Ý 18K\",\"category\":\"DÂY CHUYỀN\",\"price\":7200000,\"originalPrice\":null,\"rating\":4.7,\"reviews\":156,\"badge\":null,\"badgeType\":null,\"image\":27,\"inStock\":true,\"description\":\"Dây chuyền vàng Ý 18K chính hãng với kiểu đan dây tinh xảo theo phong cách châu Âu, mang đến vẻ đẹp sang trọng mà không hề cầu kỳ. Sợi dây có trọng lượng vừa phải, đeo nhẹ nhàng thoải mái suốt cả ngày dài mà không gây vướng víu. Bề mặt vàng được xử lý đánh bóng kết hợp phun cát, tạo hiệu ứng ánh sáng hai tông độc đáo và bắt mắt. Sản phẩm có thể đeo đơn hoặc kết hợp với mặt dây chuyền tùy theo sở thích cá nhân, linh hoạt cho mọi phong cách thời trang.\",\"quantity\":2,\"selectedSize\":\"default\"}]', 100, 0, 'BANK_TRANSFER', 'cancelled', '2026-04-22T07:54:42.451Z'),
('order_1776845026343', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"10\",\"name\":\"Dây Chuyền Vàng Ý 18K\",\"price\":7200000,\"image\":27,\"quantity\":3,\"selectedSize\":\"Mặc định\"}]', 100, 0, 'BANK_TRANSFER', 'cancelled', '2026-04-22T08:03:46.343Z'),
('order_1776845394317', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"10\",\"name\":\"Dây Chuyền Vàng Ý 18K\",\"price\":7200000,\"image\":27,\"quantity\":1,\"selectedSize\":\"Mặc định\"}]', 2000, 50000, 'BANK_TRANSFER', 'completed', '2026-04-22T08:09:54.317Z'),
('order_1776847253405', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"1\",\"name\":\"Dây Chuyền Hoa Vàng Rực Rỡ\",\"category\":\"DÂY CHUYỀN\",\"price\":4500000,\"originalPrice\":5500000,\"rating\":4.5,\"reviews\":124,\"badge\":\"-18%\",\"badgeType\":\"sale\",\"image\":{\"uri\":\"/assets/?unstable_path=.%2Fassets%2Fimages%2Fproducts/day1.jpg\",\"width\":600,\"height\":700},\"inStock\":true,\"description\":\"Dây chuyền được chế tác từ vàng 18K nguyên khối với họa tiết hoa tinh xảo, mỗi cánh hoa được đánh bóng tỉ mỉ để bắt sáng tự nhiên dưới mọi ánh đèn. Thiết kế mang đậm phong cách nữ tính, nhẹ nhàng nhưng vẫn nổi bật, rất phù hợp để diện trong những buổi hẹn hò lãng mạn hay các sự kiện sang trọng. Sợi dây được gia công bằng công nghệ Ý, đảm bảo độ bền cao và không gây kích ứng da. Đây là món quà ý nghĩa dành tặng người phụ nữ bạn yêu thương.\",\"quantity\":1,\"selectedSize\":\"default\"}]', 2000, 50000, 'BANK_TRANSFER', 'completed', '2026-04-22T08:40:53.405Z'),
('order_1776853753305', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"1\",\"name\":\"Dây Chuyền Hoa Vàng Rực Rỡ\",\"price\":4500000,\"image\":{\"uri\":\"/assets/?unstable_path=.%2Fassets%2Fimages%2Fproducts/day1.jpg\",\"width\":600,\"height\":700},\"quantity\":1,\"selectedSize\":\"Mặc định\"}]', 2000, 50000, 'BANK_TRANSFER', 'completed', '2026-04-22T10:29:13.305Z'),
('order_1776854014657', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"1\",\"name\":\"Dây Chuyền Hoa Vàng Rực Rỡ\",\"price\":4500000,\"image\":{\"uri\":\"/assets/?unstable_path=.%2Fassets%2Fimages%2Fproducts/day1.jpg\",\"width\":600,\"height\":700},\"quantity\":1,\"selectedSize\":\"Mặc định\"}]', 2000, 50000, 'BANK_TRANSFER', 'completed', '2026-04-22T10:33:34.657Z'),
('order_1776854938500', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"16\",\"name\":\"Bông Tai Kim Cương Tròn\",\"category\":\"BÔNG TAI\",\"price\":19500000,\"originalPrice\":null,\"rating\":4.8,\"reviews\":78,\"badge\":null,\"badgeType\":null,\"image\":{\"uri\":\"/assets/?unstable_path=.%2Fassets%2Fimages%2Fproducts/bongtai4.jpg\",\"width\":600,\"height\":700},\"inStock\":true,\"description\":\"Đôi bông tai kim cương tròn brilliant cổ điển với tổng trọng lượng 0.6 carat, mỗi bên một viên kim cương trong veo như giọt sương mai. Kim cương đạt tiêu chuẩn quốc tế với độ sạch VS2 và màu E-F, đảm bảo độ lấp lánh tối đa dưới mọi điều kiện ánh sáng. Ổ chấu 4 chấu vàng trắng 18K thiết kế tối giản để viên kim cương được tôn vinh trọn vẹn, không bị che khuất bởi kim loại. Sản phẩm đi kèm giấy kiểm định kim cương GIA cho mỗi viên, là khoản đầu tư xứng đáng cho vẻ đẹp vĩnh cửu.\",\"quantity\":1,\"selectedSize\":\"default\"}]', 2000, 0, 'BANK_TRANSFER', 'completed', '2026-04-22T10:48:58.500Z'),
('order_1776856309414', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"17\",\"name\":\"Bông Tai Vàng Hoa Mai\",\"category\":\"BÔNG TAI\",\"price\":4800000,\"originalPrice\":5600000,\"rating\":4.6,\"reviews\":145,\"badge\":\"-14%\",\"badgeType\":\"sale\",\"image\":39,\"inStock\":true,\"description\":\"Đôi bông tai vàng 18K với thiết kế hoa mai năm cánh truyền thống Việt Nam, kết hợp hài hòa giữa nét văn hóa dân tộc và phong cách trang sức hiện đại. Mỗi cánh hoa được chạm khắc tỉ mỉ bằng tay, bề mặt kết hợp giữa phần đánh bóng sáng và phần phun cát mờ tạo chiều sâu nghệ thuật. Kích thước vừa phải, nhẹ nhàng chỉ 2.5 gram mỗi bên, đeo thoải mái suốt cả ngày mà không gây nặng tai. Rất thích hợp để đeo trong dịp Tết, lễ hội hay khi mặc áo dài truyền thống, tôn lên nét đẹp dịu dàng của phụ nữ Việt.\",\"quantity\":1,\"selectedSize\":\"Size 18\"}]', 2000, 50000, 'BANK_TRANSFER', 'completed', '2026-04-22T11:11:49.414Z'),
('order_1776856675765', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"16\",\"name\":\"Bông Tai Kim Cương Tròn\",\"price\":19500000,\"image\":{\"uri\":\"/assets/?unstable_path=.%2Fassets%2Fimages%2Fproducts/bongtai4.jpg\",\"width\":600,\"height\":700},\"quantity\":1,\"selectedSize\":\"Mặc định\"}]', 2000, 0, 'BANK_TRANSFER', 'completed', '2026-04-22T11:17:55.765Z'),
('order_1776868417859', 'vFDqEPXds9fpySkwghRBqgIHst93', '[{\"id\":\"23\",\"name\":\"Bộ Trang Sức Ngọc Trai Akoya\",\"category\":\"BỘ TRANG SỨC\",\"price\":35000000,\"originalPrice\":42000000,\"rating\":4.9,\"reviews\":34,\"badge\":\"-17%\",\"badgeType\":\"sale\",\"image\":48,\"inStock\":true,\"description\":\"Bộ trang sức ngọc trai Akoya Nhật Bản bao gồm dây chuyền 45cm, đôi bông tai stud và lắc tay 18cm, tất cả được làm từ ngọc trai Akoya thượng hạng đường kính 7-8mm. Ngọc trai Akoya nổi tiếng với độ bóng gương sáng rỡ, ánh xà cừ hồng phấn nhẹ nhàng, được xem là loại ngọc trai đẹp nhất thế giới. Phần kim loại hoàn toàn bằng vàng trắng 18K, đánh bóng sáng loáng, tôn lên màu sắc tự nhiên của ngọc trai. Bộ trang sức này phù hợp cho những dịp quan trọng như đám cưới, tiệc tối, hay làm quà tặng đặc biệt cho mẹ, vợ và những người phụ nữ bạn yêu quý nhất.\",\"quantity\":1,\"selectedSize\":\"Size 14\"}]', 2000, 0, 'BANK_TRANSFER', 'cancelled', '2026-04-22T14:33:37.859Z'),
('order_1779427275940', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"12\",\"name\":\"Nhẫn Cưới Vàng Trắng\",\"category\":\"NHẪN\",\"price\":9500000,\"originalPrice\":11000000,\"rating\":4.8,\"reviews\":312,\"badge\":\"-14%\",\"badgeType\":\"sale\",\"image\":33,\"inStock\":true,\"description\":\"Nhẫn cưới vàng trắng 18K thiết kế tối giản nhưng đầy ý nghĩa, với đường viền sáng bóng tượng trưng cho tình yêu bền vững và không bao giờ phai nhạt. Bề mặt nhẫn được đánh bóng gương hoàn hảo, phản chiếu ánh sáng dịu dàng và tinh tế. Mặt trong được khắc laser dòng chữ \\\"Forever\\\" cùng biểu tượng trái tim nhỏ, thêm phần lãng mạn cho ngày trọng đại. Nhẫn có nhiều size từ 6 đến 22, phù hợp cho cả nam và nữ, là cặp nhẫn cưới được yêu thích nhất tại cửa hàng với hơn 300 đánh giá tích cực.\",\"quantity\":1,\"selectedSize\":\"default\"}]', 2000, 50000, 'BANK_TRANSFER', 'cancelled', '2026-05-22T05:21:15.940Z'),
('order_1779428550252', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"17\",\"name\":\"Bông Tai Vàng Hoa Mai\",\"price\":4800000,\"image\":39,\"quantity\":1,\"selectedSize\":\"Mặc định\"}]', 2000, 50000, 'BANK_TRANSFER', 'shipping', '2026-05-22T05:42:30.252Z'),
('order_1779428781770', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"16\",\"name\":\"Bông Tai Kim Cương Tròn\",\"price\":19500000,\"image\":{\"uri\":\"/assets/?unstable_path=.%2Fassets%2Fimages%2Fproducts/bongtai4.jpg\",\"width\":600,\"height\":700},\"quantity\":1,\"selectedSize\":\"Mặc định\"}]', 2000, 0, 'BANK_TRANSFER', 'cancelled', '2026-05-22T05:46:21.770Z'),
('order_1779428926929', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"16\",\"name\":\"Bông Tai Kim Cương Tròn\",\"price\":19500000,\"image\":{\"uri\":\"/assets/?unstable_path=.%2Fassets%2Fimages%2Fproducts/bongtai4.jpg\",\"width\":600,\"height\":700},\"quantity\":1,\"selectedSize\":\"Mặc định\"}]', 2000, 0, 'BANK_TRANSFER', 'shipping', '2026-05-22T05:48:46.929Z'),
('order_1779435555984', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"16\",\"name\":\"Bông Tai Kim Cương Tròn\",\"price\":19500000,\"image\":{\"uri\":\"/assets/?unstable_path=.%2Fassets%2Fimages%2Fproducts/bongtai4.jpg\",\"width\":600,\"height\":700},\"quantity\":1,\"selectedSize\":\"Mặc định\"}]', 19500000, 0, 'BANK_TRANSFER', 'cancelled', '2026-05-22T07:39:15.984Z'),
('order_1779436052940', 's4kWoEq0WkVUypKpWtoCWuAtovD2', '[{\"id\":\"16\",\"name\":\"Bông Tai Kim Cương Tròn\",\"price\":19500000,\"image\":{\"uri\":\"/assets/?unstable_path=.%2Fassets%2Fimages%2Fproducts/bongtai4.jpg\",\"width\":600,\"height\":700},\"quantity\":2,\"selectedSize\":\"Mặc định\"}]', 2000, 0, 'BANK_TRANSFER', 'shipping', '2026-05-22T07:47:32.940Z');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `originalPrice` float DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `reviews` int(11) DEFAULT NULL,
  `badge` varchar(255) DEFAULT NULL,
  `badgeType` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `inStock` tinyint(1) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category`, `price`, `originalPrice`, `rating`, `reviews`, `badge`, `badgeType`, `image`, `inStock`, `description`) VALUES
('1', 'Dây Chuyền Hoa Vàng Rực Rỡ', 'DÂY CHUYỀN', 4500000, 5500000, 4.5, 124, '-18%', 'sale', 'products/day1.jpg', 1, 'Dây chuyền được chế tác từ vàng 18K nguyên khối với họa tiết hoa tinh xảo, mỗi cánh hoa được đánh bóng tỉ mỉ để bắt sáng tự nhiên dưới mọi ánh đèn. Thiết kế mang đậm phong cách nữ tính, nhẹ nhàng nhưng vẫn nổi bật, rất phù hợp để diện trong những buổi hẹn hò lãng mạn hay các sự kiện sang trọng. Sợi dây được gia công bằng công nghệ Ý, đảm bảo độ bền cao và không gây kích ứng da. Đây là món quà ý nghĩa dành tặng người phụ nữ bạn yêu thương.'),
('10', 'Dây Chuyền Vàng Ý 18K', 'DÂY CHUYỀN', 7200000, NULL, 4.7, 156, NULL, NULL, 'products/day2.jpg', 1, 'Dây chuyền vàng Ý 18K chính hãng với kiểu đan dây tinh xảo theo phong cách châu Âu, mang đến vẻ đẹp sang trọng mà không hề cầu kỳ. Sợi dây có trọng lượng vừa phải, đeo nhẹ nhàng thoải mái suốt cả ngày dài mà không gây vướng víu. Bề mặt vàng được xử lý đánh bóng kết hợp phun cát, tạo hiệu ứng ánh sáng hai tông độc đáo và bắt mắt. Sản phẩm có thể đeo đơn hoặc kết hợp với mặt dây chuyền tùy theo sở thích cá nhân, linh hoạt cho mọi phong cách thời trang.'),
('11', 'Dây Chuyền Ruby Hình Tim', 'DÂY CHUYỀN', 15800000, NULL, 4.6, 28, 'MỚI', 'new', 'products/day5.jpg', 1, 'Mặt dây chuyền hình trái tim được đính viên ruby đỏ rực thiên nhiên, biểu tượng cho tình yêu nồng nàn và mãnh liệt. Viên ruby được lựa chọn cẩn thận với màu đỏ máu bồ câu quý hiếm, tỏa sáng rực rỡ dưới ánh nắng mặt trời. Khung mặt dây được chế tác từ vàng trắng 14K, viền xung quanh đính thêm những viên kim cương nhỏ li ti tạo nên vầng hào quang lấp lánh. Đây là món trang sức mang ý nghĩa sâu sắc, thích hợp làm quà tặng sinh nhật, kỷ niệm ngày cưới hay Valentine cho người phụ nữ đặc biệt.'),
('12', 'Nhẫn Cưới Vàng Trắng', 'NHẪN', 9500000, 11000000, 4.8, 312, '-14%', 'sale', 'products/nhan2.jpg', 1, 'Nhẫn cưới vàng trắng 18K thiết kế tối giản nhưng đầy ý nghĩa, với đường viền sáng bóng tượng trưng cho tình yêu bền vững và không bao giờ phai nhạt. Bề mặt nhẫn được đánh bóng gương hoàn hảo, phản chiếu ánh sáng dịu dàng và tinh tế. Mặt trong được khắc laser dòng chữ \"Forever\" cùng biểu tượng trái tim nhỏ, thêm phần lãng mạn cho ngày trọng đại. Nhẫn có nhiều size từ 6 đến 22, phù hợp cho cả nam và nữ, là cặp nhẫn cưới được yêu thích nhất tại cửa hàng với hơn 300 đánh giá tích cực.'),
('13', 'Nhẫn Đính Sapphire Xanh', 'NHẪN', 22000000, NULL, 4.9, 67, NULL, NULL, 'products/nhan3.jpg', 1, 'Viên sapphire xanh Ceylon hình oval nặng 1.2 carat tỏa sáng rực rỡ trên nền vàng trắng 18K, mang đến vẻ đẹp vương giả đầy cuốn hút. Hai bên viên đá chủ được đính thêm các viên kim cương tấm xếp hình tam giác, tạo nên tổng thể cân đối và hài hòa. Sapphire thiên nhiên từ Sri Lanka nổi tiếng với màu xanh royal blue đặc trưng, tượng trưng cho trí tuệ và sự thịnh vượng. Sản phẩm có giấy chứng nhận đá quý quốc tế, là món trang sức đẳng cấp cho những người phụ nữ yêu thích sự khác biệt và tinh tế.'),
('14', 'Nhẫn Vàng Hồng Minimalist', 'NHẪN', 5800000, NULL, 4.4, 189, NULL, NULL, 'products/nhan1.jpg', 1, 'Nhẫn vàng hồng 14K với thiết kế minimalist thanh lịch, dành cho những cô gái yêu thích sự đơn giản mà vẫn muốn toát lên nét nữ tính dịu dàng. Thân nhẫn mảnh mai chỉ 1.5mm nhưng cứng cáp nhờ công nghệ ép khuôn hiện đại, giữ form tốt sau thời gian dài sử dụng. Màu vàng hồng ấm áp rất hợp với làn da châu Á, dễ phối với nhiều loại trang phục từ casual đến thanh lịch. Có thể đeo đơn lẻ để tạo điểm nhấn tinh tế hoặc xếp chồng nhiều chiếc cùng lúc theo xu hướng stacking rings thời thượng.'),
('15', 'Nhẫn Đôi Cưới Platinum', 'NHẪN', 38000000, NULL, 5, 23, 'MỚI', 'new', 'products/nhan6.jpg', 1, 'Cặp nhẫn cưới platinum cao cấp nhất dành cho những cặp đôi trân trọng giá trị vĩnh hằng của tình yêu. Chất liệu platinum 950 nguyên chất không pha tạp, có độ bền vượt trội so với vàng, không bị oxy hóa hay đổi màu theo thời gian. Nhẫn nam có thiết kế mạnh mẽ với bề mặt matte kết hợp đường rãnh sáng bóng ở giữa, nhẫn nữ thanh mảnh đính một hàng kim cương li ti lấp lánh. Mỗi chiếc nhẫn đều được khắc tên và ngày cưới miễn phí, cùng hộp đựng nhung cao cấp và giấy bảo hành trọn đời.'),
('16', 'Bông Tai Kim Cương Tròn', 'BÔNG TAI', 19500000, NULL, 4.8, 78, NULL, NULL, 'products/bongtai4.jpg', 1, 'Đôi bông tai kim cương tròn brilliant cổ điển với tổng trọng lượng 0.6 carat, mỗi bên một viên kim cương trong veo như giọt sương mai. Kim cương đạt tiêu chuẩn quốc tế với độ sạch VS2 và màu E-F, đảm bảo độ lấp lánh tối đa dưới mọi điều kiện ánh sáng. Ổ chấu 4 chấu vàng trắng 18K thiết kế tối giản để viên kim cương được tôn vinh trọn vẹn, không bị che khuất bởi kim loại. Sản phẩm đi kèm giấy kiểm định kim cương GIA cho mỗi viên, là khoản đầu tư xứng đáng cho vẻ đẹp vĩnh cửu.'),
('17', 'Bông Tai Vàng Hoa Mai', 'BÔNG TAI', 4800000, 5600000, 4.6, 145, '-14%', 'sale', 'products/bongtai2.jpg', 1, 'Đôi bông tai vàng 18K với thiết kế hoa mai năm cánh truyền thống Việt Nam, kết hợp hài hòa giữa nét văn hóa dân tộc và phong cách trang sức hiện đại. Mỗi cánh hoa được chạm khắc tỉ mỉ bằng tay, bề mặt kết hợp giữa phần đánh bóng sáng và phần phun cát mờ tạo chiều sâu nghệ thuật. Kích thước vừa phải, nhẹ nhàng chỉ 2.5 gram mỗi bên, đeo thoải mái suốt cả ngày mà không gây nặng tai. Rất thích hợp để đeo trong dịp Tết, lễ hội hay khi mặc áo dài truyền thống, tôn lên nét đẹp dịu dàng của phụ nữ Việt.'),
('18', 'Bông Tai Dáng Dài Emerald', 'BÔNG TAI', 25000000, NULL, 4.7, 19, 'MỚI', 'new', 'products/bongtai5.jpg', 1, 'Đôi bông tai dáng dài chandelier đính emerald xanh lục bảo thiên nhiên từ Colombia, mang đến vẻ đẹp quyền quý và đầy bí ẩn. Thiết kế ba tầng với những sợi dây vàng trắng mảnh mai đan xen, tạo chuyển động uyển chuyển khi người đeo di chuyển. Hai viên emerald chủ hình baguette nặng tổng 1.0 carat, xen kẽ là các viên kim cương nhỏ lấp lánh như những giọt sương đọng trên lá. Chiều dài tổng thể 4.5cm, tạo hiệu ứng kéo dài khuôn mặt và tôn lên đường cổ thon dài thanh thoát, là lựa chọn tuyệt vời cho các buổi dạ tiệc và sự kiện thảm đỏ.'),
('19', 'Lắc Tay Kim Cương Tennis', 'LẮC TAY', 45000000, NULL, 5, 15, 'MỚI', 'new', 'products/vongtay4.jpg', 1, 'Lắc tay tennis bracelet cao cấp với 40 viên kim cương tròn brilliant xếp liên tục, tổng trọng lượng 3.0 carat, tỏa sáng rực rỡ như một dải ngân hà thu nhỏ trên cổ tay. Mỗi viên kim cương được gắn chặt trong ổ chấu 4 chấu vàng trắng 18K, đảm bảo an toàn tuyệt đối mà vẫn để lộ tối đa bề mặt đá để bắt sáng. Khóa cài kép box clasp kết hợp khóa an toàn bên dưới, chống mở ngoài ý muốn. Đây là mẫu trang sức biểu tượng của sự xa hoa và đẳng cấp, từng được nhiều ngôi sao Hollywood yêu thích, phù hợp cho cả trang phục thường ngày lẫn dạ hội.'),
('2', 'Nhẫn Kim Cương Solitaire', 'NHẪN', 28000000, NULL, 5, 56, 'MỚI', 'new', 'products/nhan4.jpg', 1, 'Nhẫn kim cương Solitaire cổ điển với viên kim cương chủ đạo nặng 0.5 carat, được cắt giác tròn brilliant hoàn hảo 58 mặt để tối đa hóa độ lấp lánh. Ổ chấu 6 chấu thanh mảnh giúp viên kim cương được nâng cao, bắt trọn ánh sáng từ mọi hướng và tạo cảm giác viên đá lớn hơn thực tế. Thân nhẫn làm từ vàng trắng 18K nguyên khối, bo tròn mặt trong để đeo thoải mái cả ngày. Sản phẩm đi kèm giấy kiểm định GIA quốc tế, là biểu tượng của tình yêu vĩnh cửu và sự cam kết trọn đời.'),
('20', 'Lắc Tay Charm Vàng 18K', 'LẮC TAY', 8900000, 10500000, 4.7, 203, '-15%', 'sale', 'products/vongtay3.jpg', 1, 'Lắc tay charm vàng 18K với 5 charm đa dạng gồm trái tim, ngôi sao, lá cây, vương miện và chữ cái tùy chọn, mỗi charm đều mang một ý nghĩa riêng biệt. Dây lắc kiểu rolo chain dày dặn nhưng vẫn uyển chuyển, tạo tiếng leng keng nhẹ nhàng dễ thương khi di chuyển tay. Có thể tháo rời hoặc thêm charm theo sở thích cá nhân, biến chiếc lắc tay trở thành câu chuyện riêng của bạn qua từng dịp kỷ niệm. Sản phẩm bán chạy nhất của cửa hàng với hơn 200 đánh giá 5 sao, là món quà sinh nhật và Giáng sinh được yêu thích nhất.'),
('21', 'Lắc Tay Ngọc Trai Biển', 'LẮC TAY', 5500000, NULL, 4.5, 98, NULL, NULL, 'products/vongtay1.jpg', 1, 'Lắc tay kết hợp ngọc trai biển South Sea với dây vàng 14K, mang đến vẻ đẹp tự nhiên và thanh tao đậm chất biển cả. Những viên ngọc trai đường kính 6-7mm được xâu xen kẽ với các hạt vàng nhỏ tinh xảo, tạo nên nhịp điệu thị giác hài hòa và bắt mắt. Ngọc trai có ánh xà cừ cream nhẹ đặc trưng của ngọc biển Việt Nam, mang lại cảm giác ấm áp và gần gũi khi đeo. Khóa cài toggle clasp dễ sử dụng, vừa là khóa vừa là điểm nhấn trang trí cho chiếc lắc tay, phù hợp đeo đi biển, dạo phố hay kết hợp với trang phục bohemian.'),
('22', 'Bộ Trang Sức Cưới Kim Cương', 'BỘ TRANG SỨC', 85000000, NULL, 5, 12, 'MỚI', 'new', 'products/botrangsuc3.jpg', 1, 'Bộ trang sức cưới kim cương cao cấp gồm dây chuyền, bông tai và nhẫn đồng bộ thiết kế, tạo nên tổng thể hoàn chỉnh và sang trọng tuyệt đối cho ngày trọng đại nhất đời. Tổng trọng lượng kim cương lên đến 5.0 carat với chất lượng VVS, mỗi viên đều sáng lấp lánh như những vì sao trên bầu trời đêm. Chất liệu vàng trắng 18K cao cấp, thiết kế floral nhẹ nhàng lấy cảm hứng từ hoa lily trắng - biểu tượng của sự thuần khiết và hạnh phúc. Bộ sản phẩm được đựng trong hộp nhung đỏ cao cấp kèm giấy chứng nhận kim cương GIA, là tặng phẩm cưới ý nghĩa nhất mà nhà trai dành cho cô dâu.'),
('23', 'Bộ Trang Sức Ngọc Trai Akoya', 'BỘ TRANG SỨC', 35000000, 42000000, 4.9, 34, '-17%', 'sale', 'products/botrangsuc2.jpg', 1, 'Bộ trang sức ngọc trai Akoya Nhật Bản bao gồm dây chuyền 45cm, đôi bông tai stud và lắc tay 18cm, tất cả được làm từ ngọc trai Akoya thượng hạng đường kính 7-8mm. Ngọc trai Akoya nổi tiếng với độ bóng gương sáng rỡ, ánh xà cừ hồng phấn nhẹ nhàng, được xem là loại ngọc trai đẹp nhất thế giới. Phần kim loại hoàn toàn bằng vàng trắng 18K, đánh bóng sáng loáng, tôn lên màu sắc tự nhiên của ngọc trai. Bộ trang sức này phù hợp cho những dịp quan trọng như đám cưới, tiệc tối, hay làm quà tặng đặc biệt cho mẹ, vợ và những người phụ nữ bạn yêu quý nhất.'),
('24', 'Bộ Trang Sức Vàng Hoa Văn', 'BỘ TRANG SỨC', 28500000, NULL, 4.8, 56, NULL, NULL, 'products/botrangsuc1.jpg', 1, 'Bộ trang sức vàng 18K với hoa văn cổ điển Á Đông được chạm khắc thủ công tỉ mỉ bởi nghệ nhân kim hoàn hơn 30 năm kinh nghiệm, bao gồm dây chuyền, bông tai và nhẫn. Họa tiết hoa sen và mây ngũ sắc trên bề mặt vàng tượng trưng cho sự thịnh vượng và may mắn theo quan niệm phương Đông. Kỹ thuật chạm khắc kết hợp đánh bóng hai tông matte và glossy tạo chiều sâu nghệ thuật độc đáo mà không bộ trang sức công nghiệp nào có thể sánh được. Đây là tác phẩm trang sức mang giá trị nghệ thuật và văn hóa cao, phù hợp cho những quý bà yêu thích phong cách truyền thống sang trọng hoặc làm quà biếu tặng ý nghĩa trong các dịp lễ hội.'),
('3', 'Bông Tai Ngọc Trai Cổ Điển', 'BÔNG TAI', 3200000, 3800000, 4.5, 201, '-16%', 'sale', 'products/bongtai1.jpg', 1, 'Đôi bông tai ngọc trai cổ điển với viên ngọc trai nước ngọt tròn đều đường kính 8mm, có ánh xà cừ hồng nhẹ vô cùng thanh nhã và tự nhiên. Chốt bông tai bằng vàng 18K dạng butterfly back, giữ chặt và an toàn mà không gây đau tai khi đeo lâu. Kiểu dáng stud đơn giản nhưng không bao giờ lỗi mốt, phù hợp với mọi lứa tuổi từ thiếu nữ đến phụ nữ trung niên. Đây là món trang sức must-have trong bộ sưu tập của mọi quý cô, có thể đeo hàng ngày đi làm, đi học hay kết hợp với trang phục dự tiệc.'),
('4', 'Dây Chuyền Bạch Kim Đá Xanh', 'DÂY CHUYỀN', 12500000, NULL, 4.5, 34, 'HẾT HÀNG', 'outofstock', 'products/day4.jpg', 0, 'Sự kết hợp hoàn hảo giữa bạch kim cao cấp và viên đá xanh sapphire thiên nhiên tạo nên một tác phẩm trang sức đầy mê hoặc. Viên đá được cắt giác brilliant, tỏa ra ánh xanh huyền bí và sâu thẳm, tượng trưng cho sự chung thủy và niềm tin. Mặt dây chuyền được gắn chắc chắn bằng kỹ thuật châu ngoạm 4 chấu, đảm bảo viên đá luôn an toàn trong mọi hoạt động. Phần dây bạch kim mảnh mai, mềm mại ôm sát cổ, tôn lên vẻ thanh lịch và quý phái cho người đeo.'),
('5', 'Dây Chuyền Ngọc Trai', 'DÂY CHUYỀN', 8500000, NULL, 4.8, 89, NULL, NULL, 'products/day3.jpg', 1, 'Dây chuyền ngọc trai tự nhiên được tuyển chọn kỹ lưỡng từ những viên ngọc trai Akoya chất lượng cao, có độ bóng sáng rực rỡ và màu sắc đồng đều tuyệt đẹp. Mỗi viên ngọc trai đều trải qua quá trình kiểm định nghiêm ngặt về kích thước, hình dáng và ánh xà cừ trước khi được xâu thành chuỗi. Khóa cài được làm từ vàng trắng 18K, dễ dàng đeo và tháo mà không cần sự hỗ trợ. Đây là biểu tượng của sự thanh lịch vượt thời gian, phù hợp với mọi phong cách từ công sở đến dạ tiệc.'),
('6', 'Nhẫn Kim Cương Halo', 'NHẪN', 32000000, NULL, 5, 42, 'MỚI', 'new', 'products/nhan5.jpg', 1, 'Thiết kế Halo huyền thoại với viên kim cương trung tâm được bao quanh bởi vòng tròn kim cương nhỏ lấp lánh, tạo hiệu ứng thị giác vô cùng ấn tượng và sang trọng. Tổng trọng lượng kim cương lên đến 0.8 carat, mỗi viên đều đạt tiêu chuẩn VS về độ sạch và màu F-G trắng trong. Thân nhẫn được chạm khắc hoa văn milgrain tinh tế ở hai bên, thêm phần cổ điển và đẳng cấp cho tổng thể. Chiếc nhẫn này là lựa chọn hàng đầu cho những ai yêu thích phong cách hoàng gia, thích hợp để cầu hôn hoặc đeo trong ngày cưới.'),
('7', 'Lắc Tay Vàng Hồng', 'LẮC TAY', 6200000, NULL, 4.6, 67, NULL, NULL, 'products/vongtay2.jpg', 1, 'Lắc tay vàng hồng 14K với kiểu đan dây cable chain mảnh mai, tạo nên vẻ đẹp nhẹ nhàng và nữ tính cho cổ tay. Màu vàng hồng ấm áp rất phù hợp với tông da của phụ nữ Á Đông, mang lại cảm giác trang nhã mà không hề phô trương. Khóa cài lobster claw chắc chắn, dễ thao tác bằng một tay và có xích an toàn phụ phòng trường hợp khóa bị mở ngoài ý muốn. Có thể đeo đơn lẻ cho phong cách tối giản hoặc kết hợp cùng đồng hồ, vòng tay khác để tạo nên layer look thời thượng theo xu hướng.'),
('8', 'Bông Tai Sapphire', 'BÔNG TAI', 15000000, NULL, 4.9, 33, NULL, NULL, 'products/bongtai3.jpg', 1, 'Đôi bông tai đính sapphire xanh thiên nhiên với thiết kế drop duyên dáng, lắc lư nhẹ nhàng theo chuyển động tạo nên hiệu ứng bắt sáng vô cùng quyến rũ. Mỗi bên gồm một viên sapphire hình oval nặng 0.5 carat, được bao quanh bởi viền kim cương nhỏ tạo hiệu ứng halo lấp lánh. Chất liệu vàng trắng 18K không gây dị ứng, phần khóa English lock chắc chắn đảm bảo không bị rơi trong quá trình sử dụng. Đôi bông tai này là điểm nhấn hoàn hảo cho những bộ đầm dạ hội hay trang phục dự tiệc tối, giúp bạn tỏa sáng giữa đám đông.'),
('9', 'Dây Chuyền Kim Cương Giọt Nước', 'DÂY CHUYỀN', 18500000, 22000000, 4.9, 45, '-16%', 'sale', 'products/day6.jpg', 1, 'Viên kim cương hình giọt nước lấp lánh được đặt trong khung vàng trắng 18K tinh tế, tạo nên một mặt dây chuyền vừa cổ điển vừa hiện đại. Kim cương đạt tiêu chuẩn GIA với độ trong VVS1 và màu G, đảm bảo ánh sáng phản chiếu rực rỡ từ mọi góc nhìn. Thiết kế giọt nước thanh thoát giúp tôn lên đường cong cổ ngực một cách tự nhiên và quyến rũ. Sản phẩm đi kèm giấy chứng nhận kim cương quốc tế, là lựa chọn hoàn hảo cho những dịp kỷ niệm trọng đại hay lời cầu hôn đáng nhớ.');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `productId` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `rating` float NOT NULL DEFAULT 5,
  `comment` text NOT NULL,
  `createdAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `productId`, `userId`, `userName`, `rating`, `comment`, `createdAt`) VALUES
(1, 'p1', 'user_1', 'Trần Vũ', 5, 'Dây chuyền rất sáng và đẹp, vợ mình rất thích!', '2026-04-22 05:16:32'),
(2, 'p1', 'user_2', 'Nguyễn Thị Hoa', 4.5, 'Chất liệu tốt, tuy nhiên giao hàng hơi lâu một chút xíu.', '2026-04-22 05:24:52'),
(3, 'p1', 'user_3', 'Hoàng Anh', 5, 'Sản phẩm tinh xảo, xứng đáng từng đồng tiền bát gạo.', '2026-04-22 05:33:12'),
(4, 'p2', 'user_4', 'Lê Thủy', 5, 'Đá kim cương nhân tạo nhưng sáng lấp lánh như thật, khuyên dùng nhé.', '2026-04-22 05:33:12'),
(5, '10', 's4kWoEq0WkVUypKpWtoCWuAtovD2', 'camcam123', 5, 'Ok', '2026-04-22 09:10:33');

-- --------------------------------------------------------

--
-- Table structure for table `userprofiles`
--

CREATE TABLE `userprofiles` (
  `userId` varchar(255) NOT NULL,
  `defaultPaymentMethod` varchar(255) DEFAULT 'COD'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userprofiles`
--

INSERT INTO `userprofiles` (`userId`, `defaultPaymentMethod`) VALUES
('s4kWoEq0WkVUypKpWtoCWuAtovD2', 'BANK_1'),
('vFDqEPXds9fpySkwghRBqgIHst93', 'COD');

-- --------------------------------------------------------

--
-- Table structure for table `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `discount` float NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `expiryDate` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vouchers`
--

INSERT INTO `vouchers` (`id`, `code`, `discount`, `description`, `expiryDate`) VALUES
(1, 'GIAM50K', 50000, 'Giảm 50K cho đơn từ 1 Tr', '2026-12-31'),
(2, 'GIAM100K', 100000, 'Giảm 100K cho đơn từ 5 Tr', '2026-12-31'),
(3, 'VIP200K', 200000, 'Voucher Thành Viên VIP', '2027-01-01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bankaccounts`
--
ALTER TABLE `bankaccounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userprofiles`
--
ALTER TABLE `userprofiles`
  ADD PRIMARY KEY (`userId`);

--
-- Indexes for table `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `bankaccounts`
--
ALTER TABLE `bankaccounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
