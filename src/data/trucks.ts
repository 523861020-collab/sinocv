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
  // ===== Tractor Trucks =====
  {
    id: 'sitrak-g7',
    name: 'SITRAK G7 6×4 Tractor',
    category: 'tractor',
    brand: 'SINOTRUK',
    horsepower: 540,
    driveType: '6×4',
    engine: 'MAN MC13 / MC11',
    price: '$35,000 - $55,000',
    image: '/images/sitrak-12.jpg',
    images: ['/images/sitrak-12.jpg', '/images/sitrak-13.jpg', '/images/sitrak-14.jpg'],
    features: ['430HP · 480HP · 540HP', 'MAN Engine', 'ZF Transmission', 'Luxury Cabin']
  },
  {
    id: 'howo-tx',
    name: 'HOWO TX 6×4 Tractor',
    category: 'tractor',
    brand: 'SINOTRUK',
    horsepower: 430,
    driveType: '6×4',
    engine: 'Weichai / MAN',
    price: '$28,000 - $42,000',
    image: '/images/howo-15.jpg',
    images: ['/images/howo-15.jpg', '/images/howo-16.jpg', '/images/howo-17.jpg'],
    features: ['340HP · 380HP · 400HP · 430HP', 'Weichai/MAN Engine', 'High Roof Sleeper', 'ABS+AC']
  },
  {
    id: 'howo-nx',
    name: 'HOWO NX 6×4 Tractor',
    category: 'tractor',
    brand: 'SINOTRUK',
    horsepower: 430,
    driveType: '6×4',
    engine: 'Weichai',
    price: '$30,000 - $40,000',
    image: '/images/howo-nx-1.jpg',
    images: ['/images/howo-nx-1.jpg', '/images/howo-nx-2.jpg', '/images/howo-nx-3.jpg'],
    features: ['380HP · 400HP · 430HP', 'Weichai Engine', 'High Roof Sleeper', 'ABS+AC']
  },
  // ===== Cargo Trucks =====
  {
    id: 'howo-tx-cargo-340',
    name: 'HOWO TX 340 Cargo Truck',
    category: 'cargo',
    brand: 'SINOTRUK',
    horsepower: 340,
    driveType: '8×4',
    engine: 'Weichai WP10.340E62',
    price: '$25,000 - $32,000',
    image: '/images/hero-2.jpg',
    features: ['9.6m Cargo Box', 'Air Suspension Seat', 'Multimedia Console', 'Cruise Control']
  },
  {
    id: 'sitrak-curtain',
    name: 'SITRAK 6×4 Curtain Cargo',
    category: 'cargo',
    brand: 'SINOTRUK',
    horsepower: 440,
    driveType: '6×4',
    engine: 'MAN MC13.440',
    price: '$38,000 - $48,000',
    image: '/images/sitrak-curtain-1.jpg',
    images: ['/images/sitrak-curtain-1.jpg', '/images/sitrak-curtain-2.jpg', '/images/sitrak-curtain-3.jpg'],
    features: ['Curtain Side', 'Quick Loading', 'Large Capacity', 'MAN Engine']
  },
  {
    id: 'sitrak-4x2-cargo',
    name: 'SITRAK 4×2 Cargo Truck',
    category: 'cargo',
    brand: 'SINOTRUK',
    horsepower: 280,
    driveType: '4×2',
    engine: 'MAN MC07.280',
    price: '$25,000 - $32,000',
    image: '/images/sitrak-4x2-cargo-1.jpg',
    images: ['/images/sitrak-4x2-cargo-1.jpg', '/images/sitrak-4x2-cargo-2.jpg', '/images/sitrak-4x2-cargo-3.jpg'],
    features: ['City Logistics', 'MAN Engine', 'Large Box', 'Fuel Efficient']
  },
  // ===== Reefer Trucks =====
  {
    id: 'howo-4x2-reefer',
    name: 'HOWO 4×2 Reefer Truck',
    category: 'reefer',
    brand: 'SINOTRUK',
    horsepower: 160,
    driveType: '4×2',
    engine: 'Weichai WP2.3Q',
    price: '$22,000 - $28,000',
    image: '/images/howo-4x2-reefer-1.jpg',
    images: ['/images/howo-4x2-reefer-1.jpg', '/images/howo-4x2-reefer-2.jpg', '/images/howo-4x2-reefer-3.jpg'],
    features: ['Light Reefer', 'City Delivery', 'Low Fuel', 'Thermo King Unit']
  },
  {
    id: 'howo-tx-4x2-reefer',
    name: 'HOWO TX 4×2 Reefer Truck',
    category: 'reefer',
    brand: 'SINOTRUK',
    horsepower: 210,
    driveType: '4×2',
    engine: 'Weichai WP4.6',
    price: '$28,000 - $35,000',
    image: '/images/howo-tx-4x2-reefer-1.jpg',
    images: ['/images/howo-tx-4x2-reefer-1.jpg', '/images/howo-tx-4x2-reefer-2.jpg', '/images/howo-tx-4x2-reefer-3.jpg'],
    features: ['Medium Reefer', 'Cold Chain', 'Fuel Efficient', 'Thermo King Unit']
  },
  {
    id: 'sitrak-8x4-reefer',
    name: 'SITRAK 8×4 Reefer Truck',
    category: 'reefer',
    brand: 'SINOTRUK',
    horsepower: 440,
    driveType: '8×4',
    engine: 'MAN MC13.440',
    price: '$48,000 - $60,000',
    image: '/images/sitrak-8x4-reefer-1.jpg',
    images: ['/images/sitrak-8x4-reefer-1.jpg', '/images/sitrak-8x4-reefer-2.jpg'],
    features: ['Large Reefer', 'Long-haul Cold Chain', 'MAN Engine', 'Thermo King Unit']
  },
  // ===== Dump Trucks =====
  {
    id: 'howo-dump',
    name: 'HOWO TX 6×4 Dump Truck',
    category: 'dump',
    brand: 'SINOTRUK',
    horsepower: 400,
    driveType: '6×4',
    engine: 'Weichai WP12.400E62',
    price: '$38,000 - $48,000',
    image: '/images/howo-dump-1.jpg',
    images: ['/images/howo-dump-1.jpg', '/images/howo-dump-2.jpg', '/images/howo-dump-3.jpg'],
    features: ['Reinforced Box', 'Hydraulic Lift', 'Mining Tires', 'Safety Mesh']
  },
  {
    id: 'howo-nx-dump',
    name: 'HOWO NX 6×4 Dump Truck',
    category: 'dump',
    brand: 'SINOTRUK',
    horsepower: 430,
    driveType: '6×4',
    engine: 'Weichai WP13.430E62',
    price: '$42,000 - $52,000',
    image: '/images/howo-nx-dump-1.jpg',
    images: ['/images/howo-nx-dump-1.jpg', '/images/howo-nx-dump-2.jpg', '/images/howo-nx-dump-3.jpg'],
    features: ['Reinforced Box', 'Hydraulic Lift', 'Mining Tires', 'Safety Mesh']
  },
  {
    id: 'sitrak-dump',
    name: 'SITRAK 6×4 Dump Truck',
    category: 'dump',
    brand: 'SINOTRUK',
    horsepower: 440,
    driveType: '6×4',
    engine: 'MAN MC13.440',
    price: '$40,000 - $52,000',
    image: '/images/sitrak-dump-1.jpg',
    images: ['/images/sitrak-dump-1.jpg', '/images/sitrak-dump-2.jpg', '/images/sitrak-dump-3.jpg'],
    features: ['MAN Engine', 'Reinforced Box', 'Hydraulic Lift', 'Mining Spec']
  },
  // ===== Mixer Trucks =====
  {
    id: 'howo-nx-mixer',
    name: 'HOWO NX 8×4 Mixer',
    category: 'mixer',
    brand: 'SINOTRUK',
    horsepower: 430,
    driveType: '8×4',
    engine: 'Weichai WP13.430E62',
    price: '$48,000 - $58,000',
    image: '/images/howo-nx-mixer-1.jpg',
    images: ['/images/howo-nx-mixer-1.jpg', '/images/howo-nx-mixer-2.jpg', '/images/howo-nx-mixer-3.jpg'],
    features: ['12m³ Drum', 'Constant Speed', 'Wear-resistant Blades', 'Auto-lubrication']
  },
  {
    id: 'howo-mixer',
    name: 'HOWO TX 6×4 Mixer',
    category: 'mixer',
    brand: 'SINOTRUK',
    horsepower: 400,
    driveType: '6×4',
    engine: 'Weichai WP12.400E62',
    price: '$43,000 - $53,000',
    image: '/images/howo-mixer-1.jpg',
    images: ['/images/howo-mixer-1.jpg', '/images/howo-mixer-2.jpg', '/images/howo-mixer-3.jpg'],
    features: ['12m³ Drum', 'Constant Speed', 'Wear-resistant Blades', 'Auto-lubrication']
  },
  {
    id: 'sitrak-mixer',
    name: 'SITRAK 6×4 Mixer',
    category: 'mixer',
    brand: 'SINOTRUK',
    horsepower: 440,
    driveType: '6×4',
    engine: 'MAN MC13.440',
    price: '$48,000 - $60,000',
    image: '/images/sitrak-mixer-1.jpg',
    images: ['/images/sitrak-mixer-1.jpg', '/images/sitrak-mixer-2.jpg', '/images/sitrak-mixer-3.jpg'],
    features: ['12m³ Drum', 'Constant Speed', 'Wear-resistant Blades', 'Auto-lubrication']
  },
  // ===== Light Special Vehicles =====
  {
    id: 'howo-4x2-garbage',
    name: 'HOWO 4×2 Garbage Truck',
    category: 'light-special',
    brand: 'SINOTRUK',
    horsepower: 160,
    driveType: '4×2',
    engine: 'Weichai WP2.3Q',
    price: '$20,000 - $26,000',
    image: '/images/howo-4x2-garbage-1.jpg',
    images: ['/images/howo-4x2-garbage-1.jpg', '/images/howo-4x2-garbage-2.jpg', '/images/howo-4x2-garbage-3.jpg'],
    features: ['Municipal', 'Compact', 'Sealed', 'Fuel Efficient']
  },
  {
    id: 'howo-4x2-wrecker',
    name: 'HOWO 4×2 Wrecker',
    category: 'light-special',
    brand: 'SINOTRUK',
    horsepower: 160,
    driveType: '4×2',
    engine: 'Weichai WP2.3Q',
    price: '$24,000 - $30,000',
    image: '/images/howo-4x2-wrecker-1.jpg',
    images: ['/images/howo-4x2-wrecker-1.jpg', '/images/howo-4x2-wrecker-2.jpg', '/images/howo-4x2-wrecker-3.jpg'],
    features: ['City Rescue', 'Flatbed', 'Hydraulic Winch', 'Compact']
  },
  {
    id: 'howo-4x2-aerial',
    name: 'HOWO 4×2 Aerial Platform',
    category: 'light-special',
    brand: 'SINOTRUK',
    horsepower: 160,
    driveType: '4×2',
    engine: 'Weichai WP2.3Q',
    price: '$28,000 - $35,000',
    image: '/images/howo-4x2-aerial-1.jpg',
    images: ['/images/howo-4x2-aerial-1.jpg', '/images/howo-4x2-aerial-2.jpg', '/images/howo-4x2-aerial-3.jpg'],
    features: ['City Aerial Work', 'Compact', 'Fuel Efficient', 'Safety Lock']
  },
  // ===== Crane Trucks =====
  {
    id: 'howo-tx-crane',
    name: 'HOWO TX 6×4 Truck Crane',
    category: 'crane',
    brand: 'SINOTRUK',
    horsepower: 400,
    driveType: '6×4',
    engine: 'Weichai WP12.400E62',
    price: '$38,000 - $48,000',
    image: '/images/howo-tx-crane-1.jpg',
    images: ['/images/howo-tx-crane-1.jpg', '/images/howo-tx-crane-2.jpg', '/images/howo-tx-crane-3.jpg'],
    features: ['12T Crane', 'Hydraulic Legs', 'Remote Control', '360° Rotation']
  },
  {
    id: 'howo-4x2-crane',
    name: 'HOWO 4×2 Truck Crane',
    category: 'crane',
    brand: 'SINOTRUK',
    horsepower: 160,
    driveType: '4×2',
    engine: 'Weichai WP2.3Q',
    price: '$25,000 - $32,000',
    image: '/images/howo-4x2-crane-1.jpg',
    images: ['/images/howo-4x2-crane-1.jpg', '/images/howo-4x2-crane-2.jpg', '/images/howo-4x2-crane-3.jpg'],
    features: ['Light Crane', 'City Flexible', 'Fuel Efficient', 'Hydraulic Legs']
  },
  // ===== Water Trucks =====
  {
    id: 'howo-tx-water',
    name: 'HOWO TX 6×4 Water Truck',
    category: 'water',
    brand: 'SINOTRUK',
    horsepower: 340,
    driveType: '6×4',
    engine: 'Weichai WP10.340E62',
    price: '$25,000 - $32,000',
    image: '/images/howo-tx-water-1.jpg',
    images: ['/images/howo-tx-water-1.jpg', '/images/howo-tx-water-2.jpg', '/images/howo-tx-water-3.jpg'],
    features: ['15m³ Tank', 'Front Spray', 'Water Cannon', 'Self-priming']
  },
  {
    id: 'howo-nx-water',
    name: 'HOWO NX 6×4 Water Truck',
    category: 'water',
    brand: 'SINOTRUK',
    horsepower: 340,
    driveType: '6×4',
    engine: 'Weichai WP10.340E62',
    price: '$25,000 - $32,000',
    image: '/images/howo-nx-water-1.jpg',
    images: ['/images/howo-nx-water-1.jpg', '/images/howo-nx-water-2.jpg', '/images/howo-nx-water-3.jpg'],
    features: ['15m³ Tank', 'Front Spray', 'Water Cannon', 'Self-priming']
  },
  {
    id: 'sitrak-4x2-water',
    name: 'SITRAK 4×2 Water Truck',
    category: 'water',
    brand: 'SINOTRUK',
    horsepower: 280,
    driveType: '4×2',
    engine: 'MAN MC07.280',
    price: '$22,000 - $28,000',
    image: '/images/sitrak-4x2-water-1.jpg',
    images: ['/images/sitrak-4x2-water-1.jpg', '/images/sitrak-4x2-water-2.jpg', '/images/sitrak-4x2-water-3.jpg'],
    features: ['Municipal Spray', 'Dust Control', 'Water Cannon', 'MAN Engine']
  },
  // ===== Fuel Tankers =====
  {
    id: 'howo-tx-fuel',
    name: 'HOWO TX 6×4 Fuel Tanker',
    category: 'fuel',
    brand: 'SINOTRUK',
    horsepower: 380,
    driveType: '6×4',
    engine: 'Weichai WP12.380E62',
    price: '$30,000 - $40,000',
    image: '/images/howo-tx-fuel-1.jpg',
    images: ['/images/howo-tx-fuel-1.jpg', '/images/howo-tx-fuel-2.jpg', '/images/howo-tx-fuel-3.jpg'],
    features: ['20m³ Tank', 'Explosion Proof', 'Vapor Recovery', 'Static Grounding']
  },
  {
    id: 'howo-4x4-fuel',
    name: 'HOWO 4×4 Fuel Tanker',
    category: 'fuel',
    brand: 'SINOTRUK',
    horsepower: 160,
    driveType: '4×4',
    engine: 'Weichai WP2.3Q',
    price: '$22,000 - $28,000',
    image: '/images/howo-4x4-fuel-1.jpg',
    images: ['/images/howo-4x4-fuel-1.jpg', '/images/howo-4x4-fuel-2.jpg', '/images/howo-4x4-fuel-3.jpg'],
    features: ['4×4 AWD', 'Small Tank', 'Mine/Site Refuel', 'Explosion Proof']
  },
  {
    id: 'howo-nx-8x4-fuel',
    name: 'HOWO NX 8×4 Fuel Tanker',
    category: 'fuel',
    brand: 'SINOTRUK',
    horsepower: 430,
    driveType: '8×4',
    engine: 'Weichai WP13.430E62',
    price: '$38,000 - $48,000',
    image: '/images/howo-nx-8x4-fuel-1.jpg',
    images: ['/images/howo-nx-8x4-fuel-1.jpg', '/images/howo-nx-8x4-fuel-2.jpg', '/images/howo-nx-8x4-fuel-3.jpg'],
    features: ['Large Tank', 'Explosion Proof', 'Vapor Recovery', '8×4 Heavy Duty']
  },
  // ===== 6×6 =====
  {
    id: 'howo-6x6-dump',
    name: 'HOWO 6×6 Dump Truck',
    category: '6x6',
    brand: 'SINOTRUK',
    horsepower: 420,
    driveType: '6×6',
    engine: 'Weichai WP13.420E62',
    price: '$50,000 - $62,000',
    image: '/images/howo-6x6-dump-1.jpg',
    images: ['/images/howo-6x6-dump-1.jpg', '/images/howo-6x6-dump-2.jpg', '/images/howo-6x6-dump-3.jpg'],
    features: ['6×6 AWD', 'Desert Spec', 'Reinforced Box', 'Hydraulic Lift']
  },
  {
    id: 'howo-6x6-chassis',
    name: 'HOWO 6×6 Chassis',
    category: '6x6',
    brand: 'SINOTRUK',
    horsepower: 400,
    driveType: '6×6',
    engine: 'Weichai WP12.400E62',
    price: '$32,000 - $42,000',
    image: '/images/howo-6x6-chassis-1.jpg',
    images: ['/images/howo-6x6-chassis-1.jpg', '/images/howo-6x6-chassis-2.jpg', '/images/howo-6x6-chassis-3.jpg'],
    features: ['6×6 AWD', 'Reinforced Frame', 'Multi-body Fit', 'Military Grade']
  },
  {
    id: 'howo-6x6-fuel',
    name: 'HOWO 6×6 Desert Fuel Tanker',
    category: '6x6',
    brand: 'SINOTRUK',
    horsepower: 420,
    driveType: '6×6',
    engine: 'Weichai WP13.420E62',
    price: '$45,000 - $58,000',
    image: '/images/howo-6x6-fuel-1.jpg',
    images: ['/images/howo-6x6-fuel-1.jpg', '/images/howo-6x6-fuel-2.jpg', '/images/howo-6x6-fuel-3.jpg'],
    features: ['Desert Spec', '6×6 AWD', 'Large Tank', 'High Temp Adapt']
  },
  // ===== Mining Trucks =====
  {
    id: 'sinotruk-90t-mining',
    name: 'SINOTRUK Mining Truck 90',
    category: 'mining',
    brand: 'SINOTRUK',
    horsepower: 480,
    driveType: '6×4',
    engine: 'Weichai WP15.480E62',
    price: '$85,000 - $110,000',
    image: '/images/sinotruk-90t-mining-1.jpg',
    images: ['/images/sinotruk-90t-mining-1.jpg', '/images/sinotruk-90t-mining-2.jpg', '/images/sinotruk-90t-mining-3.jpg'],
    features: ['90T Payload', 'Mining Wide-body', 'Weichai 15L Engine', 'Hydro-pneumatic']
  },
  {
    id: 'sinotruk-95-mining',
    name: 'SINOTRUK Mining Truck 70',
    category: 'mining',
    brand: 'SINOTRUK',
    horsepower: 510,
    driveType: '6×4',
    engine: 'Weichai WP16.510E62',
    price: '$92,000 - $120,000',
    image: '/images/sinotruk-95-mining-1.jpg',
    images: ['/images/sinotruk-95-mining-1.jpg', '/images/sinotruk-95-mining-2.jpg', '/images/sinotruk-95-mining-3.jpg'],
    features: ['70T Payload', 'Mining Wide-body', 'Weichai 16L Engine', 'Hydro-pneumatic']
  },
  {
    id: 'sinotruk-102-mining',
    name: 'SINOTRUK Mining Truck 102',
    category: 'mining',
    brand: 'SINOTRUK',
    horsepower: 540,
    driveType: '6×6',
    engine: 'Weichai WP17.540E62',
    price: '$108,000 - $138,000',
    image: '/images/sinotruk-90-mining-1.jpg',
    images: ['/images/sinotruk-90-mining-1.jpg', '/images/sinotruk-90-mining-2.jpg', '/images/sinotruk-90-mining-3.jpg'],
    features: ['102T Payload', 'Mining Wide-body', 'Weichai 17L Engine', '6×6 AWD']
  },
  {
    id: 'sinotruk-90-mining',
    name: 'SINOTRUK Mining Truck 105',
    category: 'mining',
    brand: 'SINOTRUK',
    horsepower: 540,
    driveType: '6×4',
    engine: 'Weichai WP17.540E62',
    price: '$100,000 - $130,000',
    image: '/images/sinotruk-102-mining-1.jpg',
    images: ['/images/sinotruk-102-mining-1.jpg', '/images/sinotruk-102-mining-2.jpg', '/images/sinotruk-102-mining-3.jpg'],
    features: ['105T Payload', 'Mining Wide-body', 'Weichai 17L Engine', 'Hydro-pneumatic']
  },
  // ===== Trailers =====
  {
    id: 'sinotruk-3axle-cargo',
    name: 'Tractor Cargo Trailer',
    category: 'trailer',
    brand: 'SINOTRUK',
    horsepower: 440,
    driveType: '6×4',
    engine: 'MAN MC13.440',
    price: '$42,000 - $55,000',
    image: '/images/sinotruk-3axle-cargo-1.jpg',
    images: ['/images/sinotruk-3axle-cargo-1.jpg', '/images/sinotruk-3axle-cargo-2.jpg', '/images/sinotruk-3axle-cargo-3.jpg'],
    features: ['Tractor+Trailer', 'Heavy Load', 'MAN Engine', 'Long-haul']
  },
  {
    id: 'sinotruk-3axle-highside',
    name: 'High-side Cargo Trailer',
    category: 'trailer',
    brand: 'SINOTRUK',
    horsepower: 440,
    driveType: '6×4',
    engine: 'MAN MC13.440',
    price: '$45,000 - $58,000',
    image: '/images/sinotruk-3axle-highside-1.jpg',
    images: ['/images/sinotruk-3axle-highside-1.jpg', '/images/sinotruk-3axle-highside-2.jpg', '/images/sinotruk-3axle-highside-3.jpg'],
    features: ['High-side Box', 'Large Capacity', 'MAN Engine', 'Long-haul']
  },
  {
    id: 'cimc-4axle-flat',
    name: 'Flatbed Trailer',
    category: 'trailer',
    brand: 'CIMC',
    horsepower: 0,
    driveType: '4 Axles',
    engine: '-',
    price: '$15,000 - $22,000',
    image: '/images/cimc-4axle-flat-1.jpg',
    images: ['/images/cimc-4axle-flat-1.jpg', '/images/cimc-4axle-flat-2.jpg', '/images/cimc-4axle-flat-3.jpg'],
    features: ['4-Axle Heavy Duty', '16T Axles', 'ABS', 'Container Locks']
  },
  {
    id: 'cimc-3axle-curtain',
    name: 'Curtain Side Trailer',
    category: 'trailer',
    brand: 'CIMC',
    horsepower: 0,
    driveType: '3 Axles',
    engine: '-',
    price: '$12,000 - $18,000',
    image: '/images/cimc-3axle-curtain-1.jpg',
    images: ['/images/cimc-3axle-curtain-1.jpg', '/images/cimc-3axle-curtain-2.jpg', '/images/cimc-3axle-curtain-3.jpg'],
    features: ['Curtain Side', 'Quick Loading', '13T Axles', 'ABS']
  },
  {
    id: 'cimc-4axle-lowbed',
    name: 'Low-bed Trailer',
    category: 'trailer',
    brand: 'CIMC',
    horsepower: 0,
    driveType: '4 Axles',
    engine: '-',
    price: '$18,000 - $25,000',
    image: '/images/cimc-4axle-lowbed-1.jpg',
    images: ['/images/cimc-4axle-lowbed-1.jpg', '/images/cimc-4axle-lowbed-2.jpg', '/images/cimc-4axle-lowbed-3.jpg'],
    features: ['Low-bed', '4-Axle Heavy Duty', 'Equipment Transport', '16T Axles']
  },
  {
    id: 'cimc-3axle-heavy',
    name: 'Heavy Haul Trailer',
    category: 'trailer',
    brand: 'CIMC',
    horsepower: 0,
    driveType: '3 Axles',
    engine: '-',
    price: '$14,000 - $20,000',
    image: '/images/cimc-3axle-heavy-1.jpg',
    images: ['/images/cimc-3axle-heavy-1.jpg', '/images/cimc-3axle-heavy-2.jpg', '/images/cimc-3axle-heavy-3.jpg'],
    features: ['Heavy Haul', 'Reinforced Frame', '13T Axles', 'ABS']
  },
  {
    id: 'cimc-2axle-car',
    name: 'Car Carrier Trailer',
    category: 'trailer',
    brand: 'CIMC',
    horsepower: 0,
    driveType: '2 Axles',
    engine: '-',
    price: '$10,000 - $15,000',
    image: '/images/cimc-2axle-car-1.jpg',
    images: ['/images/cimc-2axle-car-1.jpg', '/images/cimc-2axle-car-2.jpg'],
    features: ['Car Carrier', 'Double Deck', '10T Axles', 'ABS']
  },
  {
    id: 'cimc-semi-dump',
    name: 'Dump Trailer',
    category: 'trailer',
    brand: 'CIMC',
    horsepower: 0,
    driveType: '3 Axles',
    engine: '-',
    price: '$14,000 - $20,000',
    image: '/images/cimc-semi-dump-1.jpg',
    images: ['/images/cimc-semi-dump-1.jpg', '/images/cimc-semi-dump-2.jpg', '/images/cimc-semi-dump-3.jpg'],
    features: ['U-shaped Box', 'Hydraulic Lift', 'Wear Plate', 'Auto Cover']
  },
  {
    id: 'cimc-reefer',
    name: 'Reefer Trailer',
    category: 'trailer',
    brand: 'CIMC',
    horsepower: 0,
    driveType: '3 Axles',
    engine: '-',
    price: '$22,000 - $30,000',
    image: '/images/cimc-reefer-1.jpg',
    images: ['/images/cimc-reefer-1.jpg', '/images/cimc-reefer-2.jpg', '/images/cimc-reefer-3.jpg'],
    features: ['Reefer Trailer', 'Thermo King Unit', 'Polyurethane Insulation', '-18°C']
  },
  {
    id: 'cimc-fuel-trailer',
    name: 'Fuel Tank Trailer',
    category: 'trailer',
    brand: 'CIMC',
    horsepower: 0,
    driveType: '3 Axles',
    engine: '-',
    price: '$25,000 - $35,000',
    image: '/images/cimc-fuel-trailer-1.jpg',
    images: ['/images/cimc-fuel-trailer-1.jpg', '/images/cimc-fuel-trailer-2.jpg', '/images/cimc-fuel-trailer-3.jpg'],
    features: ['Large Tank', 'Explosion Proof', 'Vapor Recovery', 'Grounding']
  },
  {
    id: 'cimc-lng-trailer',
    name: 'LNG Tank Trailer',
    category: 'trailer',
    brand: 'CIMC',
    horsepower: 0,
    driveType: '3 Axles',
    engine: '-',
    price: '$28,000 - $38,000',
    image: '/images/cimc-lng-trailer-1.jpg',
    images: ['/images/cimc-lng-trailer-1.jpg', '/images/cimc-lng-trailer-2.jpg', '/images/cimc-lng-trailer-3.jpg'],
    features: ['LNG Cryogenic', 'Vacuum Insulated', 'Safety Valves']
  },
  {
    id: 'cimc-powder-trailer',
    name: 'Powder Tank Trailer',
    category: 'trailer',
    brand: 'CIMC',
    horsepower: 0,
    driveType: '3 Axles',
    engine: '-',
    price: '$20,000 - $28,000',
    image: '/images/cimc-powder-trailer-1.jpg',
    images: ['/images/cimc-powder-trailer-1.jpg', '/images/cimc-powder-trailer-2.jpg', '/images/cimc-powder-trailer-3.jpg'],
    features: ['Powder Tank', 'Compressor Discharge', 'Safety Valve', 'Anti-clog']
  },
  // ===== Construction Machinery (XCMG) =====
  {
    id: 'xcmg-excavator-215',
    name: 'XCMG XE215 Excavator',
    category: 'machinery',
    brand: 'XCMG',
    horsepower: 168,
    driveType: 'Tracked',
    engine: 'Cummins QSB7',
    price: '$55,000 - $75,000',
    image: '/images/xcmg-xe215-1.jpg',
    images: ['/images/xcmg-xe215-1.jpg', '/images/xcmg-xe215-2.jpg', '/images/xcmg-xe215-3.jpg'],
    features: ['21.5T', '1.1m³ Bucket', 'Smart Control', 'Mining Strengthened']
  },
  {
    id: 'xcmg-loader-zl50',
    name: 'XCMG ZL50GN Loader',
    category: 'machinery',
    brand: 'XCMG',
    horsepower: 220,
    driveType: '4×4',
    engine: 'Weichai WD10G220',
    price: '$35,000 - $48,000',
    image: '/images/xcmg-zl50-1.jpg',
    images: ['/images/xcmg-zl50-1.jpg', '/images/xcmg-zl50-2.jpg', '/images/xcmg-zl50-3.jpg'],
    features: ['5T', '3.0m³ Bucket', 'Hydraulic Pilot', 'AC Cabin']
  },
  {
    id: 'xcmg-25t-crane',
    name: 'XCMG 25T Mobile Crane',
    category: 'machinery',
    brand: 'XCMG',
    horsepower: 290,
    driveType: '6×4',
    engine: 'Weichai WP10.290E62',
    price: '$80,000 - $100,000',
    image: '/images/xcmg-25t-crane-1.jpg',
    images: ['/images/xcmg-25t-crane-1.jpg', '/images/xcmg-25t-crane-2.jpg', '/images/xcmg-25t-crane-3.jpg'],
    features: ['25T Lift', 'Telescopic Boom', '360° Rotation', 'All-terrain']
  },
  {
    id: 'xcmg-roller',
    name: 'XCMG Road Roller',
    category: 'machinery',
    brand: 'XCMG',
    horsepower: 180,
    driveType: 'Wheel Type',
    engine: 'Weichai WP6.180E62',
    price: '$35,000 - $50,000',
    image: '/images/xcmg-roller-1.jpg',
    images: ['/images/xcmg-roller-1.jpg', '/images/xcmg-roller-2.jpg', '/images/xcmg-roller-3.jpg'],
    features: ['20T Class', 'Hydraulic Vibration', 'Dual Drive', 'Full Hydraulic Steering']
  },
  {
    id: 'xcmg-backhoe',
    name: 'XCMG Backhoe Loader',
    category: 'machinery',
    brand: 'XCMG',
    horsepower: 100,
    driveType: '4×4',
    engine: 'Weichai WP4.1',
    price: '$38,000 - $52,000',
    image: '/images/xcmg-backhoe-1.jpg',
    images: ['/images/xcmg-backhoe-1.jpg', '/images/xcmg-backhoe-2.jpg', '/images/xcmg-backhoe-3.jpg'],
    features: ['Dig+Load Combo', 'Multi-function', 'Compact', 'Municipal/Farm']
  },
  {
    id: 'xcmg-grader',
    name: 'XCMG Motor Grader',
    category: 'machinery',
    brand: 'XCMG',
    horsepower: 220,
    driveType: '6×4',
    engine: 'Weichai WP10.220E62',
    price: '$45,000 - $60,000',
    image: '/images/xcmg-grader-1.jpg',
    images: ['/images/xcmg-grader-1.jpg', '/images/xcmg-grader-2.jpg'],
    features: ['18T Class', 'Hydraulic Control', '360° Blade', 'Mining/Highway']
  },
  {
    id: 'xcmg-skid',
    name: 'XCMG Skid Steer Loader',
    category: 'machinery',
    brand: 'XCMG',
    horsepower: 80,
    driveType: 'Wheel',
    engine: 'Weichai WP3.2',
    price: '$18,000 - $28,000',
    image: '/images/xcmg-skid-1.jpg',
    images: ['/images/xcmg-skid-1.jpg', '/images/xcmg-skid-2.jpg', '/images/xcmg-skid-3.jpg'],
    features: ['Compact', 'Multi-function', 'Municipal', 'Low Fuel']
  },
  // ===== Light Vehicles =====
  {
    id: 'sinotruk-cargo-light',
    name: 'SINOTRUK Light Cargo',
    category: 'light',
    brand: 'SINOTRUK Light',
    horsepower: 130,
    driveType: '4×2',
    engine: 'Weichai WP2.3Q',
    price: '$8,000 - $12,000',
    image: '/images/sinotruk-cargo-light-1.jpg',
    images: ['/images/sinotruk-cargo-light-1.jpg', '/images/sinotruk-cargo-light-2.jpg', '/images/sinotruk-cargo-light-3.jpg'],
    features: ['City Cargo', 'Spacious', 'Fuel Efficient', 'Compact']
  },
  {
    id: 'sinotruk-pass-light',
    name: 'SINOTRUK Light Passenger',
    category: 'light',
    brand: 'SINOTRUK Light',
    horsepower: 150,
    driveType: '4×2',
    engine: 'Weichai WP2.3Q',
    price: '$14,000 - $20,000',
    image: '/images/sinotruk-pass-light-1.jpg',
    images: ['/images/sinotruk-pass-light-1.jpg', '/images/sinotruk-pass-light-2.jpg', '/images/sinotruk-pass-light-3.jpg'],
    features: ['15 Seats', 'Commuter', 'Comfort', 'AC']
  },
  {
    id: 'sinotruk-biz-light',
    name: 'SINOTRUK Light Business',
    category: 'light',
    brand: 'SINOTRUK Light',
    horsepower: 150,
    driveType: '4×2',
    engine: 'Weichai WP2.3Q',
    price: '$16,000 - $22,000',
    image: '/images/sinotruk-biz-light-1.jpg',
    images: ['/images/sinotruk-biz-light-1.jpg', '/images/sinotruk-biz-light-2.jpg', '/images/sinotruk-biz-light-3.jpg'],
    features: ['VIP Transport', 'Luxury Interior', '9 Seats', 'Premium']
  }
];

