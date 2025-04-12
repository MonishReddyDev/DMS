import prisma from "../config/prismaClient";

export class TrackingRepository {
  async saveLocation(data: {
    deliveryId: string;
    latitude: number;
    longitude: number;
  }) {
    return prisma.tracking.create({ data });
  }

  async getTrackingHistory(deliveryId: string) {
    return prisma.tracking.findMany({
      where: { deliveryId },
      orderBy: { timestamp: "asc" },
    });
  }

  async getLastLocation(deliveryId: string) {
    return prisma.tracking.findFirst({
      where: { deliveryId },
      orderBy: { timestamp: "desc" },
    });
  }
}
