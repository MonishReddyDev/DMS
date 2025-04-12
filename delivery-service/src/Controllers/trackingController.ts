import { Request } from "express";
import { controllerWrapper } from "../utils/controllerWrapper";
import { TrackingService } from "../Services/TrackingService";

const trackingService = new TrackingService();

export const getLastLocation = controllerWrapper(async (req: Request) => {
  const deliveryId = req.params.deliveryId;
  const location = await trackingService.getLastLocation(deliveryId);

  if (!location) {
    return {
      status: 404,
      message: "No location updates found for this delivery",
      data: null,
    };
  }

  return {
    status: 200,
    message: "Last known location retrieved successfully",
    data: location,
  };
});

export const getTrackingHistory = controllerWrapper(async (req: Request) => {
  const deliveryId = req.params.deliveryId;
  const history = await trackingService.getTrackingHistory(deliveryId);

  if (!history || history.length === 0) {
    return {
      status: 404,
      message: "No tracking history found",
      data: [],
    };
  }

  return {
    status: 200,
    message: "Tracking history retrieved",
    data: history,
  };
});
