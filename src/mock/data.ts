import type { Order, DashboardStats, RevenueData, OrdersByServiceData, StatusDistributionData, WeeklyOrderData } from '../types';

const SEED_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    guestName: 'John Smith',
    roomNumber: '204',
    service: 'Room Service',
    quantity: 2,
    amount: 45,
    specialRequest: 'Please deliver to the room before 8 PM.',
    orderTime: '2026-07-28T17:30:00Z',
    status: 'New',
    paymentStatus: 'Paid',
    createdAt: '2026-07-28T17:30:00Z',
    updatedAt: '2026-07-28T17:30:00Z',
  },
  {
    id: 'ORD-1002',
    guestName: 'Sarah Johnson',
    roomNumber: '312',
    service: 'Housekeeping',
    quantity: 1,
    amount: 0,
    specialRequest: 'Please clean the room after 2 PM.',
    orderTime: '2026-07-28T12:15:00Z',
    status: 'In Progress',
    paymentStatus: 'Pending',
    createdAt: '2026-07-28T12:15:00Z',
    updatedAt: '2026-07-28T13:00:00Z',
    acknowledgedAt: '2026-07-28T12:30:00Z',
    inProgressAt: '2026-07-28T12:45:00Z',
  },
  {
    id: 'ORD-1003',
    guestName: 'Michael Tan',
    roomNumber: '105',
    service: 'Laundry',
    quantity: 3,
    amount: 25,
    specialRequest: 'Express service requested.',
    orderTime: '2026-07-28T10:00:00Z',
    status: 'Completed',
    paymentStatus: 'Paid',
    createdAt: '2026-07-28T10:00:00Z',
    updatedAt: '2026-07-28T11:30:00Z',
    acknowledgedAt: '2026-07-28T10:15:00Z',
    inProgressAt: '2026-07-28T10:30:00Z',
    completedAt: '2026-07-28T11:30:00Z',
  },
  {
    id: 'ORD-1004',
    guestName: 'Emma Wilson',
    roomNumber: '408',
    service: 'Extra Bed',
    quantity: 1,
    amount: 30,
    specialRequest: '',
    orderTime: '2026-07-28T16:45:00Z',
    status: 'Acknowledged',
    paymentStatus: 'Pending',
    createdAt: '2026-07-28T16:45:00Z',
    updatedAt: '2026-07-28T17:00:00Z',
    acknowledgedAt: '2026-07-28T17:00:00Z',
  },
  {
    id: 'ORD-1005',
    guestName: 'David Lee',
    roomNumber: '201',
    service: 'Spa & Massage',
    quantity: 1,
    amount: 75,
    specialRequest: 'Preferred time: 7 PM.',
    orderTime: '2026-07-28T15:20:00Z',
    status: 'Cancelled',
    paymentStatus: 'Failed',
    createdAt: '2026-07-28T15:20:00Z',
    updatedAt: '2026-07-28T15:50:00Z',
    cancelledAt: '2026-07-28T15:50:00Z',
  },
  {
    id: 'ORD-1006',
    guestName: 'Maria Garcia',
    roomNumber: '510',
    service: 'Continental Breakfast',
    quantity: 2,
    amount: 35,
    specialRequest: 'Gluten-free options needed. Please confirm with guest before serving.',
    orderTime: '2026-07-28T07:30:00Z',
    status: 'Completed',
    paymentStatus: 'Paid',
    createdAt: '2026-07-28T07:30:00Z',
    updatedAt: '2026-07-28T08:15:00Z',
    acknowledgedAt: '2026-07-28T07:35:00Z',
    inProgressAt: '2026-07-28T07:40:00Z',
    completedAt: '2026-07-28T08:15:00Z',
  },
  {
    id: 'ORD-1007',
    guestName: 'Robert Chen',
    roomNumber: '607',
    service: 'Airport Transfer',
    quantity: 1,
    amount: 75,
    specialRequest: 'Pickup from JFK Terminal 4 at 11 PM. Flight BA178.',
    orderTime: '2026-07-28T09:00:00Z',
    status: 'In Progress',
    paymentStatus: 'Paid',
    createdAt: '2026-07-28T09:00:00Z',
    updatedAt: '2026-07-28T09:30:00Z',
    acknowledgedAt: '2026-07-28T09:10:00Z',
    inProgressAt: '2026-07-28T09:30:00Z',
  },
  {
    id: 'ORD-1008',
    guestName: 'Lisa Anderson',
    roomNumber: '803',
    service: 'Mini Bar',
    quantity: 5,
    amount: 62,
    specialRequest: 'Please restock with premium wine selection.',
    orderTime: '2026-07-28T19:15:00Z',
    status: 'New',
    paymentStatus: 'Pending',
    createdAt: '2026-07-28T19:15:00Z',
    updatedAt: '2026-07-28T19:15:00Z',
  },
  {
    id: 'ORD-1009',
    guestName: 'James Rodriguez',
    roomNumber: '222',
    service: 'Turndown Service',
    quantity: 1,
    amount: 0,
    specialRequest: '',
    orderTime: '2026-07-28T18:00:00Z',
    status: 'Acknowledged',
    paymentStatus: 'Pending',
    createdAt: '2026-07-28T18:00:00Z',
    updatedAt: '2026-07-28T18:20:00Z',
    acknowledgedAt: '2026-07-28T18:20:00Z',
  },
  {
    id: 'ORD-1010',
    guestName: 'Jennifer Park',
    roomNumber: '1501',
    service: 'Spa & Massage',
    quantity: 2,
    amount: 240,
    specialRequest: 'Couple massage with aromatherapy oils. Pre-booking for tomorrow 10 AM.',
    orderTime: '2026-07-28T14:00:00Z',
    status: 'Completed',
    paymentStatus: 'Paid',
    createdAt: '2026-07-28T14:00:00Z',
    updatedAt: '2026-07-28T16:30:00Z',
    acknowledgedAt: '2026-07-28T14:10:00Z',
    inProgressAt: '2026-07-28T15:00:00Z',
    completedAt: '2026-07-28T16:30:00Z',
  },
  {
    id: 'ORD-1011',
    guestName: 'Thomas Mueller',
    roomNumber: '420',
    service: 'Dry Cleaning',
    quantity: 4,
    amount: 60,
    specialRequest: 'Three suits and one dress. Needs to be ready by 8 AM tomorrow.',
    orderTime: '2026-07-28T20:00:00Z',
    status: 'Acknowledged',
    paymentStatus: 'Pending',
    createdAt: '2026-07-28T20:00:00Z',
    updatedAt: '2026-07-28T20:15:00Z',
    acknowledgedAt: '2026-07-28T20:15:00Z',
  },
  {
    id: 'ORD-1012',
    guestName: 'Fatima Al-Rashid',
    roomNumber: '901',
    service: 'Room Service',
    quantity: 3,
    amount: 87,
    specialRequest: 'Halal meal option. Please ensure no pork in any dish.',
    orderTime: '2026-07-28T19:45:00Z',
    status: 'In Progress',
    paymentStatus: 'Paid',
    createdAt: '2026-07-28T19:45:00Z',
    updatedAt: '2026-07-28T20:30:00Z',
    acknowledgedAt: '2026-07-28T19:55:00Z',
    inProgressAt: '2026-07-28T20:10:00Z',
  },
  {
    id: 'ORD-1013',
    guestName: 'William Baker',
    roomNumber: '305',
    service: 'Housekeeping',
    quantity: 1,
    amount: 0,
    specialRequest: 'Deep clean requested. All surfaces to be sanitized.',
    orderTime: '2026-07-28T11:00:00Z',
    status: 'Completed',
    paymentStatus: 'Paid',
    createdAt: '2026-07-28T11:00:00Z',
    updatedAt: '2026-07-28T12:00:00Z',
    acknowledgedAt: '2026-07-28T11:10:00Z',
    inProgressAt: '2026-07-28T11:15:00Z',
    completedAt: '2026-07-28T12:00:00Z',
  },
  {
    id: 'ORD-1014',
    guestName: 'Sophie Martin',
    roomNumber: '718',
    service: 'Wake-up Call',
    quantity: 1,
    amount: 0,
    specialRequest: 'Wake up call at 6:30 AM with a 10-minute reminder.',
    orderTime: '2026-07-28T22:00:00Z',
    status: 'New',
    paymentStatus: 'Pending',
    createdAt: '2026-07-28T22:00:00Z',
    updatedAt: '2026-07-28T22:00:00Z',
  },
  {
    id: 'ORD-1015',
    guestName: 'Daniel Kim',
    roomNumber: '112',
    service: 'Gym Access',
    quantity: 2,
    amount: 0,
    specialRequest: 'Guest requests personal trainer session at 7 AM.',
    orderTime: '2026-07-28T06:00:00Z',
    status: 'Completed',
    paymentStatus: 'Paid',
    createdAt: '2026-07-28T06:00:00Z',
    updatedAt: '2026-07-28T08:00:00Z',
    acknowledgedAt: '2026-07-28T06:05:00Z',
    inProgressAt: '2026-07-28T06:30:00Z',
    completedAt: '2026-07-28T08:00:00Z',
  },
  {
    id: 'ORD-1016',
    guestName: 'Olivia Taylor',
    roomNumber: '1002',
    service: 'Pool Towels',
    quantity: 4,
    amount: 0,
    specialRequest: 'Extra large towels for poolside. Preferred near the south end.',
    orderTime: '2026-07-28T09:30:00Z',
    status: 'Cancelled',
    paymentStatus: 'Pending',
    createdAt: '2026-07-28T09:30:00Z',
    updatedAt: '2026-07-28T10:00:00Z',
    cancelledAt: '2026-07-28T10:00:00Z',
  },
  {
    id: 'ORD-1017',
    guestName: 'Ahmed Hassan',
    roomNumber: '625',
    service: 'Continental Breakfast',
    quantity: 1,
    amount: 18,
    specialRequest: 'Vegetarian breakfast with extra fruit platter.',
    orderTime: '2026-07-28T08:00:00Z',
    status: 'Completed',
    paymentStatus: 'Paid',
    createdAt: '2026-07-28T08:00:00Z',
    updatedAt: '2026-07-28T08:45:00Z',
    acknowledgedAt: '2026-07-28T08:05:00Z',
    inProgressAt: '2026-07-28T08:10:00Z',
    completedAt: '2026-07-28T08:45:00Z',
  },
  {
    id: 'ORD-1018',
    guestName: 'Nancy Drew',
    roomNumber: '333',
    service: 'Housekeeping',
    quantity: 1,
    amount: 0,
    specialRequest: 'Do not disturb sign on door. Please knock softly before entering.',
    orderTime: '2026-07-28T13:30:00Z',
    status: 'New',
    paymentStatus: 'Pending',
    createdAt: '2026-07-28T13:30:00Z',
    updatedAt: '2026-07-28T13:30:00Z',
  },
  {
    id: 'ORD-1019',
    guestName: 'Chris Evans',
    roomNumber: '515',
    service: 'Laundry',
    quantity: 2,
    amount: 30,
    specialRequest: 'Wash and fold only. No starch on shirts.',
    orderTime: '2026-07-28T16:00:00Z',
    status: 'In Progress',
    paymentStatus: 'Pending',
    createdAt: '2026-07-28T16:00:00Z',
    updatedAt: '2026-07-28T16:45:00Z',
    acknowledgedAt: '2026-07-28T16:15:00Z',
    inProgressAt: '2026-07-28T16:30:00Z',
  },
  {
    id: 'ORD-1020',
    guestName: 'Priya Sharma',
    roomNumber: '821',
    service: 'Room Service',
    quantity: 1,
    amount: 42,
    specialRequest: 'Spicy noodles with extra vegetables. No dairy please.',
    orderTime: '2026-07-28T20:30:00Z',
    status: 'Acknowledged',
    paymentStatus: 'Paid',
    createdAt: '2026-07-28T20:30:00Z',
    updatedAt: '2026-07-28T20:45:00Z',
    acknowledgedAt: '2026-07-28T20:45:00Z',
  },
];

