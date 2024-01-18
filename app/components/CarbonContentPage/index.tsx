import React from "react";
import styles from "./styles.module.css";

const CarbonContentPage: React.FC<React.PropsWithChildren> = (props) => {
  return <div className={styles.root}>{props.children}</div>;
};

export default CarbonContentPage;
