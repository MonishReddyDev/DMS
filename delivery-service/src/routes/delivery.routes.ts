import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { requiredRole } from "../middlewares/requireRole";
import { DeliveryController } from "../Controllers/DeliveryController";
import { Role } from "../types/roles";
import {
  getLastLocation,
  getTrackingHistory,
} from "../Controllers/trackingController";

const router = express.Router();
const controller = new DeliveryController();

// Shipper (USER) creates delivery
router.post(
  "/",
  authenticateToken,
  requiredRole(Role.USER),
  controller.createDelivery
);

// Shipper (USER) gets their deliveries
router.get(
  "/user",
  authenticateToken,
  requiredRole(Role.USER),
  controller.getMyDeliveries
);

// Driver (DRIVER) gets available deliveries
router.get(
  "/available",
  authenticateToken,
  requiredRole(Role.DRIVER),
  controller.getAvailableDeliveries
);

// Driver accepts delivery
router.post(
  "/:id/accept",
  authenticateToken,
  requiredRole(Role.DRIVER),
  controller.acceptDelivery
);

// Driver updates status (PICKED, IN_TRANSIT, DELIVERED)
router.patch(
  "/:id/status",
  authenticateToken,
  requiredRole(Role.DRIVER),
  controller.updateDeliveryStatus
);

// View delivery by ID (both USER and DRIVER)
router.get("/:id", authenticateToken, controller.getDeliveryById);

router.get("/:deliveryId/last-location", authenticateToken, getLastLocation);

router.get(
  "/:deliveryId/tracking-history",
  authenticateToken,
  getTrackingHistory
);
export default router;
