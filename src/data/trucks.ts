export interface Truck {
  id: string;
  name: string;
  category: 'tractor' | 'cargo' | 'dump' | 'mixer' | 'reefer' | 'light-special' | 'crane' | 'water' | 'fuel' | 'wrecker' | '6x6' | 'trailer' | 'machinery' | 'mining' | 'light';
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
  {
    id: 'sitrak-4x2-cargo',
    name: '汕德卡 4×2 载货车',
    category: 'cargo',
    brand: '中国重汽',
    horsepower: 280,
    driveType: '4×2',
    engine: '曼 MC07.280',
    price: '$25,000 - $32,000',
    image: '/images/sitrak-4x2-cargo-1.jpg',
    images: ['/images/sitrak-4x2-cargo-1.jpg', '/images/sitrak-4x2-cargo-2.jpg', '/images/sitrak-4x2-cargo-3.jpg'],
    features: ['城市物流', '曼发动机', '大货箱', '经济节油']
  },
  {
    id: 'sinotruk-3axle-cargo',
    name: '中国重汽 三轴 牵引载货车',
    category: 'cargo',
    brand: '中国重汽',
    horsepower: 440,
    driveType: '6×4',
    engine: '曼 MC13.440',
    price: '$42,000 - $55,000',
    image: '/images/sinotruk-3axle-cargo-1.jpg',
    images: ['/images/sinotruk-3axle-cargo-1.jpg', '/images/sinotruk-3axle-cargo-2.jpg', '/images/sinotruk-3axle-cargo-3.jpg'],
    features: ['牵引车+挂车', '大载重', '曼发动机', '长途物流']
  },
  {
    id: 'sinotruk-3axle-highside',
    name: '中国重汽 三轴 高栏载货车',
    category: 'cargo',
    brand: '中国重汽',
    horsepower: 440,
    driveType: '6×4',
    engine: '曼 MC13.440',
    price: '$45,000 - $58,000',
    image: '/images/sinotruk-3axle-highside-1.jpg',
    images: ['/images/sinotruk-3axle-highside-1.jpg', '/images/sinotruk-3axle-highside-2.jpg', '/images/sinotruk-3axle-highside-3.jpg'],
    features: ['高栏货箱', '大容量', '曼发动机', '长途运输']
  },

  // ===== 冷藏车 =====
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
  {
    id: 'howo-tx-4x2-reefer',
    name: '豪沃 TX 4×2 冷藏车',
    category: 'reefer',
    brand: '中国重汽',
    horsepower: 210,
    driveType: '4×2',
    engine: '潍柴 WP4.6',
    price: '$28,000 - $35,000',
    image: '/images/howo-tx-4x2-reefer-1.jpg',
    images: ['/images/howo-tx-4x2-reefer-1.jpg', '/images/howo-tx-4x2-reefer-2.jpg', '/images/howo-tx-4x2-reefer-3.jpg'],
    features: ['中卡冷藏', '冷链运输', '省油', '冷王制冷机组']
  },
  {
    id: 'sitrak-8x4-reefer',
    name: '汕德卡 8×4 冷藏车',
    category: 'reefer',
    brand: '中国重汽',
    horsepower: 440,
    driveType: '8×4',
    engine: '曼 MC13.440',
    price: '$48,000 - $60,000',
    image: '/images/sitrak-8x4-reefer-1.jpg',
    images: ['/images/sitrak-8x4-reefer-1.jpg', '/images/sitrak-8x4-reefer-2.jpg'],
    features: ['大型冷藏', '长途冷链', '曼发动机', '冷王制冷机组']
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

  // ===== 轻卡专用车 =====
  {
    id: 'howo-4x2-garbage',
    name: '豪沃 轻卡 4×2 垃圾运输车',
    category: 'light-special',
    brand: '中国重汽',
    horsepower: 160,
    driveType: '4×2',
    engine: '潍柴 WP2.3Q',
    price: '$20,000 - $26,000',
    image: '/images/howo-4x2-garbage-1.jpg',
    images: ['/images/howo-4x2-garbage-1.jpg', '/images/howo-4x2-garbage-2.jpg', '/images/howo-4x2-garbage-3.jpg'],
    features: ['城市环卫', '灵活机动', '密封防漏', '省油']
  },
  {
    id: 'howo-4x2-wrecker',
    name: '豪沃 轻卡 4×2 清障车',
    category: 'light-special',
    brand: '中国重汽',
    horsepower: 160,
    driveType: '4×2',
    engine: '潍柴 WP2.3Q',
    price: '$24,000 - $30,000',
    image: '/images/howo-4x2-wrecker-1.jpg',
    images: ['/images/howo-4x2-wrecker-1.jpg', '/images/howo-4x2-wrecker-2.jpg', '/images/howo-4x2-wrecker-3.jpg'],
    features: ['城市救援', '平板拖车', '液压绞盘', '灵活机动']
  },
  {
    id: 'howo-4x2-aerial',
    name: '豪沃 轻卡 4×2 高空作业车',
    category: 'light-special',
    brand: '中国重汽',
    horsepower: 160,
    driveType: '4×2',
    engine: '潍柴 WP2.3Q',
    price: '$28,000 - $35,000',
    image: '/images/howo-4x2-aerial-1.jpg',
    images: ['/images/howo-4x2-aerial-1.jpg', '/images/howo-4x2-aerial-2.jpg', '/images/howo-4x2-aerial-3.jpg'],
    features: ['城市高空作业', '灵活机动', '省油', '安全锁止']
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
  {
    id: 'howo-nx-8x4-fuel',
    name: '豪沃 NX 8×4 油罐车',
    category: 'fuel',
    brand: '中国重汽',
    horsepower: 430,
    driveType: '8×4',
    engine: '潍柴 WP13.430E62',
    price: '$38,000 - $48,000',
    image: '/images/howo-nx-8x4-fuel-1.jpg',
    images: ['/images/howo-nx-8x4-fuel-1.jpg', '/images/howo-nx-8x4-fuel-2.jpg', '/images/howo-nx-8x4-fuel-3.jpg'],
    features: ['大容量油罐', '防爆设计', '油气回收', '8×4重载']
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
    id: 'sinotruk-90t-mining',
    name: '中国重汽矿卡90',
    category: 'mining',
    brand: '中国重汽',
    horsepower: 480,
    driveType: '6×4',
    engine: '潍柴 WP15.480E62',
    price: '$85,000 - $110,000',
    image: '/images/sinotruk-90t-mining-1.jpg',
    images: ['/images/sinotruk-90t-mining-1.jpg', '/images/sinotruk-90t-mining-2.jpg', '/images/sinotruk-90t-mining-3.jpg'],
    features: ['90吨载重', '矿用宽体', '潍柴15L发动机', '油气悬挂']
  },
  {
    id: 'sinotruk-95-mining',
    name: '中国重汽矿卡70',
    category: 'mining',
    brand: '中国重汽',
    horsepower: 510,
    driveType: '6×4',
    engine: '潍柴 WP16.510E62',
    price: '$92,000 - $120,000',
    image: '/images/sinotruk-95-mining-1.jpg',
    images: ['/images/sinotruk-95-mining-1.jpg', '/images/sinotruk-95-mining-2.jpg', '/images/sinotruk-95-mining-3.jpg'],
    features: ['70吨载重', '矿用宽体', '潍柴16L发动机', '油气悬挂']
  },
  {
    id: 'sinotruk-102-mining',
    name: '中国重汽矿卡102',
    category: 'mining',
    brand: '中国重汽',
    horsepower: 540,
    driveType: '6×6',
    engine: '潍柴 WP17.540E62',
    price: '$108,000 - $138,000',
    image: '/images/sinotruk-90-mining-1.jpg',
    images: ['/images/sinotruk-90-mining-1.jpg', '/images/sinotruk-90-mining-2.jpg', '/images/sinotruk-90-mining-3.jpg'],
    features: ['102吨载重', '矿用宽体', '潍柴17L发动机', '6×6全驱']
  },
  {
    id: 'sinotruk-90-mining',
    name: '中国重汽矿卡105',
    category: 'mining',
    brand: '中国重汽',
    horsepower: 540,
    driveType: '6×4',
    engine: '潍柴 WP17.540E62',
    price: '$100,000 - $130,000',
    image: '/images/sinotruk-102-mining-1.jpg',
    images: ['/images/sinotruk-102-mining-1.jpg', '/images/sinotruk-102-mining-2.jpg', '/images/sinotruk-102-mining-3.jpg'],
    features: ['105吨载重', '矿用宽体', '潍柴17L发动机', '油气悬挂']
  },

  // ===== 挂车（中集） =====
  {
    id: 'cimc-4axle-flat',
    name: '中集 四轴 平板挂车',
    category: 'trailer',
    brand: '中集 CIMC',
    horsepower: 0,
    driveType: '4轴',
    engine: '-',
    price: '$15,000 - $22,000',
    image: '/images/cimc-4axle-flat-1.jpg',
    images: ['/images/cimc-4axle-flat-1.jpg', '/images/cimc-4axle-flat-2.jpg', '/images/cimc-4axle-flat-3.jpg'],
    features: ['四轴重载', '16吨车桥', 'ABS制动', '集装箱锁具']
  },
  {
    id: 'cimc-3axle-curtain',
    name: '中集 三轴 侧帘挂车',
    category: 'trailer',
    brand: '中集 CIMC',
    horsepower: 0,
    driveType: '3轴',
    engine: '-',
    price: '$12,000 - $18,000',
    image: '/images/cimc-3axle-curtain-1.jpg',
    images: ['/images/cimc-3axle-curtain-1.jpg', '/images/cimc-3axle-curtain-2.jpg', '/images/cimc-3axle-curtain-3.jpg'],
    features: ['侧帘式', '快速装卸', '13吨车桥', 'ABS制动']
  },
  {
    id: 'cimc-4axle-lowbed',
    name: '中集 四轴 低平板挂车',
    category: 'trailer',
    brand: '中集 CIMC',
    horsepower: 0,
    driveType: '4轴',
    engine: '-',
    price: '$18,000 - $25,000',
    image: '/images/cimc-4axle-lowbed-1.jpg',
    images: ['/images/cimc-4axle-lowbed-1.jpg', '/images/cimc-4axle-lowbed-2.jpg', '/images/cimc-4axle-lowbed-3.jpg'],
    features: ['低平板', '四轴重载', '工程机械运输', '16吨车桥']
  },
  {
    id: 'cimc-3axle-heavy',
    name: '中集 三轴 大件运输挂车',
    category: 'trailer',
    brand: '中集 CIMC',
    horsepower: 0,
    driveType: '3轴',
    engine: '-',
    price: '$14,000 - $20,000',
    image: '/images/cimc-3axle-heavy-1.jpg',
    images: ['/images/cimc-3axle-heavy-1.jpg', '/images/cimc-3axle-heavy-2.jpg', '/images/cimc-3axle-heavy-3.jpg'],
    features: ['大件运输', '加强型大梁', '13吨车桥', 'ABS制动']
  },
  {
    id: 'cimc-2axle-car',
    name: '中集 两轴 轿运车',
    category: 'trailer',
    brand: '中集 CIMC',
    horsepower: 0,
    driveType: '2轴',
    engine: '-',
    price: '$10,000 - $15,000',
    image: '/images/cimc-2axle-car-1.jpg',
    images: ['/images/cimc-2axle-car-1.jpg', '/images/cimc-2axle-car-2.jpg'],
    features: ['轿运专用', '双层装载', '10吨车桥', 'ABS制动']
  },
  {
    id: 'cimc-semi-dump',
    name: '中集 半挂自卸车',
    category: 'trailer',
    brand: '中集 CIMC',
    horsepower: 0,
    driveType: '3轴',
    engine: '-',
    price: '$14,000 - $20,000',
    image: '/images/cimc-semi-dump-1.jpg',
    images: ['/images/cimc-semi-dump-1.jpg', '/images/cimc-semi-dump-2.jpg', '/images/cimc-semi-dump-3.jpg'],
    features: ['U型货箱', '液压举升', '耐磨钢板', '自动篷布']
  },
  {
    id: 'cimc-reefer',
    name: '中集 半挂冷藏车',
    category: 'trailer',
    brand: '中集 CIMC',
    horsepower: 0,
    driveType: '3轴',
    engine: '-',
    price: '$22,000 - $30,000',
    image: '/images/cimc-reefer-1.jpg',
    images: ['/images/cimc-reefer-1.jpg', '/images/cimc-reefer-2.jpg', '/images/cimc-reefer-3.jpg'],
    features: ['半挂冷藏', '冷王制冷机组', '聚氨酯保温', '-18°C恒温']
  },
  {
    id: 'cimc-fuel-trailer',
    name: '中集 半挂油罐车',
    category: 'trailer',
    brand: '中集 CIMC',
    horsepower: 0,
    driveType: '3轴',
    engine: '-',
    price: '$25,000 - $35,000',
    image: '/images/cimc-fuel-trailer-1.jpg',
    images: ['/images/cimc-fuel-trailer-1.jpg', '/images/cimc-fuel-trailer-2.jpg', '/images/cimc-fuel-trailer-3.jpg'],
    features: ['大容量油罐', '防爆设计', '油气回收', '静电接地']
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
    image: '/images/xcmg-xe215-1.jpg',
    images: ['/images/xcmg-xe215-1.jpg', '/images/xcmg-xe215-2.jpg', '/images/xcmg-xe215-3.jpg'],
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
    image: '/images/xcmg-zl50-1.jpg',
    images: ['/images/xcmg-zl50-1.jpg', '/images/xcmg-zl50-2.jpg', '/images/xcmg-zl50-3.jpg'],
    features: ['5吨', '3.0方铲斗', '液压先导操控', '空调驾驶室']
  },
  {
    id: 'xcmg-25t-crane',
    name: '徐工 25吨 起重机',
    category: 'machinery',
    brand: '徐工 XCMG',
    horsepower: 290,
    driveType: '6×4',
    engine: '潍柴 WP10.290E62',
    price: '$80,000 - $100,000',
    image: '/images/xcmg-25t-crane-1.jpg',
    images: ['/images/xcmg-25t-crane-1.jpg', '/images/xcmg-25t-crane-2.jpg', '/images/xcmg-25t-crane-3.jpg'],
    features: ['25吨吊重', '液压伸缩臂', '360°旋转', '全路面底盘']
  },
  {
    id: 'xcmg-roller',
    name: '徐工 压路机',
    category: 'machinery',
    brand: '徐工 XCMG',
    horsepower: 180,
    driveType: '轮胎式',
    engine: '潍柴 WP6.180E62',
    price: '$35,000 - $50,000',
    image: '/images/xcmg-roller-1.jpg',
    images: ['/images/xcmg-roller-1.jpg', '/images/xcmg-roller-2.jpg', '/images/xcmg-roller-3.jpg'],
    features: ['20吨级', '液压振动', '前后双驱', '全液压转向']
  },
  {
    id: 'xcmg-backhoe',
    name: '徐工 两头忙',
    category: 'machinery',
    brand: '徐工 XCMG',
    horsepower: 100,
    driveType: '4×4',
    engine: '潍柴 WP4.1',
    price: '$38,000 - $52,000',
    image: '/images/xcmg-backhoe-1.jpg',
    images: ['/images/xcmg-backhoe-1.jpg', '/images/xcmg-backhoe-2.jpg', '/images/xcmg-backhoe-3.jpg'],
    features: ['挖掘+装载一体', '多功能', '灵活机动', '市政/农田']
  },
  {
    id: 'xcmg-grader',
    name: '徐工 平地机',
    category: 'machinery',
    brand: '徐工 XCMG',
    horsepower: 220,
    driveType: '6×4',
    engine: '潍柴 WP10.220E62',
    price: '$45,000 - $60,000',
    image: '/images/xcmg-grader-1.jpg',
    images: ['/images/xcmg-grader-1.jpg', '/images/xcmg-grader-2.jpg'],
    features: ['18吨级', '液压操控', '360°回转铲刀', '矿山/公路']
  },
  {
    id: 'xcmg-skid',
    name: '徐工 滑铲机',
    category: 'machinery',
    brand: '徐工 XCMG',
    horsepower: 80,
    driveType: '轮式',
    engine: '潍柴 WP3.2',
    price: '$18,000 - $28,000',
    image: '/images/xcmg-skid-1.jpg',
    images: ['/images/xcmg-skid-1.jpg', '/images/xcmg-skid-2.jpg', '/images/xcmg-skid-3.jpg'],
    features: ['小巧灵活', '多功能', '市政环卫', '低油耗']
  },

  // ===== 中国重汽轻型车 =====
  {
    id: 'sinotruk-cargo-light',
    name: '中国重汽 货运版',
    category: 'light',
    brand: '中国重汽先锋官',
    horsepower: 130,
    driveType: '4×2',
    engine: '潍柴 WP2.3Q',
    price: '$8,000 - $12,000',
    image: '/images/sinotruk-cargo-light-1.jpg',
    images: ['/images/sinotruk-cargo-light-1.jpg', '/images/sinotruk-cargo-light-2.jpg', '/images/sinotruk-cargo-light-3.jpg'],
    features: ['城市货运', '大空间', '省油', '灵活']
  },
  {
    id: 'sinotruk-pass-light',
    name: '中国重汽 客运版',
    category: 'light',
    brand: '中国重汽先锋官',
    horsepower: 150,
    driveType: '4×2',
    engine: '潍柴 WP2.3Q',
    price: '$14,000 - $20,000',
    image: '/images/sinotruk-pass-light-1.jpg',
    images: ['/images/sinotruk-pass-light-1.jpg', '/images/sinotruk-pass-light-2.jpg', '/images/sinotruk-pass-light-3.jpg'],
    features: ['15座', '客运通勤', '舒适', '空调']
  },
  {
    id: 'sinotruk-biz-light',
    name: '中国重汽 商务版',
    category: 'light',
    brand: '中国重汽先锋官',
    horsepower: 150,
    driveType: '4×2',
    engine: '潍柴 WP2.3Q',
    price: '$16,000 - $22,000',
    image: '/images/sinotruk-biz-light-1.jpg',
    images: ['/images/sinotruk-biz-light-1.jpg', '/images/sinotruk-biz-light-2.jpg', '/images/sinotruk-biz-light-3.jpg'],
    features: ['商务接待', '豪华内饰', '9座', '高端']
  }
];

export const categories = [
  { id: 'tractor', name: '牵引车', nameEn: 'Tractor Truck', icon: '🚛' },
  { id: 'cargo', name: '载货车', nameEn: 'Cargo Truck', icon: '📦' },
  { id: 'dump', name: '自卸车', nameEn: 'Dump Truck', icon: '🏗️' },
  { id: 'mixer', name: '搅拌车', nameEn: 'Concrete Mixer', icon: '🔄' },
  { id: 'reefer', name: '冷藏车', nameEn: 'Reefer Truck', icon: '🧊' },
  { id: 'light-special', name: '轻卡专用车', nameEn: 'Light Special', icon: '🚐' },
  { id: 'crane', name: '随车吊', nameEn: 'Truck Crane', icon: '🏗️' },
  { id: 'water', name: '洒水车', nameEn: 'Water Truck', icon: '💧' },
  { id: 'fuel', name: '油罐车', nameEn: 'Fuel Tanker', icon: '⛽' },
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
    categories: ['tractor', 'dump', 'cargo', 'mixer', 'reefer', 'light-special', 'crane', 'water', 'fuel', '6x6'],
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
