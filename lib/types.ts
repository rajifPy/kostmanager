export interface Room {
  id: string
  room_number: string
  price: number
  facilities: string | null
  status: "vacant" | "occupied"
  created_at: string
  updated_at: string
}

export interface Tenant {
  id: string
  name: string
  phone: string | null
  email: string | null
  room_id: string | null
  unique_code: string // Added unique code
  start_date: string
  end_date: string | null
  created_at: string
  updated_at: string
  room?: Room
}

export interface Payment {
  id: string
  tenant_id: string
  amount: number
  due_date: string
  paid_date: string | null
  status: "pending" | "paid" | "overdue" | "rejected"
  notes: string | null
  proof_url: string | null
  notification_sent: boolean
  created_at: string
  updated_at: string
  tenant?: Tenant
}

export interface Reminder {
  id: string
  payment_id: string
  reminder_date: string
  reminder_type: "7_days" | "3_days" | "due_day"
  status: "pending" | "sent" | "failed"
  sent_at: string | null
  created_at: string
  payment?: Payment
}

export interface DashboardStats {
  totalRooms: number
  occupiedRooms: number
  vacantRooms: number
  totalTenants: number
  pendingPayments: number
  overduePayments: number
  paidPayments: number
  rejectedPayments: number
  totalRevenue: number
}

export interface TenantWithPayment extends Tenant {
  payments?: Payment[]
  latestPayment?: Payment
  hasUnpaidPayment?: boolean // Flag for active display
}

export interface AlumniReview {
  id: string
  name: string
  photo_url: string | null
  stay_date: string
  review: string
  rating: number
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
}
