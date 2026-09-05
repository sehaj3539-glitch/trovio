/**
 * Trovio Lost & Found — Seed Dataset (Indian Campus Context)
 * 
 * Clean, lightweight sample data for Indian colleges and universities.
 */

export const DEMO_USERS = [
  {
    id: 'user_aarav_01',
    name: 'Aarav Sharma',
    initials: 'AS',
    email: 'aarav.sharma@campus.edu.in',
    password: 'password123',
    phone: '+91 98765 43210',
    studentId: '2024CSB1042',
    department: 'Computer Science & Engineering'
  },
  {
    id: 'user_ananya_02',
    name: 'Ananya Iyer',
    initials: 'AI',
    email: 'ananya.iyer@campus.edu.in',
    password: 'password123',
    phone: '+91 98201 12345',
    studentId: '2023ECE088',
    department: 'Electronics & Communication Engineering'
  }
];

export const INITIAL_ITEMS = [
  // --- Active Lost Items ---
  {
    id: 'item_101',
    title: 'Lost HP Pavilion 14-inch Laptop',
    type: 'lost',
    category: 'Electronics',
    location: 'Central Library, 2nd Floor Study Room',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    description: 'Silver HP Pavilion laptop inside a black Targus sleeve. Has a GitHub Octocat sticker and a small scratch near the charging port.',
    date: '2026-08-30',
    status: 'active',
    reward: '₹1,000 Cash / Canteen Treat',
    ownerId: 'user_aarav_01',
    contact: {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campus.edu.in',
      phone: '+91 98765 43210',
      preferredMethod: 'Phone / WhatsApp'
    },
    createdAt: '2026-08-30T14:20:00Z'
  },
  {
    id: 'item_105',
    title: 'Lost Milton Thermosteel Water Bottle',
    type: 'lost',
    category: 'Personal Items',
    location: 'Main Campus Canteen Area',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    description: 'Insulated stainless steel water bottle with flip lid. Has a small ISRO mission sticker on the lower side.',
    date: '2026-09-02',
    status: 'active',
    reward: '₹200 Canteen Voucher',
    ownerId: 'user_rohan_03',
    contact: {
      name: 'Rohan Patel',
      email: 'rohan.patel@campus.edu.in',
      phone: '+91 98450 67890',
      preferredMethod: 'Phone / WhatsApp'
    },
    createdAt: '2026-09-02T18:00:00Z'
  },
  {
    id: 'item_107',
    title: 'Lost Engineering Mathematics Textbook',
    type: 'lost',
    category: 'Books & Study',
    location: 'Lecture Hall Complex (LH-1)',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: 'Paperback 44th Edition textbook with yellow sticky bookmark tabs on Laplace Transforms and Differential Equations.',
    date: '2026-09-01',
    status: 'active',
    reward: 'Big Thanks & Chai Treat',
    ownerId: 'user_sneha_04',
    contact: {
      name: 'Sneha Rao',
      email: 'sneha.rao@campus.edu.in',
      phone: '+91 97123 45678',
      preferredMethod: 'Email'
    },
    createdAt: '2026-09-01T16:50:00Z'
  },
  {
    id: 'item_109',
    title: 'Lost Noise-Cancelling Earphones',
    type: 'lost',
    category: 'Electronics',
    location: 'Computer Science Lab 3, Tech Block',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    description: 'Matte black wireless earbuds in compact charging capsule. Left earbud has tiny silver initials dot on bottom.',
    date: '2026-09-03',
    status: 'active',
    reward: '₹500 Treat Voucher',
    ownerId: 'user_aarav_01',
    contact: {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campus.edu.in',
      phone: '+91 98765 43210',
      preferredMethod: 'WhatsApp'
    },
    createdAt: '2026-09-03T11:20:00Z'
  },

  // --- Active Found Items ---
  {
    id: 'item_102',
    title: 'Found College Smart ID & Metro Pass',
    type: 'found',
    category: 'Cards & IDs',
    location: 'Main Gate Security Post',
    image: 'https://images.unsplash.com/photo-1578873375969-d60fa8a32997?auto=format&fit=crop&w=600&q=80',
    description: 'Blue university lanyard holding student identity card for "Rahul Verma" along with a Metro smart card and room key.',
    date: '2026-08-31',
    status: 'active',
    ownerId: 'user_staff_01',
    contact: {
      name: 'Main Gate Security Post',
      email: 'security@campus.edu.in',
      phone: '+91 11 2659 1000',
      preferredMethod: 'In-person'
    },
    createdAt: '2026-08-31T09:15:00Z'
  },
  {
    id: 'item_104',
    title: 'Found Casio FX-991CW Scientific Calculator',
    type: 'found',
    category: 'Electronics',
    location: 'Physics Lab A-204, Table 6',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    description: 'Casio ClassWiz FX-991CW scientific calculator with sliding black cover. Has silver initials "P.K." written inside the cover.',
    date: '2026-09-02',
    status: 'active',
    ownerId: 'user_ananya_02',
    contact: {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@campus.edu.in',
      phone: '+91 98201 12345',
      preferredMethod: 'Email'
    },
    createdAt: '2026-09-02T13:30:00Z'
  },
  {
    id: 'item_106',
    title: 'Found Honda Scooter Keys with Red Ribbon Tag',
    type: 'found',
    category: 'Keys & Chains',
    location: 'Student Two-Wheeler Parking Lot B',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    description: 'Single Honda scooter ignition key attached to a red embroidered aviation ribbon tag and hostel room brass key.',
    date: '2026-09-03',
    status: 'active',
    ownerId: 'user_aarav_01',
    contact: {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campus.edu.in',
      phone: '+91 98765 43210',
      preferredMethod: 'WhatsApp'
    },
    createdAt: '2026-09-03T08:15:00Z'
  },
  {
    id: 'item_111',
    title: 'Found Brown Leather Men\'s Wallet',
    type: 'found',
    category: 'Wallets & Cards',
    location: 'Cafeteria Outdoor Seating Area',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    description: 'Dark brown bifold leather wallet found near bench 4. Contains transit pass, canteen card, and receipts. Kept safely with cafeteria manager.',
    date: '2026-09-04',
    status: 'active',
    ownerId: 'user_ananya_02',
    contact: {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@campus.edu.in',
      phone: '+91 98201 12345',
      preferredMethod: 'Email'
    },
    createdAt: '2026-09-04T12:00:00Z'
  },
  {
    id: 'item_113',
    title: 'Found Titan Silver Analog Wristwatch',
    type: 'found',
    category: 'Accessories',
    location: 'Seminar Hall 2, Front Row Seats',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    description: 'Stainless steel mesh strap analog watch with dark blue dial. Found after the morning guest lecture.',
    date: '2026-09-04',
    status: 'active',
    ownerId: 'user_staff_01',
    contact: {
      name: 'Central Admin Desk',
      email: 'admin@campus.edu.in',
      phone: '+91 11 2659 2000',
      preferredMethod: 'In-person'
    },
    createdAt: '2026-09-04T14:45:00Z'
  },

  // --- Resolved Items ---
  {
    id: 'item_103',
    title: 'Lost Boat Wireless Headphones — Resolved',
    type: 'lost',
    category: 'Electronics',
    location: 'Hostel 4 Common Room',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'Matte black Boat Rockerz over-ear headphones in an oval zip case. Contains red aux cable and Type-C wire.',
    date: '2026-09-01',
    status: 'resolved',
    resolvedDate: '2026-09-02',
    resolutionNote: 'Returned by hostel batchmate who spotted this Trovio notice!',
    reward: 'Warm Chai & Samosa Treat',
    ownerId: 'user_aarav_01',
    contact: {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campus.edu.in',
      phone: '+91 98765 43210',
      preferredMethod: 'WhatsApp'
    },
    createdAt: '2026-09-01T11:45:00Z'
  },
  {
    id: 'item_108',
    title: 'Lost Wildcraft Campus Backpack — Resolved',
    type: 'lost',
    category: 'Bags & Backpacks',
    location: 'Main Campus Canteen',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    description: 'Navy blue Wildcraft backpack found in canteen. Contained class spiral lecture notebooks and drafter.',
    date: '2026-09-02',
    status: 'resolved',
    resolvedDate: '2026-09-03',
    resolutionNote: 'Owner showed matching student ID and collected backpack.',
    ownerId: 'user_ananya_02',
    contact: {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@campus.edu.in',
      phone: '+91 98201 12345',
      preferredMethod: 'Email'
    },
    createdAt: '2026-09-02T15:10:00Z'
  },
  {
    id: 'item_114',
    title: 'Lost Student ID Card — Resolved',
    type: 'lost',
    category: 'Cards & IDs',
    location: 'Central Library Entrance Gate',
    image: 'https://images.unsplash.com/photo-1578873375969-d60fa8a32997?auto=format&fit=crop&w=600&q=80',
    description: 'College RFID access smart card in red transparent card holder.',
    date: '2026-09-03',
    status: 'resolved',
    resolvedDate: '2026-09-04',
    resolutionNote: 'Safely claimed at Library Front Desk.',
    ownerId: 'user_sneha_04',
    contact: {
      name: 'Library Security',
      email: 'library@campus.edu.in',
      phone: '+91 11 2659 3000',
      preferredMethod: 'In-person'
    },
    createdAt: '2026-09-03T16:00:00Z'
  },
  {
    id: 'item_115',
    title: 'Lost Casio Scientific Calculator — Resolved',
    type: 'lost',
    category: 'Electronics',
    location: 'Mathematics Department Tutorial Hall',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    description: 'Standard engineering calculator with formula cheatsheet sticker taped inside lid.',
    date: '2026-09-02',
    status: 'resolved',
    resolvedDate: '2026-09-04',
    resolutionNote: 'Reunited with batchmate after verifying handwritten roll number.',
    ownerId: 'user_rohan_03',
    contact: {
      name: 'Rohan Patel',
      email: 'rohan.patel@campus.edu.in',
      phone: '+91 98450 67890',
      preferredMethod: 'Phone / WhatsApp'
    },
    createdAt: '2026-09-02T17:30:00Z'
  }
];
