import axios from 'axios';
import type { Enquiry, EnquiryStats, ApiResponse, CreateEnquiryPayload } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Public ──────────────────────────────────────────────
export const submitEnquiry = async (payload: CreateEnquiryPayload) => {
  const res = await api.post<ApiResponse<Enquiry>>('/api/enquiries', payload);
  return res.data;
};

// ── Admin (all require token) ────────────────────────────
const adminHeaders = () => {
  const token = import.meta.env.VITE_ADMIN_TOKEN || '';
  return {
    'Authorization': `Bearer ${token}`,
    'x-admin-token': token,
  };
};

export const getEnquiries = async (params?: {
  search?: string;
  userType?: string;
  status?: string;
}) => {
  const res = await api.get<ApiResponse<Enquiry[]>>('/api/enquiries', {
    params,
    headers: adminHeaders(),
  });
  return res.data;
};

export const getEnquiryById = async (id: string) => {
  const res = await api.get<ApiResponse<Enquiry>>(`/api/enquiries/${id}`, {
    headers: adminHeaders(),
  });
  return res.data;
};

export const getStats = async () => {
  const res = await api.get<ApiResponse<EnquiryStats>>('/api/enquiries/stats', {
    headers: adminHeaders(),
  });
  return res.data;
};

export const updateEnquiryStatus = async (id: string, status: string) => {
  const res = await api.patch<ApiResponse<Enquiry>>(
    `/api/enquiries/${id}`,
    { status },
    { headers: adminHeaders() }
  );
  return res.data;
};

export const deleteEnquiry = async (id: string) => {
  const res = await api.delete<ApiResponse<null>>(`/api/enquiries/${id}`, {
    headers: adminHeaders(),
  });
  return res.data;
};