const GUEST_NAMES = [
  'Emma Thompson', 'James Wilson', 'Sophia Martinez', 'William Chen', 'Olivia Brown',
  'Alexander Kim', 'Isabella Garcia', 'Benjamin Lee', 'Mia Johnson', 'Ethan Davis',
  'Charlotte Miller', 'Daniel Rodriguez', 'Amelia Anderson', 'Matthew Taylor', 'Harper Thomas',
  'David Jackson', 'Evelyn White', 'Joseph Harris', 'Abigail Martin', 'Samuel Robinson',
];

const ROOM_NUMBERS = [
  '101', '102', '201', '202', '301', '302', '401', '402', '501', '502',
  '601', '602', '701', '702', '801', '802', '901', '902', '1001', '1002',
];

const SERVICE_NAMES = [
  'Room Service', 'Housekeeping', 'Laundry', 'Extra Bed', 'Spa & Massage',
  'Continental Breakfast', 'Airport Transfer', 'Dry Cleaning', 'Mini Bar',
  'Turndown Service', 'Wake-up Call', 'Gym Access', 'Pool Towels',
];

function randomDate(daysBack: number): string {
  const now = Date.now();
  const past = now - daysBack * 24 * 60 * 60 * 1000;
  const date = new Date(past + Math.random() * (now - past));
  return date.toISOString();
}

