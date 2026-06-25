export interface Truck {
  id: string;
  name: string;
  category: 'tractor' | 'dump' | 'mixer' | 'crane' | 'tanker';
  horsepower: number;
  driveType: string;
  engine: string;
  price: string;
  image: string;
  features: string[];
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  product: string;
  message: string;
  createdAt: Date;
}

export const trucks: Truck[] = [
  {
    id: 'howo-tx-430',
    name: 'HOWO TX 430 牵引车',
    category: 'tractor',
    horsepower: 430,
    driveType: '6x4',
    engine: '潍柴 WP13.430E62',
    price: '$28,000 - $35,000',
    image: '/images/tractor-1.jpg',
    features: ['高顶双卧铺', 'ABS防抱死', '空调系统', '气囊座椅']
  },
  {
    id: 'howo-7-380',
    name: 'HOWO 7 380 自卸车',
    category: 'dump',
    horsepower: 380,
    driveType: '6x4',
    engine: '潍柴 WP12.380E62',
    price: '$32,000 - $42,000',
    image: '/images/dump-1.jpg',
    features: ['加强型货箱', '液压举升', '矿山专用轮胎', '防护网']
  },
  {
    id: 'howo-tx-371',
    name: 'HOWO TX 371 搅拌车',
    category: 'mixer',
    horsepower: 371,
    driveType: '8x4',
    engine: '中国重汽 MC13.371',
    price: '$45,000 - $58,000',
    image: '/images/mixer-1.jpg',
    features: ['12方搅拌罐', '恒速控制系统', '耐磨叶片', '自动润滑']
  },
  {
    id: 'sitrak-c7h-440',
    name: 'SITRAK C7H 440 牵引车',
    category: 'tractor',
    horsepower: 440,
    driveType: '6x4',
    engine: '曼 MC13.440',
    price: '$35,000 - $45,000',
    image: '/images/tractor-2.jpg',
    features: ['豪华驾驶室', '液力缓速器', '车道偏离预警', '360°环视']
  },
  {
    id: 'howo-tx-340',
    name: 'HOWO TX 340 洒水车',
    category: 'tanker',
    horsepower: 340,
    driveType: '6x4',
    engine: '潍柴 WP10.340E62',
    price: '$25,000 - $32,000',
    image: '/images/tanker-1.jpg',
    features: ['15方水罐', '前冲后洒', '高压水炮', '自吸自排']
  },
  {
    id: 'howo-7-400',
    name: 'HOWO 7 400 随车吊',
    category: 'crane',
    horsepower: 400,
    driveType: '6x4',
    engine: '潍柴 WP12.400E62',
    price: '$38,000 - $48,000',
    image: '/images/crane-1.jpg',
    features: ['12吨吊机', '液压支腿', '远程遥控', '360°旋转']
  }
];

export const categories = [
  { id: 'tractor', name: '牵引车', nameEn: 'Tractor Truck', icon: '🚛' },
  { id: 'dump', name: '自卸车', nameEn: 'Dump Truck', icon: '🏗️' },
  { id: 'mixer', name: '搅拌车', nameEn: 'Concrete Mixer', icon: '🔄' },
  { id: 'tanker', name: '罐式车', nameEn: 'Tank Truck', icon: '⛽' },
  { id: 'crane', name: '随车吊', nameEn: 'Crane Truck', icon: '🏗️' }
];

export const advantages = [
  {
    title: '品质保证',
    titleEn: 'Quality Assurance',
    description: '中国重汽原厂直供，通过ISO9001质量认证，每台车辆出厂前经过严格检测',
    icon: 'shield'
  },
  {
    title: '价格优势',
    titleEn: 'Competitive Price',
    description: '厂家直销，省去中间环节，同等配置价格低于市场价15%-20%',
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
  { region: '非洲', countries: ['阿尔及利亚', '尼日利亚', '埃塞俄比亚', '坦桑尼亚', '肯尼亚'], count: 45 },
  { region: '中东', countries: ['沙特阿拉伯', '阿联酋', '伊拉克', '约旦', '科威特'], count: 32 },
  { region: '东南亚', countries: ['越南', '菲律宾', '印度尼西亚', '缅甸', '老挝'], count: 28 },
  { region: '中亚', countries: ['哈萨克斯坦', '乌兹别克斯坦', '土库曼斯坦', '吉尔吉斯斯坦'], count: 18 }
];
