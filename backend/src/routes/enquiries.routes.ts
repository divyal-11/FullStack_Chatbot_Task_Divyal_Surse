import { Router } from "express";
import * as controller from "../controllers/enquiries.controller";
import { validateBody, validateQuery } from "../middleware/validate";
import { requireAdminAuth } from "../middleware/auth";
import {
  createEnquirySchema,
  updateEnquirySchema,
  queryEnquirySchema,
} from "../validators/enquiry.schema";

const router = Router();

router.get(
  "/",
  requireAdminAuth,
  validateQuery(queryEnquirySchema),
  controller.getAllEnquiries
);

router.get("/stats", requireAdminAuth, controller.getStats);
router.get("/:id", controller.getEnquiry);

router.post(
  "/",
  validateBody(createEnquirySchema),
  controller.createEnquiry
);

router.patch(
  "/:id",
  requireAdminAuth,
  validateBody(updateEnquirySchema),
  controller.updateEnquiry
);

router.put(
  "/:id",
  requireAdminAuth,
  validateBody(updateEnquirySchema),
  controller.updateEnquiry
);

router.delete("/:id", requireAdminAuth, controller.deleteEnquiry);

export default router;