function generateRandomOrder(id: string): Order {
  const guestName = GUEST_NAMES[Math.floor(Math.random() * GUEST_NAMES.length)];
  const roomNumber = ROOM_NUMBERS[Math.floor(Math.random() * ROOM_NUMBERS.length)];
  const service = SERVICE_NAMES[Math.floor(Math.random() * SERVICE_NAMES.length)];
  const quantity = Math.floor(Math.random() * 4) + 1;
  const amount = Math.floor(Math.random() * 100) + 15;
  const createdAt = randomDate(3);
  const orderTime = createdAt;

  const statusRoll = Math.random();
  let status: string;
  if (statusRoll < 0.2) status = 'New';
  else if (statusRoll < 0.35) status = 'Acknowledged';
  else if (statusRoll < 0.5) status = 'In Progress';
  else if (statusRoll < 0.85) status = 'Completed';
  else status = 'Cancelled';

  const paymentRoll = Math.random();
  let paymentStatus: string;
  if (status === 'Cancelled') {
    paymentStatus = paymentRoll < 0.5 ? 'Paid' : 'Pending';
  } else if (status === 'Completed') {
    paymentStatus = paymentRoll < 0.8 ? 'Paid' : 'Pending';
  } else {
    paymentStatus = paymentRoll < 0.7 ? 'Pending' : 'Paid';
  }

  const updatedAt = new Date(new Date(createdAt).getTime() + Math.random() * 3600000 * 4).toISOString();
  const acknowledgedAt = status !== 'New' ? new Date(new Date(createdAt).getTime() + 300000).toISOString() : undefined;
  const inProgressAt = (status === 'In Progress' || status === 'Completed') && acknowledgedAt
    ? new Date(new Date(acknowledgedAt).getTime() + 600000).toISOString()
    : undefined;
  const completedAt = status === 'Completed' && inProgressAt
    ? new Date(new Date(inProgressAt).getTime() + 1200000).toISOString()
    : undefined;
  const cancelledAt = status === 'Cancelled'
    ? new Date(new Date(createdAt).getTime() + 1800000).toISOString()
    : undefined;

  return {
    id,
    guestName,
    roomNumber,
    service,
    quantity,
    amount,
    specialRequest: Math.random() > 0.7 ? `Please deliver to room ${roomNumber}.` : undefined,
    orderTime,
    status,
    paymentStatus,
    createdAt,
    updatedAt,
    acknowledgedAt,
    inProgressAt,
    completedAt,
    cancelledAt,
  };
}

