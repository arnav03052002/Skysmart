// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import styles from "../Styles/selectbus.module.css";
// import axios from "axios";
// import { AiTwotoneStar } from "react-icons/ai";
// import { BiArrowFromLeft } from "react-icons/bi";
// import { saveDatafilter } from "../Redux/filter/filter.action";
// import { removeall } from "../Redux/ticket/ticket.action";
// import Filters from "../Components/Seats/Filters";
// import { useDispatch, useSelector } from "react-redux";
// import { error } from "../Utils/notification";
// function SelectBus() {
//   let [searchParams, setSearchParams] = useSearchParams();
//   const [wentwrong, setwentwrong] = useState(false);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const dataredux = useSelector((state) => state.filter.data);

//   useEffect(() => {
//     dispatch(removeall());
//   }, []);

//   useEffect(() => {
//     let from = searchParams.get("from");
//     let to = searchParams.get("to");
//     let date = searchParams.get("date");
//     if (
//       from === "" ||
//       to === "" ||
//       date === "" ||
//       from === null ||
//       to === null ||
//       date === null ||
//       date === undefined
//     ) {
//       setwentwrong(true);
//     } else {
//       getdata(from, to, date);
//     }
//   }, []);

//   async function getdata(from, to, date) {
//     // console.log(from, to, date);
//     try {
//       let res = await axios.post(
//         `${process.env.REACT_APP_SERVER_URL}/bus/getall`,
//         {
//           from,
//           to,
//           date,
//         }
//       );
//       // console.log("jihii",res.data);
//       if (res.data.length === 0) {
//         error("Cities Not Found. Try Mumbai To Bangluru");
//         return navigate("/");
//       }
//       dispatch(saveDatafilter(res.data));
//       setwentwrong(false);
//     } catch (error) {
//       console.log(error.message);
//       setwentwrong(true);
//     }
//   }

//   async function handlebook(ele) {
//     navigate({
//       pathname: `/bookticket/${ele._id}`,
//       search: `?&date=${searchParams.get("date")}`,
//     });
//   }

//   return (
//     <>
//       {wentwrong ? (
//         <div className={styles.wrong}>
//           <img src={require("../Images/404-error-page-templates.png")} />
//         </div>
//       ) : (
//         <div className={styles.main}>
//           <div className={styles.filter}>
//             <h5
//               style={{
//                 textAlign: "left",
//                 marginLeft: "25px",
//               }}
//             >
//               FILTERS
//             </h5>
//             <hr />
//             <Filters />
//             <hr />
//           </div>
//           <div className={styles.busdata}>
//             {dataredux?.map((ele, i) => {
//               return (
//                 <div key={i}>
//                   <h5>
//                     {ele.companyname.charAt(0).toUpperCase() +
//                       ele.companyname.slice(1)}{" "}
//                     Travels
//                   </h5>
//                   <div>
//                     {" "}
//                     <p>{ele.from}</p>
//                     <p>
//                       <BiArrowFromLeft />
//                     </p>
//                     <p>{ele.to}</p>
//                   </div>{" "}
//                   <div>
//                     {" "}
//                     {ele.aminites.map((e, i) => (
//                       <div key={i}>
//                         {" "}
//                         <p>{e}</p>
//                       </div>
//                     ))}
//                   </div>
//                   <hr />
//                   <h6>Arrival Time : {ele.arrival}</h6>
//                   <h6>Departure Time : {ele.departure}</h6>
//                   <hr />
//                   <h6>Email : {ele.email}</h6>
//                   <h6>Phone : {ele.phone}</h6>
//                   <hr />
//                   <div>
//                     {" "}
//                     <h5>Price : ₹ {ele.price}</h5>
//                     <h5>
//                       {Array(5)
//                         .fill("")
//                         .map((_, i) => (
//                           <AiTwotoneStar
//                             key={i}
//                             color={i < ele.rating ? "#FFED00" : "gray"}
//                           />
//                         ))}
//                     </h5>
//                   </div>
//                   <button onClick={() => handlebook(ele)}>View Seats</button>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
// export default SelectBus;


