import React from 'react';
import styles from "./404.module.css"
const Notfound = () => {
    return (
        <div className={styles.big}>
        <div className={styles.container} >
       <section className="notFound">
  <div className="img">
    <img src="https://assets.codepen.io/5647096/backToTheHomepage.png" alt="Back to the Homepage" />
    <img src="https://assets.codepen.io/5647096/Delorean.png" alt="El Delorean, El Doc y Marti McFly" />
  </div>
  <div style={{
    height: "50vh"
  }} className={styles.text}>
    <h1 style={{
        color:"white"
    }} >404</h1>
    <h2>PAGE NOT FOUND</h2>
    <h3>BACK TO HOME?</h3>
    <a style={{
            textDecoration: "none",
            marginRight: "20px"
    }} href="/" className="yes">YES</a>
    <a style={{
            textDecoration: "none",
            marginRight: "20px"
    }}  href="/">NO</a>
  </div>
</section>
</div>
</div>
    );
}

export default Notfound;
