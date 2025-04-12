import { Request } from "express";
import { DeliveryStatus } from "@prisma/client";
import { controllerWrapper } from "../utils/controllerWrapper";
import { DeliveryService } from "../Services/DeliveryService";
import { deliveryData } from "../Repository/DeliveryRepository";

const deliveryService = new DeliveryService();

export class DeliveryController {
  createDelivery = controllerWrapper(async (req: Request) => {
    const reqData: deliveryData = req.body;
    const createdById = req.user!.id;
    const data = { ...reqData, createdById };

    const newDelivery = await deliveryService.createDelivery(data);

    console.log("New delivery created SO: delivery:new (emitted)");

    return { data: newDelivery, status: 201, message: "Delivery created" };
  });

  getMyDeliveries = controllerWrapper(async (req: Request) => {
    const userId = req.user!.id;
    const deliveries = await deliveryService.getDeliveriesByUser(userId);

    return { data: deliveries, status: 200 };
  });

  getAvailableDeliveries = controllerWrapper(async (_req: Request) => {
    const deliveries = await deliveryService.getAvailableDeliveries();
    return { data: deliveries, status: 200 };
  });

  acceptDelivery = controllerWrapper(async (req: Request) => {
    const deliveryId = req.params.id;
    const driverId = req.user!.id;

    const delivery = await deliveryService.acceptDelivery(deliveryId, driverId);
    return { data: delivery, status: 200, message: "Delivery accepted" };
  });

  updateDeliveryStatus = controllerWrapper(async (req: Request) => {
    const driverId = req.user?.id as string;
    const deliveryId = req.params.id;
    const status = req.body.status as DeliveryStatus;

    const updated = await deliveryService.updateDeliveryStatus(
      deliveryId,
      status,
      driverId
    );
    return { data: updated, status: 200, message: "Status updated" };
  });

  getDeliveryById = controllerWrapper(async (req: Request) => {
    const deliveryId = req.params.id;
    const delivery = await deliveryService.getDeliveryById(deliveryId);

    return { data: delivery, status: 200 };
  });
}