export const categories = [
  { id: 'tractor', name: 'Tractor Truck', nameEn: 'Tractor Truck', icon: '🚛' },
  { id: 'cargo', name: 'Cargo Truck', nameEn: 'Cargo Truck', icon: '📦' },
  { id: 'dump', name: 'Dump Truck', nameEn: 'Dump Truck', icon: '🏗️' },
  { id: 'mixer', name: 'Concrete Mixer', nameEn: 'Concrete Mixer', icon: '🔄' },
  { id: 'reefer', name: 'Reefer Truck', nameEn: 'Reefer Truck', icon: '🧊' },
  { id: 'light-special', name: 'Light Special', nameEn: 'Light Special Vehicles', icon: '🚐' },
  { id: 'crane', name: 'Truck Crane', nameEn: 'Truck Crane', icon: '🏗️' },
  { id: 'water', name: 'Water Truck', nameEn: 'Water Truck', icon: '💧' },
  { id: 'fuel', name: 'Fuel Tanker', nameEn: 'Fuel Tanker', icon: '⛽' },
  { id: '6x6', name: '6×6 Off-Road', nameEn: '6×6 Off-Road', icon: '🧭' },
  { id: 'machinery', name: 'Construction Machinery', nameEn: 'Construction Machinery', icon: '⚙️' },
  { id: 'mining', name: 'Mining Truck', nameEn: 'Mining Truck', icon: '⛏️' },
  { id: 'trailer', name: 'Trailer', nameEn: 'Trailer', icon: '🔗' },
  { id: 'light', name: 'Light Commercial', nameEn: 'Light Commercial', icon: '🚐' }
];

