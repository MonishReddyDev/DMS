import { Delivery, DeliveryStatus } from "@prisma/client";
import {
  deliveryData,
  DeliveryRepository,
} from "../Repository/DeliveryRepository";
import { NotFoundError, Unauthorized, ValidationError } from "../utils/error";
import { getIO } from "../socket";
// path may vary

export class DeliveryService {
  private deliveryRepository = new DeliveryRepository();

  async createDelivery(data: deliveryData): Promise<Delivery> {
    const { pickupLocation, dropLocation, itemDescription, createdById } = data;
    const io = getIO();
    if (!pickupLocation || !dropLocation || !itemDescription) {
      throw new ValidationError("All fields are required");
    }

    const newDelivery = await this.deliveryRepository.create({
      pickupLocation,
      dropLocation,
      itemDescription,
      createdById,
    });

    io.emit("delivery:new", newDelivery);

    return newDelivery;
  }

  async getDeliveriesByUser(userId: string): Promise<Delivery[]> {
    return this.deliveryRepository.findByUserId(userId);
  }

  async getAvailableDeliveries(): Promise<Delivery[]> {
    return this.deliveryRepository.findAvailable();
  }

  async acceptDelivery(
    deliveryId: string,
    driverId: string
  ): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findById(deliveryId);

    if (!delivery) throw new NotFoundError("Delivery not found");

    if (delivery.status !== "PENDING") {
      throw new ValidationError("This delivery is already assigned");
    }

    return this.deliveryRepository.assignDriver(deliveryId, driverId);
  }

  async updateDeliveryStatus(
    deliveryId: string,
    status: DeliveryStatus,
    driverId: string
  ): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findById(deliveryId);

    if (!delivery) throw new NotFoundError("Delivery not found");

    if (delivery.assignedToId !== driverId) {
      throw new Unauthorized("Unauthorized to Update the Status");
    }

    return this.deliveryRepository.updateStatus(deliveryId, status);
  }

  async getDeliveryById(deliveryId: string): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findById(deliveryId);
    if (!delivery) throw new NotFoundError("Delivery not found");
    return delivery;
  }
}
