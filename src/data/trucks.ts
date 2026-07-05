export interface Truck {
  id: string;
  name: string;
  category: 'tractor' | 'cargo' | 'dump' | 'mixer' | 'special' | 'trailer' | 'machinery' | 'light';
  brand: string;
  horsepower: number;
  driveType: string;
  engine: string;
  price: string;
  image: string;
  features: string[];
}

export const trucks: Truck[] = [
  // ===== 牵引车 =====
  {
    id: 'howo-tx-430',
    name: 'HOWO TX 430 牵引车',
    category: 'tractor',
    brand: '中国重汽',
    horsepower: 430,
    driveType: '6×4',
    engine: '潍柴 WP13.430E62',
    price: '$28,000 - $35,000',
    image: '/images/tractor-1.jpg',
    features: ['高顶双卧铺', 'ABS防抱死', '空调系统', '气囊座椅']
  },
  {
    id: 'sitrak-c7h-440',
    name: 'SITRAK C7H 440 牵引车',
    category: 'tractor',
    brand: '中国重汽',
    horsepower: 440,
    driveType: '6×4',
    engine: '曼 MC13.440',
    price: '$35,000 - $45,000',
    image: '/images/tractor-2.jpg',
    features: ['豪华驾驶室', '液力缓速器', '车道偏离预警', '360°环视']
  },
  {
    id: 'shaanxi-x3000-430',
    name: '陕汽 X3000 430 牵引车',
    category: 'tractor',
    brand: '陕汽',
    horsepower: 430,
    driveType: '6×4',
    engine: '潍柴 WP13.430E62',
    price: '$27,000 - $34,000',
    image: '/images/tractor-1.jpg',
    features: ['法士特变速箱', '汉德车桥', '四点悬浮驾驶室', '定速巡航']
  },

  // ===== 载货车 =====
  {
    id: 'howo-tx-cargo-340',
    name: 'HOWO TX 340 载货车',
    category: 'cargo',
    brand: '中国重汽',
    horsepower: 340,
    driveType: '8×4',
    engine: '潍柴 WP10.340E62',
    price: '$25,000 - $32,000',
    image: '/images/hero-2.jpg',
    features: ['9.6米货箱', '气囊减震座椅', '多媒体中控', '定速巡航']
  },
  {
    id: 'shaanxi-l3000-280',
    name: '陕汽 L3000 280 载货车',
    category: 'cargo',
    brand: '陕汽',
    horsepower: 280,
    driveType: '4×2',
    engine: '潍柴 WP7.280E62',
    price: '$22,000 - $28,000',
    image: '/images/tractor-1.jpg',
    features: ['经济节油', '大货箱容积', '电动门窗', '中控锁']
  },

  // ===== 冷藏车 =====
  {
    id: 'howo-t5g-reefer',
    name: 'HOWO T5G 340 冷藏车',
    category: 'special',
    brand: '中国重汽',
    horsepower: 340,
    driveType: '6×2',
    engine: '潍柴 WP10.340E62',
    price: '$32,000 - $40,000',
    image: '/images/tractor-1.jpg',
    features: ['冷王/开利制冷机组', '-18°C恒温', '聚氨酯保温箱体', '温控记录仪']
  },

  // ===== 自卸车 =====
  {
    id: 'howo-8x4-dump-380',
    name: 'HOWO 8×4 自卸车',
    category: 'dump',
    brand: '中国重汽',
    horsepower: 380,
    driveType: '8×4',
    engine: '潍柴 WP12.380E62',
    price: '$35,000 - $45,000',
    image: '/images/dump-howo.jpg',
    features: ['加强型货箱', '液压举升', '矿山专用轮胎', '防护网']
  },
  {
    id: 'shaanxi-f3000-dump',
    name: '陕汽 F3000 380 自卸车',
    category: 'dump',
    brand: '陕汽',
    horsepower: 380,
    driveType: '6×4',
    engine: '潍柴 WP12.380E62',
    price: '$32,000 - $42,000',
    image: '/images/dump-howo.jpg',
    features: ['矿山专用底盘', '加强型悬挂', '沙漠空滤', '发动机护板']
  },

  // ===== 搅拌车 =====
  {
    id: 'sitrak-mixer-371',
    name: 'SITRAK 6×4 搅拌车',
    category: 'mixer',
    brand: '中国重汽',
    horsepower: 371,
    driveType: '6×4',
    engine: '中国重汽 MC11.371',
    price: '$42,000 - $55,000',
    image: '/images/mixer-sitrak.jpg',
    features: ['12方搅拌罐', '恒速控制系统', '耐磨叶片', '自动润滑']
  },

  // ===== 水泥罐车 =====
  {
    id: 'howo-tx-cement',
    name: 'HOWO TX 380 水泥罐车',
    category: 'special',
    brand: '中国重汽',
    horsepower: 380,
    driveType: '6×4',
    engine: '潍柴 WP12.380E62',
    price: '$30,000 - $38,000',
    image: '/images/tractor-1.jpg',
    features: ['45立方罐体', '空压机卸料', '压力安全阀', '防堵设计']
  },

  // ===== 垃圾运输车 =====
  {
    id: 'howo-tx-garbage',
    name: 'HOWO TX 280 垃圾运输车',
    category: 'special',
    brand: '中国重汽',
    horsepower: 280,
    driveType: '4×2',
    engine: '潍柴 WP7.280E62',
    price: '$28,000 - $36,000',
    image: '/images/tractor-1.jpg',
    features: ['压缩式箱体', 'PLC电控系统', '密封防泄漏', '12方容积']
  },

  // ===== 随车吊 =====
  {
    id: 'howo-7-crane',
    name: 'HOWO 7 400 随车吊',
    category: 'special',
    brand: '中国重汽',
    horsepower: 400,
    driveType: '6×4',
    engine: '潍柴 WP12.400E62',
    price: '$38,000 - $48,000',
    image: '/images/crane-1.jpg',
    features: ['12吨吊机', '液压支腿', '远程遥控', '360°旋转']
  },

  // ===== 高空作业车 =====
  {
    id: 'howo-tx-aerial',
    name: 'HOWO TX 280 高空作业车',
    category: 'special',
    brand: '中国重汽',
    horsepower: 280,
    driveType: '4×2',
    engine: '潍柴 WP7.280E62',
    price: '$35,000 - $45,000',
    image: '/images/tractor-1.jpg',
    features: ['28米作业高度', '液压伸缩臂', '安全锁止', '遥控操作']
  },

  // ===== 洒水车 =====
  {
    id: 'howo-tx-water',
    name: 'HOWO TX 340 洒水车',
    category: 'special',
    brand: '中国重汽',
    horsepower: 340,
    driveType: '6×4',
    engine: '潍柴 WP10.340E62',
    price: '$25,000 - $32,000',
    image: '/images/tanker-1.jpg',
    features: ['15方水罐', '前冲后洒', '高压水炮', '自吸自排']
  },

  // ===== 挂车（中集） =====
  {
    id: 'cimc-flatbed',
    name: '中集 40英尺 平板挂车',
    category: 'trailer',
    brand: '中集 CIMC',
    horsepower: 0,
    driveType: '3轴',
    engine: '-',
    price: '$8,000 - $12,000',
    image: '/images/tractor-1.jpg',
    features: ['40英尺平板', '13吨车桥', 'ABS制动', '集装箱锁具']
  },
  {
    id: 'cimc-dump-trailer',
    name: '中集 40立方 自卸挂车',
    category: 'trailer',
    brand: '中集 CIMC',
    horsepower: 0,
    driveType: '3轴',
    engine: '-',
    price: '$12,000 - $18,000',
    image: '/images/dump-howo.jpg',
    features: ['40立方U型斗', '液压举升', '耐磨钢板', '自动篷布']
  },

  // ===== 工程机械（徐工） =====
  {
    id: 'xcmg-excavator-215',
    name: '徐工 XE215 挖掘机',
    category: 'machinery',
    brand: '徐工 XCMG',
    horsepower: 168,
    driveType: '履带式',
    engine: '康明斯 QSB7',
    price: '$55,000 - $75,000',
    image: '/images/tractor-1.jpg',
    features: ['21.5吨', '1.1方铲斗', '智能电控', '矿山加强型']
  },
  {
    id: 'xcmg-loader-zl50',
    name: '徐工 ZL50GN 装载机',
    category: 'machinery',
    brand: '徐工 XCMG',
    horsepower: 220,
    driveType: '4×4',
    engine: '潍柴 WD10G220',
    price: '$35,000 - $48,000',
    image: '/images/tractor-1.jpg',
    features: ['5吨', '3.0方铲斗', '液压先导操控', '空调驾驶室']
  },

  // ===== 福田轻型商用车 =====
  {
    id: 'foton-van',
    name: '福田 图雅诺 Van 封闭货车',
    category: 'light',
    brand: '福田 Foton',
    horsepower: 150,
    driveType: '4×2',
    engine: '康明斯 ISF2.8',
    price: '$12,000 - $18,000',
    image: '/images/tractor-1.jpg',
    features: ['12m³货箱', '侧滑门', 'ABS+EBD', '空调']
  },
  {
    id: 'foton-micro',
    name: '福田 时代 微卡',
    category: 'light',
    brand: '福田 Foton',
    horsepower: 112,
    driveType: '4×2',
    engine: '全柴 4A2-88C50',
    price: '$5,000 - $8,000',
    image: '/images/tractor-1.jpg',
    features: ['3.3米货箱', '经济节油', '灵活城市通行', '低维保成本']
  }
];

