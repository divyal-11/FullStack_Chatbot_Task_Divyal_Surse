import {Router} from "express"
import * as controller from "../controllers/enquiries.controller"
import {validateBody,validateQuery} from "../middleware/validate";
import{
    createEnquirySchema,
    updateEnquirySchema,
    queryEnquirySchema,
} from "../validators/enquiry.schema";

const router = Router();

router.get(
  "/",
  validateQuery(queryEnquirySchema),
  controller.getAllEnquiries
);

router.get("/stats", controller.getStats);
router.get("/:id", controller.getEnquiry);

router.post(
  "/",
  validateBody(createEnquirySchema),
  controller.createEnquiry
);

router.patch(
  "/:id",
  validateBody(updateEnquirySchema),
  controller.updateEnquiry
);

router.put(
  "/:id",
  validateBody(updateEnquirySchema),
  controller.updateEnquiry
);

router.delete("/:id", controller.deleteEnquiry);

export default router;