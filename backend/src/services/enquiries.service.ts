import fs from "fs";
import path from "path";
import { prisma } from "../config/prisma";
import { Prisma, UserType, Status } from "@prisma/client";
import {
  CreateEnquiryInput,
  UpdateEnquiryInput,
} from "../validators/enquiry.schema";
import { AppError } from "../middleware/errorhandler";

export class NotFoundError extends Error {
  constructor(message = "Enquiry not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

interface ListFilters {
  search?: string;
  userType?: UserType;
  status?: Status;
}

export interface EnquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  interest: string;
  message: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

// ── Fallback Seed Data for Local / Offline Environments ─────────────────────
const INITIAL_SEED_ENQUIRIES: EnquiryRecord[] = [
  {
    id: "enq_seed_01",
    name: "Aarav Sharma",
    email: "aarav.sharma@gmail.com",
    phone: "+91 98765 43210",
    userType: "STUDENT" as UserType,
    interest: "DGCA Certified Drone Pilot Training",
    message: "Hi, I am interested in enrolling in the upcoming DGCA commercial drone pilot training batch. Could you share the schedule and fee structure?",
    status: "NEW" as Status,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "enq_seed_02",
    name: "Priya Patel",
    email: "priya.patel@agrotech-solutions.com",
    phone: "+91 91234 56789",
    userType: "CUSTOMER" as UserType,
    interest: "Precision Agriculture Drone Surveying",
    message: "We need multispectral aerial drone mapping for a 500-acre agricultural project in Gujarat. Please arrange a consultation call with your surveying team.",
    status: "CONTACTED" as Status,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
  },
  {
    id: "enq_seed_03",
    name: "Vikram Malhotra",
    email: "vikram.m@skyline-infra.in",
    phone: "+91 99887 76655",
    userType: "CUSTOMER" as UserType,
    interest: "Industrial Thermal Inspection",
    message: "Requesting a quote for thermal and structural drone inspection of a 220kV transmission line and substation assets.",
    status: "IN_PROGRESS" as Status,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: "enq_seed_04",
    name: "Ananya Deshmukh",
    email: "ananya.deshmukh@vit.edu",
    phone: "+91 98450 12345",
    userType: "STUDENT" as UserType,
    interest: "Drone Mapping & GIS Photogrammetry Course",
    message: "Final year civil engineering student looking for practical photogrammetry & LiDAR training. Do you offer student group discounts?",
    status: "NEW" as Status,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
  {
    id: "enq_seed_05",
    name: "Rohan Kapoor",
    email: "rohan.films@studio-cinematics.com",
    phone: "+91 97112 34567",
    userType: "CUSTOMER" as UserType,
    interest: "Aerial Cinematography & Video Production",
    message: "Looking for FPV and heavy-lifter cinema drone operators for a 4-day commercial shoot in Rajasthan next month.",
    status: "CLOSED" as Status,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
  },
  {
    id: "enq_seed_06",
    name: "Neha Sundaram",
    email: "neha.sundaram@gmail.com",
    phone: "+91 94440 98765",
    userType: "STUDENT" as UserType,
    interest: "Drone Hardware Assembly & Maintenance Bootcamp",
    message: "I want to register for the weekend hardware engineering workshop. Is prior electronics background required?",
    status: "CONTACTED" as Status,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
];

const fallbackFilePath = path.resolve(__dirname, "../../prisma/dev_data.json");

function getFallbackData(): EnquiryRecord[] {
  try {
    if (fs.existsSync(fallbackFilePath)) {
      const raw = fs.readFileSync(fallbackFilePath, "utf-8");
      const parsed = JSON.parse(raw);
      return parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));
    }
    // Initialize file if not exists
    saveFallbackData(INITIAL_SEED_ENQUIRIES);
    return INITIAL_SEED_ENQUIRIES;
  } catch {
    return INITIAL_SEED_ENQUIRIES;
  }
}

function saveFallbackData(data: EnquiryRecord[]) {
  try {
    fs.writeFileSync(fallbackFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save dev_data.json:", err);
  }
}

// ── Service Implementation with Automatic DB Connection Fallback ───────────

export const listEnquiries = async (filters: ListFilters) => {
  try {
    const where: Prisma.EnquiryWhereInput = {
      ...(filters.userType && { userType: filters.userType }),
      ...(filters.status && { status: filters.status }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: "insensitive" } },
          { email: { contains: filters.search, mode: "insensitive" } },
          { message: { contains: filters.search, mode: "insensitive" } },
        ],
      }),
    };