import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import styles from "../Styles/selectbus.module.css";
import { error } from "../Utils/notification";
import { BiArrowFromLeft } from "react-icons/bi";
import { AiTwotoneStar } from "react-icons/ai";

function SelectBus() {
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [wentwrong, setwentwrong] = useState(false);
  const [airlines, setAirlines] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const date = searchParams.get("date");

    if (!from || !to || !date) {
      setwentwrong(true);
    } else {
      fetchFlights(from, to, date);
    }
  }, []);

  const fetchFlights = async (from, to, date) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/flights/search`, {
        source: from,
        destination: to,
        date,
      });

      if (res.data.status === "success") {
        const allFlights = res.data.flights;
        setFlights(allFlights);
        setFilteredFlights(allFlights);
        const uniqueAirlines = [...new Set(allFlights.map(f => f.airline))];
        setAirlines(uniqueAirlines);
        setwentwrong(false);
      } else {
        error("No flights found.");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      setwentwrong(true);
    }
  };

  const handleBook = (flight) => {
    navigate(`/bookticket/${flight._id}?date=${searchParams.get("date")}`);
  };

  const applyFilters = () => {
    let results = [...flights];

    if (selectedAirline) {
      results = results.filter(f => f.airline === selectedAirline);
    }

    if (minPrice !== "") {
      results = results.filter(f => f.price >= parseFloat(minPrice));
    }

    if (maxPrice !== "") {
      results = results.filter(f => f.price <= parseFloat(maxPrice));
    }

    setFilteredFlights(results);
  };

  const resetFilters = () => {
    setSelectedAirline("");
    setMinPrice("");
    setMaxPrice("");
    setFilteredFlights(flights);
  };

  return (
    <>
      {wentwrong ? (
        <div className={styles.wrong}>
          <img src={require("../Images/404-error-page-templates.png")} alt="Error" />
        </div>
      ) : (
        <div className={styles.main}>
          <div className={styles.filter}>
            <h5 style={{ textAlign: "left", marginLeft: "25px" }}>FILTERS</h5>
            <hr />
            {/* Airline filter */}
            <div style={{ padding: "0 20px", marginBottom: "10px" }}>
              <label>Airline:</label>
              <select
                value={selectedAirline}
                onChange={(e) => setSelectedAirline(e.target.value)}
                className="form-select"
              >
                <option value="">All Airlines</option>
                {airlines.map((airline, i) => (
                  <option key={i} value={airline}>{airline}</option>
                ))}
              </select>
            </div>

            {/* Price filter */}
            <div style={{ padding: "0 20px" }}>
              <label>Price ($):</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="form-control"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            {/* Apply & Reset buttons */}
            <div style={{ padding: "20px" }}>
              <button className="btn btn-primary w-100 mb-2" onClick={applyFilters}>Apply Filters</button>
              <button className="btn btn-secondary w-100" onClick={resetFilters}>Reset</button>
            </div>
            <hr />
          </div>

          {/* Flights display */}
          <div className={styles.busdata}>
            {filteredFlights.map((flight, i) => (
              <div key={i} className={styles.card}>
                <h5>{flight.airline} — {flight.flightNumber}</h5>
                <div className={styles.route}>
                  <p>{flight.departureCity} ({flight.departureAirportCode})</p>
                  <p><BiArrowFromLeft /></p>
                  <p>{flight.arrivalCity} ({flight.arrivalAirportCode})</p>
                </div>
                <hr />
                <p>Departure Time: <strong>{new Date(flight.departureTime).toLocaleString()}</strong></p>
                <p>Arrival Time: <strong>{new Date(flight.arrivalTime).toLocaleString()}</strong></p>
                <p>Duration: {flight.duration}</p>
                <hr />
                <div className={styles.bottom}>
                  <h5>Price: ${flight.price.toFixed(2)}</h5>
                  <div>
                    {[...Array(5)].map((_, idx) => (
                      <AiTwotoneStar key={idx} color={idx < 4 ? "#FFED00" : "gray"} />
                    ))}
                  </div>
                </div>
                <button onClick={() => handleBook(flight)}>Book Now</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default SelectBus;
