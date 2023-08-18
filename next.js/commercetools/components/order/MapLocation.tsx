import styles from "./mapLocation.module.css";
import { MdPlace } from "react-icons/md";

export default function MapLocation({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  return (
    <>
      <div className={styles.mapContainer}>
        <MdPlace className={styles.mapIcon} />
      </div>
    </>
  );
}