export const stockTrucks: Truck[] = [
  {
    id: 'stock-001',
    name: 'Mercedes 8×4 Fire Truck',
    category: '6x6',
    brand: 'Mercedes-Benz',
    horsepower: 420,
    driveType: '8×4',
    engine: 'Mercedes OM 470',
    price: '',
    image: '/images/benz-fire-1.jpg',
    images: ['/images/benz-fire-1.jpg', '/images/benz-fire-2.jpg', '/images/benz-fire-3.jpg'],
    features: ['8×4', 'Mercedes Chassis', 'China Body', 'Ready to Ship']
  },
  {
    id: 'stock-002',
    name: 'HOWO 6×4 Dump Truck Promo',
    category: 'dump',
    brand: 'SINOTRUK',
    horsepower: 400,
    driveType: '6×4',
    engine: 'Weichai WP12.400E62',
    price: '',
    image: '/images/stock-howo-dump-1.jpg',
    images: ['/images/stock-howo-dump-1.jpg', '/images/stock-howo-dump-2.jpg', '/images/stock-howo-dump-3.jpg'],
    features: ['6×4', 'Weichai Engine', 'Reinforced Box', 'Ready to Ship']
  },
  {
    id: 'stock-003',
    name: 'SITRAK 8×4 Dump Truck Promo',
    category: 'dump',
    brand: 'SINOTRUK',
    horsepower: 440,
    driveType: '8×4',
    engine: 'MAN MC13.440',
    price: '',
    image: '/images/stk-sitrak-dump-1.jpg',
    images: ['/images/stk-sitrak-dump-1.jpg', '/images/stk-sitrak-dump-2.jpg', '/images/stk-sitrak-dump-3.jpg'],
    features: ['8×4', 'MAN Engine', 'Reinforced Box', 'Ready to Ship']
  }
];

