import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './fields.module.css';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Form from '../../components/Form';

// Adjust 'header' and 'accessorKey' based on your actual API response
const fieldColumns = [
  {
    header: 'Name',
    accessorKey: 'name'
  },
  {
    header: 'Location',
    accessorKey: 'location',
    inputType: 'select',
    options: [
      { value: 'Rowena', label: 'Rowena' },
      { value: 'Bridgewater', label: 'Bridgewater' }
    ]
  }
];


const Fields = ({ api }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldData, setFieldData] = useState([]); // State to hold fetched data
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [rowData, setRowData] = useState({}); // State to hold row data

  const openModal = () => {
    setEditMode(false);
    setCurrentItemId(null);
    setIsModalOpen(true);
    setRowData({}); // Reset row data for new entry
  };
  
  const openEditModal = (id, item) => {
    setEditMode(true);
    setCurrentItemId(id);
    setIsModalOpen(true);
    setRowData(item); // Set the row data for editing
  };

  const closeModal = () => setIsModalOpen(false);

  const API_URL = api
  // Fetch data when the component mounts
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    axios.get(API_URL)
      .then(response => {
        // Ensure the data is an array
        const dataArray = Array.isArray(response.data) ? response.data : [response.data];
        setFieldData(dataArray); // Set the fetched data into state
      })
      .catch(fetchError => {
        console.error('Error fetching field data:', fetchError);
        setError('Failed to load.'); // Set error message
        setFieldData([]); // Clear data on error
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [success]); // Refetch when data successfully submitted

  return (
    <div className={styles.layout}>
      <div className={styles.table}>
        <h1>Fields</h1>
        {/* Render loading/error states or the table */}
        {isLoading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <Table
            data={fieldData}
            columns={fieldColumns}
            newEntry={openModal}
            editEntry={(id, item) => openEditModal(id, item)}
            basePath={api}
            sortBy='name'
            clickableRows={true}
            onSuccess={() => setSuccess(!success)}
            filterProperty='location'
          />
        )}
      </div>
      <div className={styles.plot}></div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Form 
          api={API_URL} 
          closeModal={closeModal} 
          columns={fieldColumns} 
          setSuccess={setSuccess} 
          success={success}
          isEditMode={editMode}
          itemId={currentItemId}
          rowData={rowData}
        />
      </Modal>
    </div>
  );
};

export default Fields;