    return await prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  } catch (dbError) {
    // Database connection fallback
    let items = getFallbackData();

    if (filters.userType) {
      items = items.filter((e) => e.userType === filters.userType);
    }
    if (filters.status) {
      items = items.filter((e) => e.status === filters.status);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      items = items.filter(
        (e) =>
          e.name.toLowerCase().includes(s) ||
          e.email.toLowerCase().includes(s) ||
          e.message.toLowerCase().includes(s) ||
          e.interest.toLowerCase().includes(s)
      );
    }

    return items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
};

export const getEnquiryById = async (id: string) => {
  try {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
    });

    if (!enquiry) {
      throw new AppError("Enquiry not found", 404);
    }

    return enquiry;
  } catch (err: any) {
    if (err instanceof AppError) throw err;

    const items = getFallbackData();
    const found = items.find((e) => e.id === id);
    if (!found) {
      throw new AppError("Enquiry not found", 404);
    }
    return found;
  }
};

export const createEnquiry = async (data: CreateEnquiryInput) => {
  try {
    return await prisma.enquiry.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
      },
    });
  } catch {
    const items = getFallbackData();
    const newRecord: EnquiryRecord = {
      id: "enq_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      userType: data.userType,
      interest: data.interest,
      message: data.message,
      status: "NEW" as Status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    items.unshift(newRecord);
    saveFallbackData(items);
    return newRecord;
  }
};

export const updateEnquiry = async (
  id: string,
  data: UpdateEnquiryInput
) => {
  try {
    await getEnquiryById(id);

    return await prisma.enquiry.update({
      where: { id },
      data: {
        ...data,
        ...(data.email && {
          email: data.email.toLowerCase(),
        }),
      },
    });
  } catch (err: any) {
    if (err instanceof AppError && err.statusCode === 404) throw err;

    const items = getFallbackData();
    const index = items.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new AppError("Enquiry not found", 404);
    }

    const updated = {
      ...items[index],
      ...data,
      ...(data.email && { email: data.email.toLowerCase() }),
      updatedAt: new Date(),
    };
    items[index] = updated;
    saveFallbackData(items);
    return updated;
  }
};

export const deleteEnquiry = async (id: string) => {
  try {
    await getEnquiryById(id);

    return await prisma.enquiry.delete({
      where: { id },
    });
  } catch (err: any) {
    if (err instanceof AppError && err.statusCode === 404) throw err;

    const items = getFallbackData();
    const filtered = items.filter((e) => e.id !== id);
    if (filtered.length === items.length) {
      throw new AppError("Enquiry not found", 404);
    }
    saveFallbackData(filtered);
    return { id };
  }
};

export const getStats = async () => {
  try {
    const [total, newCount, contacted, inProgress, closed] = await Promise.all([
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: "NEW" } }),
      prisma.enquiry.count({ where: { status: "CONTACTED" } }),
      prisma.enquiry.count({ where: { status: "IN_PROGRESS" } }),
      prisma.enquiry.count({ where: { status: "CLOSED" } }),
    ]);

    return {
      total,
      new: newCount,
      contacted,
      inProgress,
      closed,
    };
  } catch {
    const items = getFallbackData();
    return {
      total: items.length,
      new: items.filter((e) => e.status === "NEW").length,
      contacted: items.filter((e) => e.status === "CONTACTED").length,
      inProgress: items.filter((e) => e.status === "IN_PROGRESS").length,
      closed: items.filter((e) => e.status === "CLOSED").length,
    };
  }
};