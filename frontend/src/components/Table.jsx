import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './table.module.css';
import { Plus, Pencil, Trash2, Filter } from 'lucide-react';
import axios from 'axios';

// Format currency values
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
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
  sortBy,
  filterProperty = '', // New prop: just specify which property to filter by
  defaultToMaxValue = false, // New prop: when true, default filter to max value
  setYear
}) => {
  const navigate = useNavigate();
  
  // Extract unique filter options from data
  const filterOptions = filterProperty 
    ? [...new Set(data.map(item => item[filterProperty]).filter(Boolean))]
    : [];
    
  // Sort options if they are numbers
  if (filterOptions.length > 0 && typeof filterOptions[0] === 'number') {
    filterOptions.sort((a, b) => b - a);
  } else {
    filterOptions.sort();
  }
  
  // Determine initial filter value
  const getInitialFilter = () => {
    if (!filterProperty || filterOptions.length === 0) return 'all';
    
    if (defaultToMaxValue) {
      // Check if values are numeric
      if (typeof filterOptions[0] === 'number') {
        return String(Math.max(...filterOptions));
      } 
      // For strings, take the last value after sorting
      return String(filterOptions[filterOptions.length - 1]);
    }
    
    return 'all';
  };
  
  // Initialize state with proper default values
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredData, setFilteredData] = useState(data);
  
  // Set initial filter value only once when component mounts or filter property changes
  useEffect(() => {
    if (filterOptions.length > 0) {
      setActiveFilter(getInitialFilter());
    }
  }, [filterProperty, defaultToMaxValue]); // Only run when these props change

  // Filter data based on active filter
  useEffect(() => {
    if (!activeFilter || activeFilter === 'all') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter(item => 
        String(item[filterProperty]) === activeFilter
      ));
      setYear(activeFilter); // Set the year in the parent component
    }
  }, [data, activeFilter, filterProperty]);

  // Apply sorting after filtering
  const sortedData = sortBy 
    ? [...filteredData].sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
      }).reverse() 
    : filteredData;

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
    
    if (column.accessorKey === 'year' || column.accessorKey === 'year_purchased') {
      return value;
    }

    // Format any numeric values with commas
    if (typeof value === 'number') {
      return formatNumber(value);
    }

    return value;
  };

  // Only show filter if filterProperty is provided and options exist
  const showFilter = filterProperty && filterOptions.length > 0;

  return (
    <div className={styles.layout}>
      <div className={styles.taskbar}>
        {newEntry && <Plus size={30} className={styles.button} onClick={newEntry} />}
        
        {/* Filter dropdown */}
        {showFilter && (
          <div className={styles.filterContainer}>
            <Filter size={20} />
            <select 
              className={styles.filterSelect}
              value={activeFilter} 
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              {!defaultToMaxValue && (
                <option value="all">All {filterProperty}</option>
              )}
              {filterOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

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
              key={item.id || item.year}
              onClick={clickableRows ? () => handleRowClick(item.id, item.name || `${item.make || ''} ${item.model || ''}`.trim()) : null}
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
                  onClick={(e) => handleEdit(item.id || item.year, item, e)} 
                />
                <Trash2 
                  size={20} 
                  className={clickableRows ? styles.buttonClickableRow : styles.button} 
                  onClick={(e) => handleDelete(item.id || item.year, e)} 
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