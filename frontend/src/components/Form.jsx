import axios from 'axios';
import styles from './form.module.css';
import { useEffect, useState } from 'react';

export const Form = ({ 
    api, 
    columns = [], 
    closeModal, 
    setSuccess, 
    success, 
    isEditMode = false, 
    itemId = null,
    rowData = null // Accept the row data from the table
}) => {
    const [formValues, setFormValues] = useState(rowData || {});

    useEffect(() => {
        // Use rowData directly if provided
        if (rowData && isEditMode) {
            setFormValues(rowData);
        } else {
            // Reset form values if no row data or not in edit mode
            setFormValues({});
        }
    }, [isEditMode, rowData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const request = isEditMode
            ? axios.put(`${api}/${itemId}`, data)
            : axios.post(api, data);

        request
            .then(response => {
                console.log(isEditMode ? 'Data updated successfully:' : 'Data submitted successfully:', response.data);
                closeModal();
                setSuccess(!success);
            })
            .catch(error => {
                console.error(isEditMode ? 'Error updating data:' : 'Error submitting data:', error);
            });
    };

    const renderFormElement = (column) => {
        const value = formValues[column.accessorKey] !== undefined ? formValues[column.accessorKey] : '';

        if (column.inputType === 'select') {
            return (
                <select
                    name={column.accessorKey}
                    required={column.required !== false}
                    defaultValue={value}
                >
                    {column.options && column.options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label || option.value}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <input
                type={column.type || 'text'}
                name={column.accessorKey}
                defaultValue={value}
                required={column.required !== false}
            />
        );
    };

    const formColumns = columns.filter(column => column.inForm !== false);

    // No loading state needed since we're using rowData directly
    return (
        <form className={styles.flex} onSubmit={handleSubmit}>
            {formColumns.map((column) => (
                <div className={styles.entry} key={column.accessorKey}>
                    <label>
                        {column.header}<br />
                        {renderFormElement(column)}
                    </label>
                </div>
            ))}
            <button type="submit" className={styles.button}>
                {isEditMode ? 'Update' : 'Submit'}
            </button>
        </form>
    );
};

export default Form;