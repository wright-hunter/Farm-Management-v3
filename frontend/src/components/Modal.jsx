import styles from './modal.module.css';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div style={{display: 'flex', justifyContent: 'flex-end', paddingBottom: '10px'}}>
          <X onClick={onClose} className={styles.closeButton}/>
        </div>
        {children}
      </div>
    </div>
  );
}
export default Modal;