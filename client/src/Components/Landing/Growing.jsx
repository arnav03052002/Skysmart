import styles from "../../Styles/landing.module.css";
function Growing() {
  return (
    <>
      <div className={styles.globalPresenceContainer}>
        <div className={styles.globalPresenceHeading}>
          THE NUMBERS ARE GROWING
        </div>
        <div className={styles.counts}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className={styles.countryName}>customers</div>
            <div className={styles.numbers}>23 M</div>
            <div className={styles.para}>
              SmartSky is trusted by over 23 million happy customers globally
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className={styles.countryName}>OPERATORS</div>
            <div className={styles.numbers}>2600</div>
            <div className={styles.para}>
              network of over 2600 bus operators worldwide
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingBottom: "40px",
            }}
          >
            <div className={styles.countryName}>BUS TICKETS</div>
            <div className={styles.numbers}>180+ M</div>
            <div className={styles.para}>
              Over 180 million trips booked using SmartSky
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Growing;
