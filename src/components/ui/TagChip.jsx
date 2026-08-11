import styles from "../../styles/components/TagChip.module.css";

export default function TagChip({ text, variant = "primary" }) {
  return <div className={`${styles.tagChip} ${styles[variant]}`}>{text}</div>;
}