const EXTRA_ORDERS = Array.from(
  { length: 30 },
  (_, i) => generateRandomOrder(`ORD-${String(1021 + i).padStart(4, '0')}`)
);

export const ORDERS: Order[] = [...SEED_ORDERS, ...EXTRA_ORDERS];

export function generateNewOrder(): Order {
  const orderIndex = ORDERS.length + 1;
  return generateRandomOrder(`ORD-${String(orderIndex).padStart(4, '0')}`);
}

export const DASHBOARD_STATS: DashboardStats = {
  activeGuests: 48,
  activeGuestsTrend: 12.5,
  pendingOrders: 22,
  pendingOrdersTrend: -5.2,
  revenueToday: 14580,
  revenueTodayTrend: 8.3,
  completedOrders: 185,
  completedOrdersTrend: 15.1,
  averageOrderValue: 52.30,
  averageOrderValueTrend: 3.8,
  topSellingService: 'Room Service',
  topSellingServiceCount: 42,
};

export function generateRevenueData(): RevenueData[] {
  const data: RevenueData[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 5000) + 2000,
      orders: Math.floor(Math.random() * 30) + 10,
    });
  }
  return data;
}

export const ORDERS_BY_SERVICE: OrdersByServiceData[] = [
  { name: 'Room Service', value: 42, color: '#3b82f6' },
  { name: 'Housekeeping', value: 28, color: '#10b981' },
  { name: 'Laundry', value: 15, color: '#f59e0b' },
  { name: 'Extra Bed', value: 8, color: '#8b5cf6' },
  { name: 'Spa & Massage', value: 12, color: '#ec4899' },
  { name: 'Continental Breakfast', value: 18, color: '#ef4444' },
  { name: 'Concierge & Transfers', value: 10, color: '#06b6d4' },
];

