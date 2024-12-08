import React, { useRef, useState } from 'react';
import { Modal, ModalRefType } from '@piximind/ds-p-23';

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<ModalRefType>(null);

    const handleOpenModal = () => {
        setIsModalOpen(true);
        modalRef.current?.onOpen(); // Optionally call onOpen callback
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        modalRef.current?.onClose(); // Optionally call onClose callback
    };

    const handleSubmit = () => {
        // Handle submit action
        console.log("Submitted");
        handleCloseModal();
    };

    return (
        <div>
            <button onClick={handleOpenModal}>Open Modal</button>
            
            {isModalOpen && (
                <Modal
                    ref={modalRef}
                    withCloseIcon={true}
                    withSubmitAction={true}
                    contentClassName="modal-content"
                    containerClassName="modal-container"
                    containerBtnClassName="modal-btn-container"
                    onExit={() => console.log("Modal exited")}
                    onShow={() => console.log("Modal shown")}
                >
                    <h2>Modal Title</h2>
                    <p>This is the content of the modal.</p>
                </Modal>
            )}
        </div>
    );
};

export default App;
