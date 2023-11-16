import { useEffect } from 'react';
import Modal from 'react-modal';

function Popup({ children, isOpen, onRequestClose, width, height }) {
  useEffect(() => {
    Modal.setAppElement('#root'); // Specify the root element of your React app
  }, []);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          width: width,
          height: height,
          margin: 'auto',
          border: 'none',
          borderRadius: '5px',
        },
      }}
    >
      {children}
    </Modal>
  );
}

export default Popup;
