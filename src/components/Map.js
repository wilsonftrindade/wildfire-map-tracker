import GoogleMapReact from 'google-map-react'
import Marker from './Marker'

const Map = ({eventData, center = {lat: 42.0565, lng: -87.6753}, zoom = 6}) => {
    const markers = eventData.map(ev => {
      if (ev.categories[0].id === 8){
        return <Marker key = {ev.id} lat = {ev.geometries[0].coordinates[1]} lng = {ev.geometries[0].coordinates[0]}/>
      }
      return null
    })
    return (
    <div className = "map">
        <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
            defaultCenter={center}
            defaultZoom={zoom}
        >
          {markers}
        </GoogleMapReact>
    </div>
  );
};

export default Map;
