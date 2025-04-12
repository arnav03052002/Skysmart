import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const FlightResults = () => {
  const [flights, setFlights] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const source = query.get("source");
  const destination = query.get("destination");
  const date = query.get("date");

  useEffect(() => {
    if (source && destination && date) {
      axios
        .get("http://localhost:8080/flights/search", {
          params: { source, destination, date },
        })
        .then((res) => setFlights(res.data))
        .catch((err) =>
          console.error("❌ Error fetching flights:", err.message)
        );
    }
  }, [source, destination, date]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>
        Flights from {source} to {destination} on {date}
      </h2>
      {flights.length === 0 ? (
        <p>No flights found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Airline</th>
              <th>Flight No</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Duration</th>
              <th>Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight._id}>
                <td>{flight.airline}</td>
                <td>{flight.flightNumber}</td>
                <td>{new Date(flight.departureTime).toLocaleString()}</td>
                <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                <td>{flight.duration}</td>
                <td>{flight.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FlightResults;
