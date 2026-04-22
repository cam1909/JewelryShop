/**
 * Dữ liệu sản phẩm và bộ sưu tập - lưu dạng JSON
 * Đây là "cơ sở dữ liệu" của backend Node.js
 * Trong thực tế, bạn sẽ dùng MongoDB, MySQL, PostgreSQL...
 * Nhưng dùng JSON file là đủ cho học tập và demo.
 */

const products = [
  // ===== DÂY CHUYỀN =====
  {
    id: '1', name: 'Dây Chuyền Hoa Vàng Rực Rỡ', category: 'DÂY CHUYỀN',
    price: 4500000, originalPrice: 5500000, rating: 4.5, reviews: 124,
    badge: '-18%', badgeType: 'sale', image: 'products/day1.jpg', inStock: true,
    description: 'Dây chuyền được chế tác từ vàng 18K nguyên khối với họa tiết hoa tinh xảo, mỗi cánh hoa được đánh bóng tỉ mỉ để bắt sáng tự nhiên dưới mọi ánh đèn. Thiết kế mang đậm phong cách nữ tính, nhẹ nhàng nhưng vẫn nổi bật, rất phù hợp để diện trong những buổi hẹn hò lãng mạn hay các sự kiện sang trọng. Sợi dây được gia công bằng công nghệ Ý, đảm bảo độ bền cao và không gây kích ứng da. Đây là món quà ý nghĩa dành tặng người phụ nữ bạn yêu thương.',
  },
  {
    id: '4', name: 'Dây Chuyền Bạch Kim Đá Xanh', category: 'DÂY CHUYỀN',
    price: 12500000, originalPrice: null, rating: 4.5, reviews: 34,
    badge: 'HẾT HÀNG', badgeType: 'outofstock', image: 'products/day4.jpg', inStock: false,
    description: 'Sự kết hợp hoàn hảo giữa bạch kim cao cấp và viên đá xanh sapphire thiên nhiên tạo nên một tác phẩm trang sức đầy mê hoặc. Viên đá được cắt giác brilliant, tỏa ra ánh xanh huyền bí và sâu thẳm, tượng trưng cho sự chung thủy và niềm tin. Mặt dây chuyền được gắn chắc chắn bằng kỹ thuật châu ngoạm 4 chấu, đảm bảo viên đá luôn an toàn trong mọi hoạt động. Phần dây bạch kim mảnh mai, mềm mại ôm sát cổ, tôn lên vẻ thanh lịch và quý phái cho người đeo.',
  },
  {
    id: '5', name: 'Dây Chuyền Ngọc Trai', category: 'DÂY CHUYỀN',
    price: 8500000, originalPrice: null, rating: 4.8, reviews: 89,
    badge: null, badgeType: null, image: 'products/day3.jpg', inStock: true,
    description: 'Dây chuyền ngọc trai tự nhiên được tuyển chọn kỹ lưỡng từ những viên ngọc trai Akoya chất lượng cao, có độ bóng sáng rực rỡ và màu sắc đồng đều tuyệt đẹp. Mỗi viên ngọc trai đều trải qua quá trình kiểm định nghiêm ngặt về kích thước, hình dáng và ánh xà cừ trước khi được xâu thành chuỗi. Khóa cài được làm từ vàng trắng 18K, dễ dàng đeo và tháo mà không cần sự hỗ trợ. Đây là biểu tượng của sự thanh lịch vượt thời gian, phù hợp với mọi phong cách từ công sở đến dạ tiệc.',
  },
  {
    id: '9', name: 'Dây Chuyền Kim Cương Giọt Nước', category: 'DÂY CHUYỀN',
    price: 18500000, originalPrice: 22000000, rating: 4.9, reviews: 45,
    badge: '-16%', badgeType: 'sale', image: 'products/day6.jpg', inStock: true,
    description: 'Viên kim cương hình giọt nước lấp lánh được đặt trong khung vàng trắng 18K tinh tế, tạo nên một mặt dây chuyền vừa cổ điển vừa hiện đại. Kim cương đạt tiêu chuẩn GIA với độ trong VVS1 và màu G, đảm bảo ánh sáng phản chiếu rực rỡ từ mọi góc nhìn. Thiết kế giọt nước thanh thoát giúp tôn lên đường cong cổ ngực một cách tự nhiên và quyến rũ. Sản phẩm đi kèm giấy chứng nhận kim cương quốc tế, là lựa chọn hoàn hảo cho những dịp kỷ niệm trọng đại hay lời cầu hôn đáng nhớ.',
  },
  {
    id: '10', name: 'Dây Chuyền Vàng Ý 18K', category: 'DÂY CHUYỀN',
    price: 7200000, originalPrice: null, rating: 4.7, reviews: 156,
    badge: null, badgeType: null, image: 'products/day2.jpg', inStock: true,
    description: 'Dây chuyền vàng Ý 18K chính hãng với kiểu đan dây tinh xảo theo phong cách châu Âu, mang đến vẻ đẹp sang trọng mà không hề cầu kỳ. Sợi dây có trọng lượng vừa phải, đeo nhẹ nhàng thoải mái suốt cả ngày dài mà không gây vướng víu. Bề mặt vàng được xử lý đánh bóng kết hợp phun cát, tạo hiệu ứng ánh sáng hai tông độc đáo và bắt mắt. Sản phẩm có thể đeo đơn hoặc kết hợp với mặt dây chuyền tùy theo sở thích cá nhân, linh hoạt cho mọi phong cách thời trang.',
  },
  {
    id: '11', name: 'Dây Chuyền Ruby Hình Tim', category: 'DÂY CHUYỀN',
    price: 15800000, originalPrice: null, rating: 4.6, reviews: 28,
    badge: 'MỚI', badgeType: 'new', image: 'products/day5.jpg', inStock: true,
    description: 'Mặt dây chuyền hình trái tim được đính viên ruby đỏ rực thiên nhiên, biểu tượng cho tình yêu nồng nàn và mãnh liệt. Viên ruby được lựa chọn cẩn thận với màu đỏ máu bồ câu quý hiếm, tỏa sáng rực rỡ dưới ánh nắng mặt trời. Khung mặt dây được chế tác từ vàng trắng 14K, viền xung quanh đính thêm những viên kim cương nhỏ li ti tạo nên vầng hào quang lấp lánh. Đây là món trang sức mang ý nghĩa sâu sắc, thích hợp làm quà tặng sinh nhật, kỷ niệm ngày cưới hay Valentine cho người phụ nữ đặc biệt.',
  },

  // ===== NHẪN =====
  {
    id: '2', name: 'Nhẫn Kim Cương Solitaire', category: 'NHẪN',
    price: 28000000, originalPrice: null, rating: 5, reviews: 56,
    badge: 'MỚI', badgeType: 'new', image: 'products/nhan4.jpg', inStock: true,
    description: 'Nhẫn kim cương Solitaire cổ điển với viên kim cương chủ đạo nặng 0.5 carat, được cắt giác tròn brilliant hoàn hảo 58 mặt để tối đa hóa độ lấp lánh. Ổ chấu 6 chấu thanh mảnh giúp viên kim cương được nâng cao, bắt trọn ánh sáng từ mọi hướng và tạo cảm giác viên đá lớn hơn thực tế. Thân nhẫn làm từ vàng trắng 18K nguyên khối, bo tròn mặt trong để đeo thoải mái cả ngày. Sản phẩm đi kèm giấy kiểm định GIA quốc tế, là biểu tượng của tình yêu vĩnh cửu và sự cam kết trọn đời.',
  },
  {
    id: '6', name: 'Nhẫn Kim Cương Halo', category: 'NHẪN',
    price: 32000000, originalPrice: null, rating: 5.0, reviews: 42,
    badge: 'MỚI', badgeType: 'new', image: 'products/nhan5.jpg', inStock: true,
    description: 'Thiết kế Halo huyền thoại với viên kim cương trung tâm được bao quanh bởi vòng tròn kim cương nhỏ lấp lánh, tạo hiệu ứng thị giác vô cùng ấn tượng và sang trọng. Tổng trọng lượng kim cương lên đến 0.8 carat, mỗi viên đều đạt tiêu chuẩn VS về độ sạch và màu F-G trắng trong. Thân nhẫn được chạm khắc hoa văn milgrain tinh tế ở hai bên, thêm phần cổ điển và đẳng cấp cho tổng thể. Chiếc nhẫn này là lựa chọn hàng đầu cho những ai yêu thích phong cách hoàng gia, thích hợp để cầu hôn hoặc đeo trong ngày cưới.',
  },
  {
    id: '12', name: 'Nhẫn Cưới Vàng Trắng', category: 'NHẪN',
    price: 9500000, originalPrice: 11000000, rating: 4.8, reviews: 312,
    badge: '-14%', badgeType: 'sale', image: 'products/nhan2.jpg', inStock: true,
    description: 'Nhẫn cưới vàng trắng 18K thiết kế tối giản nhưng đầy ý nghĩa, với đường viền sáng bóng tượng trưng cho tình yêu bền vững và không bao giờ phai nhạt. Bề mặt nhẫn được đánh bóng gương hoàn hảo, phản chiếu ánh sáng dịu dàng và tinh tế. Mặt trong được khắc laser dòng chữ "Forever" cùng biểu tượng trái tim nhỏ, thêm phần lãng mạn cho ngày trọng đại. Nhẫn có nhiều size từ 6 đến 22, phù hợp cho cả nam và nữ, là cặp nhẫn cưới được yêu thích nhất tại cửa hàng với hơn 300 đánh giá tích cực.',
  },
  {
    id: '13', name: 'Nhẫn Đính Sapphire Xanh', category: 'NHẪN',
    price: 22000000, originalPrice: null, rating: 4.9, reviews: 67,
    badge: null, badgeType: null, image: 'products/nhan3.jpg', inStock: true,
    description: 'Viên sapphire xanh Ceylon hình oval nặng 1.2 carat tỏa sáng rực rỡ trên nền vàng trắng 18K, mang đến vẻ đẹp vương giả đầy cuốn hút. Hai bên viên đá chủ được đính thêm các viên kim cương tấm xếp hình tam giác, tạo nên tổng thể cân đối và hài hòa. Sapphire thiên nhiên từ Sri Lanka nổi tiếng với màu xanh royal blue đặc trưng, tượng trưng cho trí tuệ và sự thịnh vượng. Sản phẩm có giấy chứng nhận đá quý quốc tế, là món trang sức đẳng cấp cho những người phụ nữ yêu thích sự khác biệt và tinh tế.',
  },
  {
    id: '14', name: 'Nhẫn Vàng Hồng Minimalist', category: 'NHẪN',
    price: 5800000, originalPrice: null, rating: 4.4, reviews: 189,
    badge: null, badgeType: null, image: 'products/nhan1.jpg', inStock: true,
    description: 'Nhẫn vàng hồng 14K với thiết kế minimalist thanh lịch, dành cho những cô gái yêu thích sự đơn giản mà vẫn muốn toát lên nét nữ tính dịu dàng. Thân nhẫn mảnh mai chỉ 1.5mm nhưng cứng cáp nhờ công nghệ ép khuôn hiện đại, giữ form tốt sau thời gian dài sử dụng. Màu vàng hồng ấm áp rất hợp với làn da châu Á, dễ phối với nhiều loại trang phục từ casual đến thanh lịch. Có thể đeo đơn lẻ để tạo điểm nhấn tinh tế hoặc xếp chồng nhiều chiếc cùng lúc theo xu hướng stacking rings thời thượng.',
  },
  {
    id: '15', name: 'Nhẫn Đôi Cưới Platinum', category: 'NHẪN',
    price: 38000000, originalPrice: null, rating: 5.0, reviews: 23,
    badge: 'MỚI', badgeType: 'new', image: 'products/nhan6.jpg', inStock: true,
    description: 'Cặp nhẫn cưới platinum cao cấp nhất dành cho những cặp đôi trân trọng giá trị vĩnh hằng của tình yêu. Chất liệu platinum 950 nguyên chất không pha tạp, có độ bền vượt trội so với vàng, không bị oxy hóa hay đổi màu theo thời gian. Nhẫn nam có thiết kế mạnh mẽ với bề mặt matte kết hợp đường rãnh sáng bóng ở giữa, nhẫn nữ thanh mảnh đính một hàng kim cương li ti lấp lánh. Mỗi chiếc nhẫn đều được khắc tên và ngày cưới miễn phí, cùng hộp đựng nhung cao cấp và giấy bảo hành trọn đời.',
  },

  // ===== BÔNG TAI =====
  {
    id: '3', name: 'Bông Tai Ngọc Trai Cổ Điển', category: 'BÔNG TAI',
    price: 3200000, originalPrice: 3800000, rating: 4.5, reviews: 201,
    badge: '-16%', badgeType: 'sale', image: 'products/bongtai1.jpg', inStock: true,
    description: 'Đôi bông tai ngọc trai cổ điển với viên ngọc trai nước ngọt tròn đều đường kính 8mm, có ánh xà cừ hồng nhẹ vô cùng thanh nhã và tự nhiên. Chốt bông tai bằng vàng 18K dạng butterfly back, giữ chặt và an toàn mà không gây đau tai khi đeo lâu. Kiểu dáng stud đơn giản nhưng không bao giờ lỗi mốt, phù hợp với mọi lứa tuổi từ thiếu nữ đến phụ nữ trung niên. Đây là món trang sức must-have trong bộ sưu tập của mọi quý cô, có thể đeo hàng ngày đi làm, đi học hay kết hợp với trang phục dự tiệc.',
  },
  {
    id: '8', name: 'Bông Tai Sapphire', category: 'BÔNG TAI',
    price: 15000000, originalPrice: null, rating: 4.9, reviews: 33,
    badge: null, badgeType: null, image: 'products/bongtai3.jpg', inStock: true,
    description: 'Đôi bông tai đính sapphire xanh thiên nhiên với thiết kế drop duyên dáng, lắc lư nhẹ nhàng theo chuyển động tạo nên hiệu ứng bắt sáng vô cùng quyến rũ. Mỗi bên gồm một viên sapphire hình oval nặng 0.5 carat, được bao quanh bởi viền kim cương nhỏ tạo hiệu ứng halo lấp lánh. Chất liệu vàng trắng 18K không gây dị ứng, phần khóa English lock chắc chắn đảm bảo không bị rơi trong quá trình sử dụng. Đôi bông tai này là điểm nhấn hoàn hảo cho những bộ đầm dạ hội hay trang phục dự tiệc tối, giúp bạn tỏa sáng giữa đám đông.',
  },
  {
    id: '16', name: 'Bông Tai Kim Cương Tròn', category: 'BÔNG TAI',
    price: 19500000, originalPrice: null, rating: 4.8, reviews: 78,
    badge: null, badgeType: null, image: 'products/bongtai4.jpg', inStock: true,
    description: 'Đôi bông tai kim cương tròn brilliant cổ điển với tổng trọng lượng 0.6 carat, mỗi bên một viên kim cương trong veo như giọt sương mai. Kim cương đạt tiêu chuẩn quốc tế với độ sạch VS2 và màu E-F, đảm bảo độ lấp lánh tối đa dưới mọi điều kiện ánh sáng. Ổ chấu 4 chấu vàng trắng 18K thiết kế tối giản để viên kim cương được tôn vinh trọn vẹn, không bị che khuất bởi kim loại. Sản phẩm đi kèm giấy kiểm định kim cương GIA cho mỗi viên, là khoản đầu tư xứng đáng cho vẻ đẹp vĩnh cửu.',
  },
  {
    id: '17', name: 'Bông Tai Vàng Hoa Mai', category: 'BÔNG TAI',
    price: 4800000, originalPrice: 5600000, rating: 4.6, reviews: 145,
    badge: '-14%', badgeType: 'sale', image: 'products/bongtai2.jpg', inStock: true,
    description: 'Đôi bông tai vàng 18K với thiết kế hoa mai năm cánh truyền thống Việt Nam, kết hợp hài hòa giữa nét văn hóa dân tộc và phong cách trang sức hiện đại. Mỗi cánh hoa được chạm khắc tỉ mỉ bằng tay, bề mặt kết hợp giữa phần đánh bóng sáng và phần phun cát mờ tạo chiều sâu nghệ thuật. Kích thước vừa phải, nhẹ nhàng chỉ 2.5 gram mỗi bên, đeo thoải mái suốt cả ngày mà không gây nặng tai. Rất thích hợp để đeo trong dịp Tết, lễ hội hay khi mặc áo dài truyền thống, tôn lên nét đẹp dịu dàng của phụ nữ Việt.',
  },
  {
    id: '18', name: 'Bông Tai Dáng Dài Emerald', category: 'BÔNG TAI',
    price: 25000000, originalPrice: null, rating: 4.7, reviews: 19,
    badge: 'MỚI', badgeType: 'new', image: 'products/bongtai5.jpg', inStock: true,
    description: 'Đôi bông tai dáng dài chandelier đính emerald xanh lục bảo thiên nhiên từ Colombia, mang đến vẻ đẹp quyền quý và đầy bí ẩn. Thiết kế ba tầng với những sợi dây vàng trắng mảnh mai đan xen, tạo chuyển động uyển chuyển khi người đeo di chuyển. Hai viên emerald chủ hình baguette nặng tổng 1.0 carat, xen kẽ là các viên kim cương nhỏ lấp lánh như những giọt sương đọng trên lá. Chiều dài tổng thể 4.5cm, tạo hiệu ứng kéo dài khuôn mặt và tôn lên đường cổ thon dài thanh thoát, là lựa chọn tuyệt vời cho các buổi dạ tiệc và sự kiện thảm đỏ.',
  },

  // ===== LẮC TAY =====
  {
    id: '7', name: 'Lắc Tay Vàng Hồng', category: 'LẮC TAY',
    price: 6200000, originalPrice: null, rating: 4.6, reviews: 67,
    badge: null, badgeType: null, image: 'products/vongtay2.jpg', inStock: true,
    description: 'Lắc tay vàng hồng 14K với kiểu đan dây cable chain mảnh mai, tạo nên vẻ đẹp nhẹ nhàng và nữ tính cho cổ tay. Màu vàng hồng ấm áp rất phù hợp với tông da của phụ nữ Á Đông, mang lại cảm giác trang nhã mà không hề phô trương. Khóa cài lobster claw chắc chắn, dễ thao tác bằng một tay và có xích an toàn phụ phòng trường hợp khóa bị mở ngoài ý muốn. Có thể đeo đơn lẻ cho phong cách tối giản hoặc kết hợp cùng đồng hồ, vòng tay khác để tạo nên layer look thời thượng theo xu hướng.',
  },
  {
    id: '19', name: 'Lắc Tay Kim Cương Tennis', category: 'LẮC TAY',
    price: 45000000, originalPrice: null, rating: 5.0, reviews: 15,
    badge: 'MỚI', badgeType: 'new', image: 'products/vongtay4.jpg', inStock: true,
    description: 'Lắc tay tennis bracelet cao cấp với 40 viên kim cương tròn brilliant xếp liên tục, tổng trọng lượng 3.0 carat, tỏa sáng rực rỡ như một dải ngân hà thu nhỏ trên cổ tay. Mỗi viên kim cương được gắn chặt trong ổ chấu 4 chấu vàng trắng 18K, đảm bảo an toàn tuyệt đối mà vẫn để lộ tối đa bề mặt đá để bắt sáng. Khóa cài kép box clasp kết hợp khóa an toàn bên dưới, chống mở ngoài ý muốn. Đây là mẫu trang sức biểu tượng của sự xa hoa và đẳng cấp, từng được nhiều ngôi sao Hollywood yêu thích, phù hợp cho cả trang phục thường ngày lẫn dạ hội.',
  },
  {
    id: '20', name: 'Lắc Tay Charm Vàng 18K', category: 'LẮC TAY',
    price: 8900000, originalPrice: 10500000, rating: 4.7, reviews: 203,
    badge: '-15%', badgeType: 'sale', image: 'products/vongtay3.jpg', inStock: true,
    description: 'Lắc tay charm vàng 18K với 5 charm đa dạng gồm trái tim, ngôi sao, lá cây, vương miện và chữ cái tùy chọn, mỗi charm đều mang một ý nghĩa riêng biệt. Dây lắc kiểu rolo chain dày dặn nhưng vẫn uyển chuyển, tạo tiếng leng keng nhẹ nhàng dễ thương khi di chuyển tay. Có thể tháo rời hoặc thêm charm theo sở thích cá nhân, biến chiếc lắc tay trở thành câu chuyện riêng của bạn qua từng dịp kỷ niệm. Sản phẩm bán chạy nhất của cửa hàng với hơn 200 đánh giá 5 sao, là món quà sinh nhật và Giáng sinh được yêu thích nhất.',
  },
  {
    id: '21', name: 'Lắc Tay Ngọc Trai Biển', category: 'LẮC TAY',
    price: 5500000, originalPrice: null, rating: 4.5, reviews: 98,
    badge: null, badgeType: null, image: 'products/vongtay1.jpg', inStock: true,
    description: 'Lắc tay kết hợp ngọc trai biển South Sea với dây vàng 14K, mang đến vẻ đẹp tự nhiên và thanh tao đậm chất biển cả. Những viên ngọc trai đường kính 6-7mm được xâu xen kẽ với các hạt vàng nhỏ tinh xảo, tạo nên nhịp điệu thị giác hài hòa và bắt mắt. Ngọc trai có ánh xà cừ cream nhẹ đặc trưng của ngọc biển Việt Nam, mang lại cảm giác ấm áp và gần gũi khi đeo. Khóa cài toggle clasp dễ sử dụng, vừa là khóa vừa là điểm nhấn trang trí cho chiếc lắc tay, phù hợp đeo đi biển, dạo phố hay kết hợp với trang phục bohemian.',
  },

  // ===== BỘ TRANG SỨC =====
  {
    id: '22', name: 'Bộ Trang Sức Cưới Kim Cương', category: 'BỘ TRANG SỨC',
    price: 85000000, originalPrice: null, rating: 5.0, reviews: 12,
    badge: 'MỚI', badgeType: 'new', image: 'products/botrangsuc3.jpg', inStock: true,
    description: 'Bộ trang sức cưới kim cương cao cấp gồm dây chuyền, bông tai và nhẫn đồng bộ thiết kế, tạo nên tổng thể hoàn chỉnh và sang trọng tuyệt đối cho ngày trọng đại nhất đời. Tổng trọng lượng kim cương lên đến 5.0 carat với chất lượng VVS, mỗi viên đều sáng lấp lánh như những vì sao trên bầu trời đêm. Chất liệu vàng trắng 18K cao cấp, thiết kế floral nhẹ nhàng lấy cảm hứng từ hoa lily trắng - biểu tượng của sự thuần khiết và hạnh phúc. Bộ sản phẩm được đựng trong hộp nhung đỏ cao cấp kèm giấy chứng nhận kim cương GIA, là tặng phẩm cưới ý nghĩa nhất mà nhà trai dành cho cô dâu.',
  },
  {
    id: '23', name: 'Bộ Trang Sức Ngọc Trai Akoya', category: 'BỘ TRANG SỨC',
    price: 35000000, originalPrice: 42000000, rating: 4.9, reviews: 34,
    badge: '-17%', badgeType: 'sale', image: 'products/botrangsuc2.jpg', inStock: true,
    description: 'Bộ trang sức ngọc trai Akoya Nhật Bản bao gồm dây chuyền 45cm, đôi bông tai stud và lắc tay 18cm, tất cả được làm từ ngọc trai Akoya thượng hạng đường kính 7-8mm. Ngọc trai Akoya nổi tiếng với độ bóng gương sáng rỡ, ánh xà cừ hồng phấn nhẹ nhàng, được xem là loại ngọc trai đẹp nhất thế giới. Phần kim loại hoàn toàn bằng vàng trắng 18K, đánh bóng sáng loáng, tôn lên màu sắc tự nhiên của ngọc trai. Bộ trang sức này phù hợp cho những dịp quan trọng như đám cưới, tiệc tối, hay làm quà tặng đặc biệt cho mẹ, vợ và những người phụ nữ bạn yêu quý nhất.',
  },
  {
    id: '24', name: 'Bộ Trang Sức Vàng Hoa Văn', category: 'BỘ TRANG SỨC',
    price: 28500000, originalPrice: null, rating: 4.8, reviews: 56,
    badge: null, badgeType: null, image: 'products/botrangsuc1.jpg', inStock: true,
    description: 'Bộ trang sức vàng 18K với hoa văn cổ điển Á Đông được chạm khắc thủ công tỉ mỉ bởi nghệ nhân kim hoàn hơn 30 năm kinh nghiệm, bao gồm dây chuyền, bông tai và nhẫn. Họa tiết hoa sen và mây ngũ sắc trên bề mặt vàng tượng trưng cho sự thịnh vượng và may mắn theo quan niệm phương Đông. Kỹ thuật chạm khắc kết hợp đánh bóng hai tông matte và glossy tạo chiều sâu nghệ thuật độc đáo mà không bộ trang sức công nghiệp nào có thể sánh được. Đây là tác phẩm trang sức mang giá trị nghệ thuật và văn hóa cao, phù hợp cho những quý bà yêu thích phong cách truyền thống sang trọng hoặc làm quà biếu tặng ý nghĩa trong các dịp lễ hội.',
  },
];

const collections = [
  {
    id: '1', title: 'Bộ Sưu Tập Mùa Xuân', subtitle: '12 sản phẩm',
    description: 'Những thiết kế mới nhất lấy cảm hứng từ hoa xuân', image: null,
  },
  {
    id: '2', title: 'Trang Sức Cưới', subtitle: '24 sản phẩm',
    description: 'Bộ sưu tập dành riêng cho ngày trọng đại', image: null,
  },
  {
    id: '3', title: 'Kim Cương Tự Nhiên', subtitle: '18 sản phẩm',
    description: 'Vẻ đẹp vĩnh cửu từ thiên nhiên', image: null,
  },
  {
    id: '4', title: 'Ngọc Trai Biển Đông', subtitle: '9 sản phẩm',
    description: 'Tinh hoa từ đại dương Việt Nam', image: null,
  },
  {
    id: '5', title: 'Vàng Ý 18K', subtitle: '32 sản phẩm',
    description: 'Đẳng cấp châu Âu với chất liệu thượng hạng', image: null,
  },
  {
    id: '6', title: 'Minimalist', subtitle: '15 sản phẩm',
    description: 'Đơn giản nhưng tinh tế cho phong cách hiện đại', image: null,
  },
];

module.exports = { products, collections };
