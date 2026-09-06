export type UserType = 'STUDENT' | 'CUSTOMER' | 'OTHER';
export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED';

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  interest: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryStats {
  total: number;
  new: number;
  contacted: number;
  inProgress: number;
  closed: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CreateEnquiryPayload {
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  interest: string;
  message: string;
}
