import { useMemo, useState } from "react";
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';

// Constants
const MAX_MARKERS = 1000;

// Map Component
const Map = ({ eventData, center = { lat: 42.0565, lng: -87.6753 }, zoom = 6 }) => {
  const[bounds, setBounds] = useState(null)

  const wildfireEvents = useMemo(() => {
    return eventData.filter(ev => {
        return (
          ev.categories &&
          ev.categories.length > 0 &&
          ev.geometry &&
          ev.geometry.length > 0 &&
          ev.geometry[0].coordinates &&
          ev.geometry[0].coordinates.length >= 2 &&
          ev.categories[0].id === 'wildfires'
        );
      });
  }, [eventData]);

  const visibleWildfireEvents = useMemo((() => {
    if (!bounds) return [];

    return wildfireEvents
      .filter(ev => {
        const longitude = ev.geometry[0].coordinates[0];
        const latitude = ev.geometry[0].coordinates[1];

        const north = bounds.ne.lat;
        const south = bounds.se.lat;
        const east = bounds.ne.lng;
        const west = bounds.nw.lng;

        const isWithinLat = latitude <= north && latitude >= south;

        let isWithinLng;
        if (east >= west){
          isWithinLng = longitude >= west && longitude <= east;
        }

        else{
          isWithinLng = longitude >= west || longitude <= east;
        }

        return isWithinLat && isWithinLng;
      })
      .slice(0, MAX_MARKERS);     
  }), [wildfireEvents, bounds]);

  const markers = useMemo(() => {
    return visibleWildfireEvents.map(ev => {
      return (
        <Marker key={ev.id} lat={ev.geometry[0].coordinates[1]} lng={ev.geometry[0].coordinates[0]}/>
      );
    });
  }, [visibleWildfireEvents]);

  return (
    <div className="map">
        <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
            defaultCenter={center}
            defaultZoom={zoom}
            onChange={(mapState) => {
            setBounds(mapState.bounds);
            }}
        >
        {markers}
        </GoogleMapReact>
    </div>
  );
};

export default Map;
