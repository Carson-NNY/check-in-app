import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} National Museum of Mathematics</p>
      </div>
    </div>
  );
};

export default Footer;
