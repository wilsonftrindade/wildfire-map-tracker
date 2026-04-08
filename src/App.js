import { useEffect, useState } from "react";
import Map from './components/Map';
import Loader from './components/Loader';

function App() {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try{
        setLoading(true);
        setError(null);

        const res = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events');

        if (!res.ok){
          throw new Error(`Request failed with status ${res.status}`);
        }

        const {events} = await res.json();

        setEventData(events);
      }

      catch (err){
        setError(err.message);
      }
      finally{
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading){
    return <Loader/>;
  }

  if (error){
    return <p>{error}</p>;
  }

  return (
    <div>
      <Map eventData ={eventData}/>
    </div>
  );
};

export default App;
