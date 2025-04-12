import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

type LatLng = {
  lat: number;
  lng: number;
};

type MapViewProps = {
  pickup: LatLng;
  drop: LatLng;
  driver?: LatLng;
};

export default function MapView({ pickup, drop, driver }: MapViewProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={driver || pickup}
      zoom={13}
    >
      {/* 🔴 Pickup */}
      <Marker
        position={pickup}
        label="P"
        icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
      />

      {/* 🟢 Drop */}
      <Marker
        position={drop}
        label="D"
        icon={{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" }}
      />

      {/* 🔵 Driver (live) */}
      {driver && (
        <Marker
          position={driver}
          label="👨‍✈️"
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          }}
        />
      )}
    </GoogleMap>
  );
}
