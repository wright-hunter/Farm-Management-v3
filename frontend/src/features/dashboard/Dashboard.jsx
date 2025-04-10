import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './dashboard.module.css';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Form from '../../components/Form';
import SimpleChart from '../../components/SimpleChart';
import BarPlot from '../../components/BarPlot';
// Adjust 'header' and 'accessorKey' based on your actual API response
const fieldColumns = [
  {
    header: 'Year',
    accessorKey: 'year'
  },
  {
    header: 'Acres',
    accessorKey: 'total_acres_harvested',
    inForm: false
  },
  {
    header: 'Field Expenses',
    accessorKey: 'yearly_field_expenses',
    currency: true,
    inForm: false
  },
  {
    header: 'Equipment Expenses',
    accessorKey: 'yearly_equipment_expenses', 
    currency: true,
    inForm: false
  },
  {
  header: 'Equipment Purchases',
  accessorKey: 'yearly_equipment_purchases',
  currency: true,
  inForm: false
  },
  {
    header: "Fuel",
    accessorKey: 'fuel',
    currency: true
  },
    {
    header: 'Land Payments',
    accessorKey: 'land_payments',
    currency: true
    },
    {
    header: 'Property Taxes',
    accessorKey: 'property_tax',
    currency: true
    },
    {
    header: 'Misc',
    accessorKey: 'misc',
    currency: true
    }
];


const Dashboard = ({ api }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldData, setFieldData] = useState([]); // State to hold fetched data
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [rowData, setRowData] = useState({}); // State to hold row data
  const [year, setYear] = useState(null);

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

  const setHeader = (header) => {
    setYear(header);
  };

  const API_URL = api;
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
  
  const selectors = fieldData.find(item => item.year == year)?.crops
  ? Object.keys(fieldData.find(item => item.year == year).crops)
  : [];
  const yearData = fieldData.find(item => item.year == year);
  console.log(yearData)
  return (
    <div className={styles.layout}>
      <div className={styles.tableLarge}>
        <h1>{year || "Year"} Overview</h1>
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
            filterProperty='year'
            defaultToMaxValue={true}
            setYear={setHeader}
          />
        )}
      </div>
      <div className={styles.leftColumn}>
        <SimpleChart 
          data={fieldData} 
          dataKey='total_expenses' 
          xAxisKey='year' 
          title='Total Expenses ($)' 
        />
      </div>
      <div className={styles.rightColumn}>
        <BarPlot
          selectors={selectors}
          data={yearData || []}
        />
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

export default Dashboard;