export function generateStatusDistribution(): StatusDistributionData[] {
  const total = ORDERS.length;
  const statusCounts: Record<string, number> = {};
  ORDERS.forEach(o => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });
  return [
    { status: 'New', count: statusCounts['New'] || 0, percentage: ((statusCounts['New'] || 0) / total) * 100 },
    { status: 'Acknowledged', count: statusCounts['Acknowledged'] || 0, percentage: ((statusCounts['Acknowledged'] || 0) / total) * 100 },
    { status: 'In Progress', count: statusCounts['In Progress'] || 0, percentage: ((statusCounts['In Progress'] || 0) / total) * 100 },
    { status: 'Completed', count: statusCounts['Completed'] || 0, percentage: ((statusCounts['Completed'] || 0) / total) * 100 },
    { status: 'Cancelled', count: statusCounts['Cancelled'] || 0, percentage: ((statusCounts['Cancelled'] || 0) / total) * 100 },
  ];
}

export function generateWeeklyOrders(): WeeklyOrderData[] {
  return [
    { day: 'Mon', orders: 32, revenue: 4150 },
    { day: 'Tue', orders: 38, revenue: 4900 },
    { day: 'Wed', orders: 28, revenue: 3600 },
    { day: 'Thu', orders: 42, revenue: 5200 },
    { day: 'Fri', orders: 50, revenue: 6100 },
    { day: 'Sat', revenue: 6800, orders: 55 },
    { day: 'Sun', orders: 44, revenue: 5400 },
  ];
}
