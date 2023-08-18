import { IoMdBoat, IoIosHome } from "react-icons/io";
import styles from "./deliverymethod.module.css";

export type DeliveryMethodProps = {
  value: string;
  setValue: (value: string) => void;
};

export const DeliveryMethod = ({ value, setValue }: DeliveryMethodProps) => {
  return (
    <div className={styles.methodContainer}>
      <h2 className={styles.title}>Delivery method</h2>
      <label className={styles.method}>
        <input
          type="radio"
          id="ship"
          name="deliveryMethod"
          value="ship"
          checked={value === "ship"}
          className={styles.methodInput}
          onChange={(e) => setValue(e.target.value)}
        />
        <IoMdBoat className={styles.icon} />
        Ship
      </label>
      <label className={styles.method}>
        {/* This is disabled by default */}
        <input
          type="radio"
          id="pickUp"
          disabled
          name="deliveryMethod"
          value="pickUp"
          checked={value === "pickUp"}
          className={styles.methodInput}
          onChange={(e) => setValue(e.target.value)}
        />
        <IoIosHome className={styles.icon} />
        Pick up
      </label>
    </div>
  );
};