export const zones = [
  {
    id: 'heavy-truck',
    title: 'Heavy Duty Trucks',
    titleEn: 'Heavy Duty Trucks',
    icon: '🚛',
    brand: 'SINOTRUK',
    description: 'Tractors · Cargo · Dump · Mixer · Reefer · Crane · Water · Fuel · 6×6',
    categories: ['tractor', 'dump', 'cargo', 'mixer', 'reefer', 'light-special', 'crane', 'water', 'fuel', '6x6'],
    color: 'from-amber-500/20 to-transparent'
  },
  {
    id: 'machinery',
    title: 'Construction Machinery',
    titleEn: 'Construction Machinery',
    icon: '⚙️',
    brand: 'XCMG',
    description: 'Excavators · Loaders · Cranes · Rollers · Graders',
    categories: ['machinery'],
    color: 'from-orange-500/20 to-transparent'
  },
  {
    id: 'mining',
    title: 'Mining Trucks',
    titleEn: 'Mining Trucks',
    icon: '⛏️',
    brand: 'SINOTRUK',
    description: '70-105 Ton Wide-body Mining Dump Trucks',
    categories: ['mining'],
    color: 'from-red-500/20 to-transparent'
  },
  {
    id: 'trailer',
    title: 'Trailers',
    titleEn: 'Trailers',
    icon: '🔗',
    brand: 'CIMC / SINOTRUK',
    description: 'Flatbed · Curtain · Low-bed · Heavy Haul · Reefer · Tankers',
    categories: ['trailer'],
    color: 'from-amber-500/20 to-transparent'
  },
  {
    id: 'light',
    title: 'Light Vehicles',
    titleEn: 'Light Vehicles',
    icon: '🚐',
    brand: 'SINOTRUK Light',
    description: 'Van · Cargo · Passenger · Business',
    categories: ['light'],
    color: 'from-green-500/20 to-transparent'
  }
];

