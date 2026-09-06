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

export const listEnquiries = async (filters: ListFilters) => {
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

  return prisma.enquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
};

export const getEnquiryById = async (id: string) => {
  const enquiry = await prisma.enquiry.findUnique({
    where: { id },
  });

  if (!enquiry) {
    throw new AppError("Enquiry not found", 404);
  }

  return enquiry;
};

export const createEnquiry = async (data: CreateEnquiryInput) => {
  return prisma.enquiry.create({
    data: {
      ...data,
      email: data.email.toLowerCase(),
    },
  });
};

export const updateEnquiry = async (
  id: string,
  data: UpdateEnquiryInput
) => {
  await getEnquiryById(id);

  return prisma.enquiry.update({
    where: { id },
    data: {
      ...data,
      ...(data.email && {
        email: data.email.toLowerCase(),
      }),
    },
  });
};

export const deleteEnquiry = async (id: string) => {
  await getEnquiryById(id);

  return prisma.enquiry.delete({
    where: { id },
  });
};