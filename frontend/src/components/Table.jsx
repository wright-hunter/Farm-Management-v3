import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './table.module.css';

const Table = ({ api }) => {
    // State to store the fetched data
    const [data, setData] = useState([]);

    // Fetch data from the Flask API
    useEffect(() => {
        axios.get(api) // Replace with your Flask server URL
            .then(response => {
                const dataArray = Array.isArray(response.data) ? response.data : [response.data];
                setData(dataArray); // Set the fetched data to state
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                {data.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;