export const advantages = [
  {
    title: 'Full Brand Portfolio',
    titleEn: 'Full Brand Portfolio',
    description: 'SINOTRUK + XCMG + CIMC — Three major brands, one-stop sourcing',
    icon: 'shield'
  },
  {
    title: 'Competitive Price',
    titleEn: 'Competitive Price',
    description: 'Factory-direct supply, no middlemen, 15%-20% below market price',
    icon: 'price'
  },
  {
    title: 'After-sales Service',
    titleEn: 'After-sales Service',
    description: '2-year warranty, overseas service network, fast parts supply, remote technical support',
    icon: 'service'
  },
  {
    title: 'Customization',
    titleEn: 'Customization',
    description: 'Custom configuration, color, and branding to meet specific market requirements',
    icon: 'custom'
  }
];

export const markets = [
  { region: 'Africa', countries: ['Algeria', 'Nigeria', 'Ethiopia', 'Tanzania', 'Kenya', 'Ghana'], count: 45 },
  { region: 'Middle East', countries: ['Saudi Arabia', 'UAE', 'Iraq', 'Jordan', 'Kuwait'], count: 32 },
  { region: 'Southeast Asia', countries: ['Vietnam', 'Philippines', 'Indonesia', 'Myanmar', 'Laos'], count: 28 },
  { region: 'Central Asia', countries: ['Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan'], count: 18 }
];
