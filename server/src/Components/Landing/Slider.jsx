import { useEffect, useState } from "react";
import styles from "../../Styles/landing.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { error } from "../../Utils/notification";

function Slider() {
  const [hover, sethover] = useState(false);
  const [source, setsource] = useState("");
  const [destination, setdestination] = useState("");
  const [date, setdate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState("one-way");

  const [showName, setShowNames] = useState(false);
  const [showNamedes, setShowNamesdes] = useState(false);
  const [output, setOutput] = useState([]);
  const [outputdes, setOutputdes] = useState([]);
  const [cityClicked, setCityclicked] = useState(false);
  const [CityDesclicked, setCityDesclicked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const mindate = new Date().toISOString().split("T")[0];
    setdate(mindate);
  }, []);

  useEffect(() => {
    if (source === "") {
      setShowNames(false);
      return;
    }
    if (cityClicked) {
      setCityclicked(false);
      return;
    }
    const timerID = setTimeout(() => handleGetRequest(source, setOutput, setShowNames), 500);
    return () => clearTimeout(timerID);
  }, [source]);

  useEffect(() => {
    if (destination === "") {
      setShowNamesdes(false);
      return;
    }
    if (CityDesclicked) {
      setCityDesclicked(false);
      return;
    }
    const timerID = setTimeout(() => handleGetRequest(destination, setOutputdes, setShowNamesdes), 500);
    return () => clearTimeout(timerID);
  }, [destination]);

  const handleGetRequest = async (query, setter, toggle) => {
    try {
      const res = await axios.post("https://blue-bus.onrender.com/city", {
        source: query
      });
      setter(res.data);
      toggle(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCityClick = (name, setter, toggle) => {
    setter(name);
    toggle(false);
  };

  const handleSearch = async () => {
    if (!source || !destination || !date) {
      error("Please fill all the fields.");
      return;
    }

    if (source === destination) {
      error("Source and destination cannot be the same.");
      return;
    }

    try {
      const res = await axios.post("https://blue-bus.onrender.com/city/showcity", {
        source,
        destination,
        date
      });

      if (res.data.status === "success") {
        navigate({
          pathname: "/selectbus",
          search: `?from=${source}&to=${destination}&date=${date}`,
        });
      } else {
        error("City not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.Carousel}>
      {/* Carousel Section */}
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {["photo-1590523277543-a94d2e4eb00b.avif", "photo-1544091441-9cca7fbe8923.avif", "photo-1600073957488-45273df3d014.avif"].map((img, i) => (
            <div className={`carousel-item ${i === 0 ? "active" : ""}`} key={i}>
              <img
                src={require(`../../Images/${img}`)}
                className="object-fit-cover"
                style={{ height: "75vh", width: "100%" }}
                alt="Slide"
                onMouseOver={() => sethover(true)}
                onMouseLeave={() => sethover(false)}
              />
            </div>
          ))}
        </div>

        {hover && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleAutoplaying"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleAutoplaying"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
          </>
        )}
      </div>

      {/* Trip Toggle */}
      <div className={styles.tripTypeToggle}>
        <button
          className={`${styles.toggleBtn} ${tripType === "one-way" ? styles.active : ""}`}
          onClick={() => setTripType("one-way")}
        >
          One Way
        </button>
        <button
          className={`${styles.toggleBtn} ${tripType === "round-trip" ? styles.active : ""}`}
          onClick={() => setTripType("round-trip")}
        >
          Round Trip
        </button>
      </div>

      {/* Input Section */}
      <div className={styles.data}>
        <div className={styles.inputsource}>
          <input
            type="text"
            placeholder="Source"
            value={source}
            onChange={(e) => setsource(e.target.value)}
          />
          {showName && (
            <div className={styles.names}>
              {output.map((item, i) => (
                <div key={i} onClick={() => handleCityClick(item.name, setsource, setShowNames)}>
                  <h6>{item.name}, {item.state}</h6>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.inputsource1}>
          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setdestination(e.target.value)}
          />
          {showNamedes && (
            <div className={styles.names1}>
              {outputdes.map((item, i) => (
                <div key={i} onClick={() => handleCityClick(item.name, setdestination, setShowNamesdes)}>
                  <h6>{item.name}, {item.state}</h6>
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setdate(e.target.value)}
        />

        {tripType === "round-trip" && (
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        )}

        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}

export default Slider;