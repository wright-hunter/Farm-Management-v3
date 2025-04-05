import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './table.module.css';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';

// Format currency values
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Format numbers with commas
const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
};

// Receives data and column definitions as props
const Table = ({ 
  data = [], 
  columns = [], 
  newEntry, 
  editEntry, 
  basePath = '', 
  clickableRows = false, 
  onSuccess, 
  sortBy 
}) => {
  const navigate = useNavigate();

  const sortedData = sortBy 
  ? [...data].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0;
    }).reverse() 
  : data;

  const handleDelete = (id, e) => {
    const url = `${basePath}/${id}`;

    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this item?')) {
      axios.delete(url)
        .then((response) => {
          console.log('Item deleted successfully:', response.data);
          onSuccess();
        })
        .catch((error) => {
          console.error('Error deleting item:', error);
        });
      console.log(`Item with ID ${id} deleted.`);
    }
  };

  const handleEdit = (id, item, e) => {
    e.stopPropagation();
    // Call the parent's editEntry function with the ID and item data
    editEntry(id, item);
  };

  const handleRowClick = (id, name) => {
    // Handle row click event
    navigate(`${id}`, {state: { name }});
  };

  // Function to render cell content based on column settings
  const renderCellContent = (item, column) => {
    const value = item[column.accessorKey];
    
    // Return early if value is undefined or null
    if (value === undefined || value === null) {
      return value;
    }
    
    // Check if this column should be formatted as currency
    if (column.currency === true) {
      return formatCurrency(value);
    }
    
    if (column.accessorKey === 'year') {
      return value;
    }

    // Format any numeric values with commas
    if (typeof value === 'number') {
      return formatNumber(value);
    }

    return value;
  };

  return (
    <div className={styles.layout}>
      {newEntry && (
        <div className={styles.taskbar}>
          <Plus size={30} className={styles.button} onClick={newEntry} />
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            {/* Create headers from columns prop */}
            {columns.map((column) => (
              <th className={styles.contentColumn} key={column.accessorKey || column.header}>{column.header}</th>
            ))}
            <th className={styles.actions}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Create rows from data prop */}
          {sortedData.map((item) => (
            <tr
              key={item.id}
              onClick={clickableRows ? () => handleRowClick(item.id, item.name) : null}
              className={clickableRows ? styles.clickable : ''}
            >
              {/* Create cells for each column */}
              {columns.map((column) => (
                <td key={column.accessorKey || column.header}>
                  {/* Get data using the accessorKey string and format if needed */}
                  {renderCellContent(item, column)}
                </td>
              ))}
              <td className={styles.actions}>
                <Pencil 
                  size={20} 
                  className={clickableRows ? styles.buttonClickableRow : styles.button} 
                  onClick={(e) => handleEdit(item.id, item, e)} 
                />
                <Trash2 
                  size={20} 
                  className={clickableRows ? styles.buttonClickableRow : styles.button} 
                  onClick={(e) => handleDelete(item.id, e)} 
                />
              </td>
            </tr>
          ))}

          {/* Message for empty data */}
          {sortedData.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} style={{ textAlign: 'center' }}>
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;