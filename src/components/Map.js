import { useMemo } from "react";
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';

const Map = ({ eventData, center = { lat: 42.0565, lng: -87.6753 }, zoom = 6 }) => {
  const wildfireEvents = useMemo(() => {
    return eventData
      .filter(ev => {
        return (
          ev.categories &&
          ev.categories.length > 0 &&
          ev.geometry &&
          ev.geometry.length > 0 &&
          ev.geometry[0].coordinates &&
          ev.geometry[0].coordinates.length >= 2 &&
          ev.categories[0].id === 'wildfires'
        );
      })
      .map(ev => {
        return <Marker key={ev.id} lat={ev.geometry[0].coordinates[1]} lng={ev.geometry[0].coordinates[0]}/>;
      })
  }, [eventData]);

  return (
    <div className="map">
        <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
            defaultCenter={center}
            defaultZoom={zoom}
        >
        {wildfireEvents}
        </GoogleMapReact>
    </div>
  );
};

export default Map;
