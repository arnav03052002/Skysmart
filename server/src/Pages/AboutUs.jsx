import React from 'react';

const AboutUs = () => {
  return (
    <div className="about-us">
      <h1>About Us</h1>
      <p>Welcome to Sky Smart! We are Excited to provide best flight at best price! </p>

      <div className="team-member">
        <h2>Arnav Tanawade </h2>
        <img src="[Person 1 Photo URL]" alt="[Person 1 Name]" className="team-member-photo" />
        <p>
          Hii, my name is Arnav, I am currently a student of California state University, Fullerton.
        </p>
      </div>

      <div className="team-member">
        <h2>Shubham Jakhete</h2>
        <img src="[Person 2 Photo URL]" alt="[Person 2 Name]" className="team-member-photo" />
        <p> Hii, my name is Shubham, I am currently a student of California state University, Fullerton.
        </p>
      </div>

      <p>Together we are commited to help you find best flight at best price.</p>
    </div>
  );
};

export default AboutUs;
