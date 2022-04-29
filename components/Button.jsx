import styles from "../styles/Add.module.css";

const Button = (props) => {
  return (
    <div onClick={props.onClick} className={styles.mainAddButton}>
      {props.label}
    </div>
  );
};

export default Button;
