import { useMemo, useState } from "react";
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';
import Header from "./Header";
import LocationInfoBox from "./LocationInfoBox"

// Constants
const regionOptions = {
  "north-america": {
    latmin: 7.0,
    latmax: 83.0,
    lngmin: -168.0,
    lngmax: -52.0
  },
  "south-america": {
    latmin: -55.0,
    latmax: 12.0,
    lngmin: -81.0,
    lngmax: -35.0
  },
  europe: {
    latmin: 35.0,
    latmax: 72.0,
    lngmin: -25.0,
    lngmax: 65.0
  },
  asia:{
    latmin: -10.0,
    latmax: 80.0,
    lngmin: 40.0,
    lngmax: 180.0
  },
  africa:{
    latmin: -35,
    latmax: 37,
    lngmin: -20,
    lngmax: 55
  },
  australia:{
    latmin: -50,
    latmax: -10,
    lngmin: 110,
    lngmax: 180
  }
}

// Map Component
const Map = ({ eventData, center = { lat: 42.0565, lng: -87.6753 }, zoom = 6 }) => {
  const[bounds, setBounds] = useState(null);
  const[maxMarkers, setMaxMarkers] = useState(500);
  const[region, setRegion] = useState("all");
  const[locationInfo, setLocationInfo] = useState(null);

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

  const regionalWildfireEvents = useMemo(() => {
    if (region === "all") return wildfireEvents;

    return wildfireEvents
      .filter (ev => {
        const longitude = ev.geometry[0].coordinates[0];
        const latitude = ev.geometry[0].coordinates[1];

        return isInRegion(longitude, latitude, regionOptions[region]);
      });
  }, [wildfireEvents, region]);

  const visibleWildfireEvents = useMemo((() => {
    if (!bounds) return [];

    return regionalWildfireEvents
      .filter(ev => {
        const longitude = ev.geometry[0].coordinates[0];
        const latitude = ev.geometry[0].coordinates[1];

        const north = bounds.ne.lat;
        const south = bounds.se.lat;
        const east = normalizeLng(bounds.ne.lng);
        const west = normalizeLng(bounds.nw.lng);

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
  }), [regionalWildfireEvents, bounds]);

  const limitedWildfireMarkers = useMemo(() => {
    return visibleWildfireEvents.slice(0, maxMarkers);  
  },[maxMarkers, visibleWildfireEvents]);

  const markers = useMemo(() => {
    return limitedWildfireMarkers.map(ev => {
      return (
        <Marker key={ev.id} lat={ev.geometry[0].coordinates[1]} lng={ev.geometry[0].coordinates[0]} onClick={() => setLocationInfo(ev)}/>
      );
    });
  }, [limitedWildfireMarkers]);

  return (
    <div>
      <div className="top-bar">
        <Header/>
        <div className="map-selector"> 
          <label>
            Continent:
          </label>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value={"north-america"}>North America</option>
            <option value={"south-america"}>South America</option>
            <option value={"europe"}>Europe</option>
            <option value={"asia"}>Asia</option>
            <option value={"africa"}>Africa</option>
            <option value={"australia"}>Australia</option>
            <option value={"all"}>All</option>
          </select>
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
          {locationInfo && <LocationInfoBox info={locationInfo}/>}
      </div>
    </div>
  );
};

const isInRegion = (lng, lat, bounds) => {
  return (
    lat > bounds.latmin &&
    lat < bounds.latmax &&
    lng > bounds.lngmin &&
    lng < bounds.lngmax
  );
};

const normalizeLng = (lng) => {
  return (((((lng + 180) % 360) + 360) % 360) -180);
};

export default Map;
