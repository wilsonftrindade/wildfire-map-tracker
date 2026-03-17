import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/fire-alert'

const Marker = ({lat, lgn, onClick}) => {
  return (
    <div className = "marker" onClick = {onClick}>
        <Icon icon = {locationIcon} className  = "location-icon"/>
    </div>
  );
};

export default Marker;