import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function ScatteringMap({
  data,
  containerClassName,
  className,
}: {
  data: any[];
  containerClassName?: string;
  className?: string;
}) {
  return (
    <div className={containerClassName}>
      <MapContainer
        center={[32.4279, 53.688]}
        zoom={5.5}
        className={className}
        style={{ height: '100%', width: '100%', borderRadius: '15px' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url={`tile/{z}/{x}/{y}.png`}
        />
        <MarkerClusterGroup>
          {data?.map((city, index) => (
            <Marker
              key={index}
              position={[city?.latitude, city?.longitude]}
              icon={L?.divIcon({
                html: `<div style="background:#D01739;border-radius:50%;width:12px;height:12px;"></div>`,
                className: '',
                iconSize: [12, 12],
              })}
            >
              <Popup>{city?.name ?? `جمعیت: ${city?.total_count}`}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export default ScatteringMap;
