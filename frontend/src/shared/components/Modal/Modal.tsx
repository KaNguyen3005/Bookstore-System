import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;

{/* Khi su dung
    <Modal isOpen={isOpen} onClose={close}>
      <h2>Xác nhận</h2>
      <button>Xoá</button>
    </Modal> */}