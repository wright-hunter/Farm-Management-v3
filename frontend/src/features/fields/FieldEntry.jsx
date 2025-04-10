import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './fieldentry.module.css';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Form from '../../components/Form';
import { useParams } from 'react-router-dom';
import SimpleChart from '../../components/SimpleChart';
import { useLocation } from 'react-router-dom';

// Adjust 'header' and 'accessorKey' based on your actual API response
const fieldColumns = [
  {
    header: 'Year',
    accessorKey: 'year'
  },
  {
    header: 'Acres',
    accessorKey: 'acres_harvested'
  },
  {
    header: 'Crop',
    accessorKey: 'crop_type',
    inputType: 'select',
    options: [
        { value: 'Corn', label: 'Corn' },
        { value: 'Soybeans', label: 'Soybeans' },
        { value: 'Oats', label: 'Oats' },
        { value: 'Wheat', label: 'Wheat' },
        { value: 'Barley', label: 'Barley' }
    ]
  },
  {
    header: 'Passes',
    accessorKey: 'passes'
  },
  {
    header: 'Seed Cost',
    accessorKey: 'seed_cost',
    currency: true
  },
  {
    header: 'Fertilizer Cost',
    accessorKey: 'fertilizer_cost',
    currency: true
  },
  {
    header: 'Chemical Cost',
    accessorKey: 'chemical_cost',
    currency: true
  },
  {
    header: 'Crop Insurance',
    accessorKey: 'crop_insurance',
    currency: true
  },
  {
    header: 'Rent',
    accessorKey: 'rent',
    currency: true
  },
  {
    header: 'Bushels Harvested',
    accessorKey: 'bushels_harvested'
  },
  {
    header: 'Break Even',
    accessorKey: 'break_even_price',
    inForm: false,
    currency: true
  }
];


const FieldEntry = ({ api }) => {
  const { id } = useParams(); // Get the ID from the URL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldData, setFieldData] = useState([]); // State to hold fetched data
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [rowData, setRowData] = useState({}); // State to hold row data
  const location = useLocation();
  const { name } = location.state || {}; // Get the name from the state

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

  const API_URL = `${api}/${id}`;
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
      <div className={styles.plot}>
        <SimpleChart 
          data={fieldData} 
          dataKey='bu_acre' 
          xAxisKey='year' 
          title='Bu/Acre' 
        />
      </div>
      <div className={styles.plot}>
        <SimpleChart 
          data={fieldData} 
          dataKey='break_even_price' 
          xAxisKey='year' 
          title='Break Even Price ($/bu)'
        />
      </div>
      <div className={styles.tableLarge}>
        <h1>{name} History</h1>
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
            sortBy='year'
            onSuccess={() => setSuccess(!success)}
            basePath={API_URL}
          />
        )}
      </div>
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

export default FieldEntry;