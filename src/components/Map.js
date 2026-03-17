import GoogleMapReact from 'google-map-react'

const Map = ({center = { lat: 42.0565, lng: -87.6753}, zoom = 6}) => {
  return (
    <div className = "map">
        <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
            defaultCenter={center}
            defaultZoom={zoom}
        >
        </GoogleMapReact>
    </div>
  );
};

export default Map;
