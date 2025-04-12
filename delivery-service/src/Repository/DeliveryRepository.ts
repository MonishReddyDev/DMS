import { Delivery, DeliveryStatus } from "@prisma/client";
import prisma from "../config/prismaClient";

export interface deliveryData {
  pickupLocation: string;
  dropLocation: string;
  itemDescription: string;
  createdById: string;
}

export class DeliveryRepository {
  async create(data: deliveryData): Promise<Delivery> {
    const delivery = await prisma.delivery.create({ data: data });
    return delivery;
  }

  async findById(id: string): Promise<Delivery | null> {
    return prisma.delivery.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Delivery[]> {
    const delivery = await prisma.delivery.findMany({
      where: {
        createdById: userId,
      },
      orderBy: { createdAt: "desc" },
    });
    return delivery;
  }

  async findAvailable(): Promise<Delivery[]> {
    return await prisma.delivery.findMany({
      where: {
        assignedToId: null,
        status: "PENDING",
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async assignDriver(deliveryId: string, driverId: string) {
    return await prisma.delivery.update({
      where: { id: deliveryId },
      data: { assignedToId: driverId, status: "ACCEPTED" },
    });
  }

  async updateStatus(
    deliveryId: string,
    status: DeliveryStatus
  ): Promise<Delivery> {
    return prisma.delivery.update({
      where: { id: deliveryId },
      data: { status },
    });
  }
}
