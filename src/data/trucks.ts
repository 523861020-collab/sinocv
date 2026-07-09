export interface Truck {
  id: string;
  name: string;
  category: 'tractor' | 'cargo' | 'dump' | 'mixer' | 'reefer' | 'cement' | 'garbage' | 'crane' | 'aerial' | 'water' | 'fuel' | 'wrecker' | '6x6' | 'trailer' | 'machinery' | 'mining' | 'light';
  brand: string;
  horsepower: number;
  driveType: string;
  engine: string;
  price: string;
  image: string;
  images?: string[];
  features: string[];
}

export const trucks: Truck[] = [
  // ===== 牵引车 =====
  {
    id: 'sitrak-g7',
    name: '汕德卡G7 6×4 牵引车',
    category: 'tractor',
    brand: '中国重汽',
    horsepower: 540,
    driveType: '6×4',
    engine: '曼 MC13 / MC11',
    price: '$35,000 - $55,000',
    image: '/images/sitrak-12.jpg',
    images: ['/images/sitrak-12.jpg', '/images/sitrak-13.jpg', '/images/sitrak-14.jpg'],
    features: ['430HP · 480HP · 540HP', '曼发动机', '采埃孚变速箱', '豪华驾驶室']
  },
  {
    id: 'howo-tx',
    name: '豪沃 TX 6×4 牵引车',
    category: 'tractor',
    brand: '中国重汽',
    horsepower: 430,
    driveType: '6×4',
    engine: '潍柴 / 曼',
    price: '$28,000 - $42,000',
    image: '/images/howo-15.jpg',
    images: ['/images/howo-15.jpg', '/images/howo-16.jpg', '/images/howo-17.jpg'],
    features: ['340HP · 380HP · 400HP · 430HP', '潍柴/曼发动机可选', '高顶双卧铺', 'ABS+空调']
  },
  {
    id: 'howo-nx',
    name: '豪沃 NX 6×4 牵引车',
    category: 'tractor',
    brand: '中国重汽',
    horsepower: 430,
    driveType: '6×4',
    engine: '潍柴',
    price: '$30,000 - $40,000',
    image: '/images/howo-nx-1.jpg',
    images: ['/images/howo-nx-1.jpg', '/images/howo-nx-2.jpg', '/images/howo-nx-3.jpg'],
    features: ['380HP · 400HP · 430HP', '潍柴发动机', '高顶双卧铺', 'ABS+空调']
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
    id: 'sitrak-curtain',
    name: '汕德卡 6×4 侧帘载货车',
    category: 'cargo',
    brand: '中国重汽',
    horsepower: 440,
    driveType: '6×4',
    engine: '曼 MC13.440',
    price: '$38,000 - $48,000',
    image: '/images/sitrak-curtain-1.jpg',
    images: ['/images/sitrak-curtain-1.jpg', '/images/sitrak-curtain-2.jpg', '/images/sitrak-curtain-3.jpg'],
    features: ['侧帘式', '快速装卸', '大容量', '曼发动机']
  },

  // ===== 冷藏车 =====
  {
    id: 'howo-t5g-reefer',
    name: 'HOWO T5G 340 冷藏车',
    category: 'reefer',
    brand: '中国重汽',
    horsepower: 340,
    driveType: '6×2',
    engine: '潍柴 WP10.340E62',
    price: '$32,000 - $40,000',
    image: '/images/tractor-1.jpg',
    features: ['冷王/开利制冷机组', '-18°C恒温', '聚氨酯保温箱体', '温控记录仪']
  },
  {
    id: 'howo-4x2-reefer',
    name: '豪沃 4×2 轻卡冷藏车',
    category: 'reefer',
    brand: '中国重汽',
    horsepower: 160,
    driveType: '4×2',
    engine: '潍柴 WP2.3Q',
    price: '$22,000 - $28,000',
    image: '/images/howo-4x2-reefer-1.jpg',
    images: ['/images/howo-4x2-reefer-1.jpg', '/images/howo-4x2-reefer-2.jpg', '/images/howo-4x2-reefer-3.jpg'],
    features: ['轻型冷藏', '城市配送', '低油耗', '冷王制冷机组']
  },

  // ===== 自卸车 =====
  {
    id: 'howo-dump',
    name: '豪沃 TX 6×4 自卸车',
    category: 'dump',
    brand: '中国重汽',
    horsepower: 400,
    driveType: '6×4',
    engine: '潍柴 WP12.400E62',
    price: '$38,000 - $48,000',
    image: '/images/howo-dump-1.jpg',
    images: ['/images/howo-dump-1.jpg', '/images/howo-dump-2.jpg', '/images/howo-dump-3.jpg'],
    features: ['加强型货箱', '液压举升', '矿山专用轮胎', '防护网']
  },
  {
    id: 'howo-nx-dump',
    name: '豪沃 NX 6×4 自卸车',
    category: 'dump',
    brand: '中国重汽',
    horsepower: 430,
    driveType: '6×4',
    engine: '潍柴 WP13.430E62',
    price: '$42,000 - $52,000',
    image: '/images/howo-nx-dump-1.jpg',
    images: ['/images/howo-nx-dump-1.jpg', '/images/howo-nx-dump-2.jpg', '/images/howo-nx-dump-3.jpg'],
    features: ['加强型货箱', '液压举升', '矿山专用轮胎', '防护网']
  },
  {
    id: 'sitrak-dump',
    name: '汕德卡 6×4 自卸车',
    category: 'dump',
    brand: '中国重汽',
    horsepower: 440,
    driveType: '6×4',
    engine: '曼 MC13.440',
    price: '$40,000 - $52,000',
    image: '/images/sitrak-dump-1.jpg',
    images: ['/images/sitrak-dump-1.jpg', '/images/sitrak-dump-2.jpg', '/images/sitrak-dump-3.jpg'],
    features: ['曼发动机', '加强型货箱', '液压举升', '矿山专用']
  },

  // ===== 搅拌车 =====
  {
    id: 'howo-nx-mixer',
    name: '豪沃 NX 8×4 搅拌车',
    category: 'mixer',
    brand: '中国重汽',
    horsepower: 430,
    driveType: '8×4',
    engine: '潍柴 WP13.430E62',
    price: '$48,000 - $58,000',
    image: '/images/howo-nx-mixer-1.jpg',
    images: ['/images/howo-nx-mixer-1.jpg', '/images/howo-nx-mixer-2.jpg', '/images/howo-nx-mixer-3.jpg'],
    features: ['12方搅拌罐', '恒速控制', '耐磨叶片', '自动润滑']
  },
  {
    id: 'howo-mixer',
    name: '豪沃 TX 6×4 搅拌车',
    category: 'mixer',
    brand: '中国重汽',
    horsepower: 400,
    driveType: '6×4',
    engine: '潍柴 WP12.400E62',
    price: '$43,000 - $53,000',
    image: '/images/howo-mixer-1.jpg',
    images: ['/images/howo-mixer-1.jpg', '/images/howo-mixer-2.jpg', '/images/howo-mixer-3.jpg'],
    features: ['12方搅拌罐', '恒速控制', '耐磨叶片', '自动润滑']
  },
  {
    id: 'sitrak-mixer',
    name: '汕德卡 6×4 搅拌车',
    category: 'mixer',
    brand: '中国重汽',
    horsepower: 440,
    driveType: '6×4',
    engine: '曼 MC13.440',
    price: '$48,000 - $60,000',
    image: '/images/sitrak-mixer-1.jpg',
    images: ['/images/sitrak-mixer-1.jpg', '/images/sitrak-mixer-2.jpg', '/images/sitrak-mixer-3.jpg'],
    features: ['12方搅拌罐', '恒速控制', '耐磨叶片', '自动润滑']
  },

  // ===== 水泥罐车 =====
  {
    id: 'howo-tx-cement',
    name: 'HOWO TX 380 水泥罐车',
    category: 'cement',
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
    category: 'garbage',
    brand: '中国重汽',
    horsepower: 280,
    driveType: '4×2',
    engine: '潍柴 WP7.280E62',
    price: '$28,000 - $36,000',
    image: '/images/tractor-1.jpg',
    features: ['压缩式箱体', 'PLC电控系统', '密封防泄漏', '12方容积']
  },
  {
    id: 'howo-4x2-garbage',
    name: '豪沃 轻卡 4×2 垃圾运输车',
    category: 'garbage',
    brand: '中国重汽',
    horsepower: 160,
    driveType: '4×2',
    engine: '潍柴 WP2.3Q',
    price: '$20,000 - $26,000',
    image: '/images/howo-4x2-garbage-1.jpg',
    images: ['/images/howo-4x2-garbage-1.jpg', '/images/howo-4x2-garbage-2.jpg', '/images/howo-4x2-garbage-3.jpg'],
    features: ['城市环卫', '灵活机动', '密封防漏', '省油']
  },

  // ===== 清障车 =====
  {
    id: 'howo-4x2-wrecker',
    name: '豪沃 轻卡 4×2 清障车',
    category: 'wrecker',
    brand: '中国重汽',
    horsepower: 160,
    driveType: '4×2',
    engine: '潍柴 WP2.3Q',
    price: '$24,000 - $30,000',
    image: '/images/howo-4x2-wrecker-1.jpg',
    images: ['/images/howo-4x2-wrecker-1.jpg', '/images/howo-4x2-wrecker-2.jpg', '/images/howo-4x2-wrecker-3.jpg'],
    features: ['城市救援', '平板拖车', '液压绞盘', '灵活机动']
  },

  // ===== 随车吊 =====
  {
    id: 'howo-tx-crane',
    name: '豪沃 TX 6×4 随车吊',
    category: 'crane',
    brand: '中国重汽',
    horsepower: 400,
    driveType: '6×4',
    engine: '潍柴 WP12.400E62',
    price: '$38,000 - $48,000',
    image: '/images/howo-tx-crane-1.jpg',
    images: ['/images/howo-tx-crane-1.jpg', '/images/howo-tx-crane-2.jpg', '/images/howo-tx-crane-3.jpg'],
    features: ['12吨吊机', '液压支腿', '远程遥控', '360°旋转']
  },
  {
    id: 'howo-4x2-crane',
    name: '豪沃 轻卡 4×2 随车吊',
    category: 'crane',
    brand: '中国重汽',
    horsepower: 160,
    driveType: '4×2',
    engine: '潍柴 WP2.3Q',
    price: '$25,000 - $32,000',
    image: '/images/howo-4x2-crane-1.jpg',
    images: ['/images/howo-4x2-crane-1.jpg', '/images/howo-4x2-crane-2.jpg', '/images/howo-4x2-crane-3.jpg'],
    features: ['轻型随车吊', '城市灵活', '省油', '液压支腿']
  },

  // ===== 高空作业车 =====
  {
    id: 'howo-tx-aerial',
    name: 'HOWO TX 280 高空作业车',
    category: 'aerial',
    brand: '中国重汽',
    horsepower: 280,
    driveType: '4×2',
    engine: '潍柴 WP7.280E62',
    price: '$35,000 - $45,000',
    image: '/images/tractor-1.jpg',
    features: ['28米作业高度', '液压伸缩臂', '安全锁止', '遥控操作']
  },
  {
    id: 'howo-4x2-aerial',
    name: '豪沃 轻卡 4×2 高空作业车',
    category: 'aerial',
    brand: '中国重汽',
    horsepower: 160,
    driveType: '4×2',
    engine: '潍柴 WP2.3Q',
    price: '$28,000 - $35,000',
    image: '/images/howo-4x2-aerial-1.jpg',
    images: ['/images/howo-4x2-aerial-1.jpg', '/images/howo-4x2-aerial-2.jpg', '/images/howo-4x2-aerial-3.jpg'],
    features: ['城市高空作业', '灵活机动', '省油', '安全锁止']
  },

  // ===== 洒水车 =====
  {
    id: 'howo-tx-water',
    name: '豪沃 TX 6×4 洒水车',
    category: 'water',
    brand: '中国重汽',
    horsepower: 340,
    driveType: '6×4',
    engine: '潍柴 WP10.340E62',
    price: '$25,000 - $32,000',
    image: '/images/howo-tx-water-1.jpg',
    images: ['/images/howo-tx-water-1.jpg', '/images/howo-tx-water-2.jpg', '/images/howo-tx-water-3.jpg'],
    features: ['15方水罐', '前冲后洒', '高压水炮', '自吸自排']
  },
  {
    id: 'howo-nx-water',
    name: '豪沃 NX 6×4 洒水车',
    category: 'water',
    brand: '中国重汽',
    horsepower: 340,
    driveType: '6×4',
    engine: '潍柴 WP10.340E62',
    price: '$25,000 - $32,000',
    image: '/images/howo-nx-water-1.jpg',
    images: ['/images/howo-nx-water-1.jpg', '/images/howo-nx-water-2.jpg', '/images/howo-nx-water-3.jpg'],
    features: ['15方水罐', '前冲后洒', '高压水炮', '自吸自排']
  },
  {
    id: 'sitrak-4x2-water',
    name: '汕德卡 4×2 水罐车',
    category: 'water',
    brand: '中国重汽',
    horsepower: 280,
    driveType: '4×2',
    engine: '曼 MC07.280',
    price: '$22,000 - $28,000',
    image: '/images/sitrak-4x2-water-1.jpg',
    images: ['/images/sitrak-4x2-water-1.jpg', '/images/sitrak-4x2-water-2.jpg', '/images/sitrak-4x2-water-3.jpg'],
    features: ['市政洒水', '降尘喷雾', '高压水炮', '曼发动机']
  },

  // ===== 油罐车 =====
  {
    id: 'howo-tx-fuel',
    name: '豪沃 TX 6×4 油罐车',
    category: 'fuel',
    brand: '中国重汽',
    horsepower: 380,
    driveType: '6×4',
    engine: '潍柴 WP12.380E62',
    price: '$30,000 - $40,000',
    image: '/images/howo-tx-fuel-1.jpg',
    images: ['/images/howo-tx-fuel-1.jpg', '/images/howo-tx-fuel-2.jpg', '/images/howo-tx-fuel-3.jpg'],
    features: ['20方油罐', '防爆设计', '油气回收', '静电接地']
  },
  {
    id: 'howo-4x4-fuel',
    name: '豪沃 轻卡 4×4 油罐车',
    category: 'fuel',
    brand: '中国重汽',
    horsepower: 160,
    driveType: '4×4',
    engine: '潍柴 WP2.3Q',
    price: '$22,000 - $28,000',
    image: '/images/howo-4x4-fuel-1.jpg',
    images: ['/images/howo-4x4-fuel-1.jpg', '/images/howo-4x4-fuel-2.jpg', '/images/howo-4x4-fuel-3.jpg'],
    features: ['4×4全驱', '小型油罐', '矿区/工地供油', '防爆设计']
  },

  // ===== 6×6 =====
  {
    id: 'howo-6x6-dump',
    name: '豪沃 6×6 自卸车',
    category: '6x6',
    brand: '中国重汽',
    horsepower: 420,
    driveType: '6×6',
    engine: '潍柴 WP13.420E62',
    price: '$50,000 - $62,000',
    image: '/images/howo-6x6-dump-1.jpg',
    images: ['/images/howo-6x6-dump-1.jpg', '/images/howo-6x6-dump-2.jpg', '/images/howo-6x6-dump-3.jpg'],
    features: ['6×6全驱', '沙漠专用', '加强型货箱', '液压举升']
  },
  {
    id: 'howo-6x6-chassis',
    name: '豪沃 6×6 底盘',
    category: '6x6',
    brand: '中国重汽',
    horsepower: 400,
    driveType: '6×6',
    engine: '潍柴 WP12.400E62',
    price: '$32,000 - $42,000',
    image: '/images/howo-6x6-chassis-1.jpg',
    images: ['/images/howo-6x6-chassis-1.jpg', '/images/howo-6x6-chassis-2.jpg', '/images/howo-6x6-chassis-3.jpg'],
    features: ['6×6全驱', '加强型大梁', '多种上装适配', '军用级底盘']
  },
  {
    id: 'howo-6x6-fuel',
    name: '豪沃 6×6 沙漠油罐车',
    category: '6x6',
    brand: '中国重汽',
    horsepower: 420,
    driveType: '6×6',
    engine: '潍柴 WP13.420E62',
    price: '$45,000 - $58,000',
    image: '/images/howo-6x6-fuel-1.jpg',
    images: ['/images/howo-6x6-fuel-1.jpg', '/images/howo-6x6-fuel-2.jpg', '/images/howo-6x6-fuel-3.jpg'],
    features: ['沙漠专用', '6×6全驱', '大型油罐', '高温适应性']
  },

  // ===== 矿卡 =====
  {
    id: 'tongli-tl875',
    name: '同力 TL875 矿用自卸车',
    category: 'mining',
    brand: '同力重工',
    horsepower: 380,
    driveType: '6×4',
    engine: '潍柴 WP12.380E62',
    price: '$65,000 - $85,000',
    image: '/images/mining-truck.jpg',
    features: ['40吨载重', '矿用宽体', '加强型底盘', '沙漠空滤']
  },
  {
    id: 'xcmg-xdr80t',
    name: '徐工 XDR80T 矿用自卸车',
    category: 'mining',
    brand: '徐工 XCMG',
    horsepower: 420,
    driveType: '6×4',
    engine: '潍柴 WP13.420E62',
    price: '$75,000 - $95,000',
    image: '/images/mining-truck.jpg',
    features: ['45吨载重', '油气悬挂', '自动润滑', '矿用轮胎']
  },
  {
    id: 'lgmg-mt86',
    name: '临工 MT86 矿用宽体车',
    category: 'mining',
    brand: '临工重机',
    horsepower: 400,
    driveType: '6×4',
    engine: '潍柴 WP12.400E62',
    price: '$60,000 - $80,000',
    image: '/images/mining-truck.jpg',
    features: ['35吨载重', '宽体驾驶室', '液力缓速器', '矿用底盘']
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
    image: '/images/trailer-cimc.jpg',
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
    image: '/images/trailer-cimc.jpg',
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

  // ===== 中国重汽轻型车 =====
  {
    id: 'sinotruk-van',
    name: '中国重汽 先锋官 Van',
    category: 'light',
    brand: '中国重汽先锋官',
    horsepower: 150,
    driveType: '4×2',
    engine: '潍柴 WP2.3Q',
    price: '$12,000 - $18,000',
    image: '/images/tractor-1.jpg',
    features: ['12m³货箱', '侧滑门', 'ABS+EBD', '空调']
  },
  {
    id: 'sinotruk-micro',
    name: '中国重汽 轻型微卡',
    category: 'light',
    brand: '中国重汽先锋官',
    horsepower: 112,
    driveType: '4×2',
    engine: '潍柴 WP2.1Q',
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
  { id: 'reefer', name: '冷藏车', nameEn: 'Reefer Truck', icon: '🧊' },
  { id: 'cement', name: '水泥罐车', nameEn: 'Cement Tanker', icon: '🚛' },
  { id: 'garbage', name: '垃圾运输车', nameEn: 'Garbage Truck', icon: '🗑️' },
  { id: 'crane', name: '随车吊', nameEn: 'Truck Crane', icon: '🏗️' },
  { id: 'aerial', name: '高空作业车', nameEn: 'Aerial Platform', icon: '🪜' },
  { id: 'water', name: '洒水车', nameEn: 'Water Truck', icon: '💧' },
  { id: 'fuel', name: '油罐车', nameEn: 'Fuel Tanker', icon: '⛽' },
  { id: 'wrecker', name: '清障车', nameEn: 'Wrecker', icon: '🪝' },
  { id: '6x6', name: '6×6专区', nameEn: '6×6 Off-Road', icon: '🧭' },
  { id: 'machinery', name: '工程机械', nameEn: 'Construction Machinery', icon: '⚙️' },
  { id: 'mining', name: '矿卡', nameEn: 'Mining Truck', icon: '⛏️' },
  { id: 'trailer', name: '挂车', nameEn: 'Trailer', icon: '🔗' },
  { id: 'light', name: '轻型商用车', nameEn: 'Light Commercial', icon: '🚐' }
];

export const stockTrucks: Truck[] = [
  {
    id: 'stock-001',
    name: 'HOWO TX 430 牵引车 现车',
    category: 'tractor',
    brand: '中国重汽',
    horsepower: 430,
    driveType: '6×4',
    engine: '潍柴 WP13.430E62',
    price: '',
    image: '/images/hero-tractor.jpg',
    features: ['已到港', '白色', '高顶双卧铺', '即付即发']
  },
  {
    id: 'stock-002',
    name: 'HOWO 8×4 自卸车 现车',
    category: 'dump',
    brand: '中国重汽',
    horsepower: 380,
    driveType: '8×4',
    engine: '潍柴 WP12.380E62',
    price: '',
    image: '/images/dump-howo.jpg',
    features: ['已到港', '黄色', '加强型货箱', '即付即发']
  },
  {
    id: 'stock-003',
    name: 'SITRAK C7H 440 牵引车 现车',
    category: 'tractor',
    brand: '中国重汽',
    horsepower: 440,
    driveType: '6×4',
    engine: '曼 MC13.440',
    price: '',
    image: '/images/tractor-2.jpg?v=2',
    features: ['已到港', '白色', '豪华驾驶室', '即付即发']
  }
];

export const zones = [
  {
    id: 'heavy-truck',
    title: '重卡专区',
    titleEn: 'Heavy Duty Trucks',
    icon: '🚛',
    brand: '中国重汽',
    description: '牵引车 · 载货车 · 冷藏车 · 自卸车 · 搅拌车 · 水泥罐车 · 垃圾运输车 · 随车吊 · 高空作业车 · 洒水车 · 油罐车',
    categories: ['tractor', 'cargo', 'dump', 'mixer', 'reefer', 'cement', 'garbage', 'crane', 'aerial', 'water', 'fuel', 'wrecker', '6x6'],
    color: 'from-amber-500/20 to-transparent'
  },
  {
    id: 'machinery',
    title: '工程机械专区',
    titleEn: 'Construction Machinery',
    icon: '⚙️',
    brand: '徐工 XCMG',
    description: '挖掘机 · 装载机，矿山/基建/市政工程解决方案',
    categories: ['machinery'],
    color: 'from-orange-500/20 to-transparent'
  },
  {
    id: 'mining',
    title: '矿卡专区',
    titleEn: 'Mining Trucks',
    icon: '⛏️',
    brand: '同力重工 / 徐工 / 临工重机',
    description: '矿用宽体自卸车，40-45吨载重，适应矿山恶劣工况',
    categories: ['mining'],
    color: 'from-red-500/20 to-transparent'
  },
  {
    id: 'light',
    title: '轻型商用车专区',
    titleEn: 'SINOTRUK Light Vehicles',
    icon: '🚐',
    brand: '中国重汽先锋官',
    description: 'Van 先锋官 · 微卡 · 城市物流配送',
    categories: ['light'],
    color: 'from-green-500/20 to-transparent'
  },
  {
    id: 'trailer',
    title: '挂车专区',
    titleEn: 'Trailers',
    icon: '🔗',
    brand: '中集 CIMC',
    description: '平板挂车 · 自卸挂车，全球销量第一挂车品牌',
    categories: ['trailer'],
    color: 'from-blue-500/20 to-transparent'
  }
];

export const advantages = [
  {
    title: '品牌齐全',
    titleEn: 'Full Brand Portfolio',
    description: '中国重汽、徐工机械、中集挂车、先锋官——四大品牌一站式采购',
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
