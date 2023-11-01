<<<<<<< HEAD
import moment from "moment";
import styles from "../assets/certificateGenerator.module.scss";

const Certificate = ({
  name,
  course,
  dateOfConductStart,
  dateOfConductEnd,
  signature,
  signatureDetails,
}) => {
=======
import moment from 'moment';
import styles from '../assets/certificateGenerator.module.scss';

const Certificate = ({ name, course, dateOfConductStart, dateOfConductEnd, signature, signatureDetails }) => {
>>>>>>> b11a4a1 (Changed UserRegistration)
  return (
    <>
      <div className={styles.certificateWrapper}>
        <div className={styles.certificateContainer}>
          <h1>CERTIFICATE OF APPRECIATION</h1>

<<<<<<< HEAD
          <span className={styles.smallText}>
            This certificate is proudly awarded to
          </span>

          <p className={styles.primaryItalicText}>{name}</p>

          <span className={styles.smallText}>
            for successfully completing the course
          </span>

          <h2>{course}</h2>

          <span className={styles.smallText}>{`conducted from ${
            dateOfConductStart
              ? moment(dateOfConductStart).format("MMMM YYYY")
              : "-"
          } to ${
            dateOfConductEnd
              ? moment(dateOfConductEnd).format("MMMM YYYY")
              : "-"
          }`}</span>

          <div className={styles.signatureBlock}>
            <img
              className={styles.signatureImage}
              src={signature.preview}
              alt=""
            />
=======
          <span className={styles.smallText}>This certificate is proudly awarded to</span>

          <p className={styles.primaryItalicText}>{name}</p>

          <span className={styles.smallText}>for successfully completing the course</span>

          <h2>{course}</h2>

          <span className={styles.smallText}>{`conducted from ${dateOfConductStart ? moment(dateOfConductStart).format('MMMM YYYY') : '-'} to ${
            dateOfConductEnd ? moment(dateOfConductEnd).format('MMMM YYYY') : '-'
          }`}</span>

          <div className={styles.signatureBlock}>
            <img className={styles.signatureImage} src={signature.preview} alt="" />
>>>>>>> b11a4a1 (Changed UserRegistration)

            <span className={styles.horizontalBar} />

            <span className={styles.smallText}>{signatureDetails}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Certificate;