export const categories = [
  { id: 'tractor', name: '牵引车', nameEn: 'Tractor Truck', icon: '🚛' },
  { id: 'cargo', name: '载货车', nameEn: 'Cargo Truck', icon: '📦' },
  { id: 'dump', name: '自卸车', nameEn: 'Dump Truck', icon: '🏗️' },
  { id: 'mixer', name: '搅拌车', nameEn: 'Concrete Mixer', icon: '🔄' },
  { id: 'special', name: '专用车', nameEn: 'Special Vehicle', icon: '🔧' },
  { id: 'trailer', name: '挂车', nameEn: 'Trailer', icon: '🔗' },
  { id: 'machinery', name: '工程机械', nameEn: 'Construction Machinery', icon: '⚙️' },
  { id: 'light', name: '轻型商用车', nameEn: 'Light Commercial', icon: '🚐' }
];

export const advantages = [
  {
    title: '品牌齐全',
    titleEn: 'Full Brand Portfolio',
    description: '中国重汽、陕汽重卡、徐工机械、中集挂车、福田商用车——五大品牌一站式采购',
    icon: 'shield'
  },
  {
    title: '价格优势',
    titleEn: 'Competitive Price',
    description: '原厂直供，省去中间环节，同等配置价格低于市场价15%-20%',
    icon: 'price'
  },
  {
    title: '售后无忧',
    titleEn: 'After-sales Service',
    description: '提供2年质保，海外设有服务网点，配件供应及时，技术远程支持',
    icon: 'service'
  },
  {
    title: '定制服务',
    titleEn: 'Customization',
    description: '可根据客户需求定制配置、颜色、标识，满足不同市场特殊要求',
    icon: 'custom'
  }
];

export const markets = [
  { region: '非洲', countries: ['阿尔及利亚', '尼日利亚', '埃塞俄比亚', '坦桑尼亚', '肯尼亚', '加纳'], count: 45 },
  { region: '中东', countries: ['沙特阿拉伯', '阿联酋', '伊拉克', '约旦', '科威特'], count: 32 },
  { region: '东南亚', countries: ['越南', '菲律宾', '印度尼西亚', '缅甸', '老挝'], count: 28 },
  { region: '中亚', countries: ['哈萨克斯坦', '乌兹别克斯坦', '土库曼斯坦', '吉尔吉斯斯坦'], count: 18 }
];
