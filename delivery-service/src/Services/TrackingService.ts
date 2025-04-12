import { TrackingRepository } from "../Repository/TrackingRepository";

export class TrackingService {
  private trackingRepo = new TrackingRepository();

  async getLastLocation(deliveryId: string) {
    return this.trackingRepo.getLastLocation(deliveryId);
  }

  async getTrackingHistory(deliveryId: string) {
    return this.trackingRepo.getTrackingHistory(deliveryId);
  }
}
