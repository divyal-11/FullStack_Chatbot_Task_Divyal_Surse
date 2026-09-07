import { Request, Response, NextFunction } from "express";
import * as enquiryService from "../services/enquiries.service";
import { UserType, Status } from "@prisma/client";

export const getAllEnquiries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, userType, status } = req.query;

    const enquiries = await enquiryService.listEnquiries({
      search: typeof search === "string" && search.trim() ? search.trim() : undefined,
      userType:
        typeof userType === "string" && userType !== "ALL"
          ? (userType as UserType)
          : undefined,
      status:
        typeof status === "string" && status !== "ALL"
          ? (status as Status)
          : undefined,
    });

    res.status(200).json({ data: enquiries });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await enquiryService.getStats();
    res.status(200).json({ data: stats });
  } catch (error) {
    next(error);
  }
};

export const getEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const enquiry = await enquiryService.getEnquiryById(req.params.id as string);

    res.status(200).json({ data: enquiry });
  } catch (error) {
    next(error);
  }
};

export const createEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const enquiry = await enquiryService.createEnquiry(req.body);

    res.status(201).json({ data: enquiry });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const enquiry = await enquiryService.updateEnquiry(
      req.params.id as string,
      req.body
    );

    res.status(200).json({ data: enquiry });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await enquiryService.deleteEnquiry(req.params.id as string);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};