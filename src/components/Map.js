import { useMemo, useState } from "react";
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';
import Header from "./Header";


// Map Component
const Map = ({ eventData, center = { lat: 42.0565, lng: -87.6753 }, zoom = 6 }) => {
  const[bounds, setBounds] = useState(null);
  const[maxMarkers, setMaxMarkers] = useState(500);

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
      });   
  }), [wildfireEvents, bounds]);

  const limitedWildfireMarkers = useMemo(() => {
    return visibleWildfireEvents.slice(0, maxMarkers);  
  },[maxMarkers, visibleWildfireEvents]);

  const markers = useMemo(() => {
    return limitedWildfireMarkers.map(ev => {
      return (
        <Marker key={ev.id} lat={ev.geometry[0].coordinates[1]} lng={ev.geometry[0].coordinates[0]}/>
      );
    });
  }, [limitedWildfireMarkers]);

  return (
    <div>
      <div className="top-bar">
        <Header/>
        <div className="map-selector"> 
          <label>
            Maximum number of Markers:
          </label>
          <select value={maxMarkers} onChange={(e) => setMaxMarkers(Number(e.target.value))}>
            <option value={250}>250</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
            <option value={2500}>2500</option>
          </select>
        </div>
      </div>

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
    </div>
  );
};

export default Map;
