import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  return (
    <>
      <footer
        style={{
          paddingTop: "15px",
          backgroundColor: "#222222",
          color: "white",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div>
                <h3>
                  <span style={{ color: "#5266FA" }}>Smart</span>Sky
                  </h3>
                <p className="mb-30 footer-desc">
                  This is the best site for booking a flight for your travel.
                  Travel safe and with comfort.
                </p>
              </div>
            </div>
            <div className="col-xl-2 offset-xl-1 col-lg-2 col-md-6">
              <div className="">
                <h4>Book</h4>
                <ul className="list-unstyled">
                  <li>
                    <p className="text-decoration-none">Flight Ticket</p>
                  </li>
                  <li>
                    <p className="text-decoration-none">Car Rentals</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6">
              <div>
                <h4>About</h4>
                <ul className="list-unstyled">
                  <li>
                  <p style={{ cursor: 'pointer' }} onClick={() => navigate("/about")} className="text-decoration-none">About us</p>                  
                  </li>
                  <li>
                    <p className="text-decoration-none">Contact us</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6">
              <div>
                <h4>Info</h4>
                <ul className="list-unstyled">
                  <li>
                    <p>T & C</p>
                  </li>
                  <li>
                    <p>
                      <p>Privacy Policy</p>
                    </p>
                  </li>
                  <li>
                    <p>Cookie Policy</p>
                  </li>
                  <li>
                    <p>FAQ</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
export default Footer;
