import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './barplot.module.css';

const BarPlot = ({ data, selectors }) => {
    const [selector, setSelector] = useState(null);
    
    // Update selector when data or selectors change
    useEffect(() => {
        // Only set the selector if selectors array exists and has items
        if (selectors && selectors.length > 0) {
            setSelector(selectors[0]);
        } else {
            // Reset selector if no selectors available
            setSelector(null);
        }
    }, [data, selectors]);
    
    const chartData = [];
    
    // Safely check if we can access the crop data and expenses
    const cropData = data?.crops?.[selector];
    const expenses = cropData?.expenses;
    
    if (selector && expenses) {
        chartData.push(
            { category: 'Seed', value: expenses.seed_cost },
            { category: 'Fertilizer', value: expenses.fertilizer_cost },
            { category: 'Chemical', value: expenses.chemical_cost },
            { category: 'Crop Insur', value: expenses.crop_insurance },
            { category: 'Rent/Interest', value: expenses.rent },
            { category: 'General Exp', value: expenses.allocated_general_expenses }
        );
    }
    
    return (
        <div className={styles.plotContainer}>
            <div className={styles.chartHeader}>
                <select 
                    className={styles.filterSelect} 
                    value={selector || ''}
                    onChange={(e) => {setSelector(e.target.value)}}
                    disabled={!selectors || selectors.length === 0}
                >
                    {selectors && selectors.length > 0 ? (
                        selectors.map(selectorOption => (
                            <option key={selectorOption} value={selectorOption}>
                                {selectorOption}
                            </option>
                        ))
                    ) : (
                        <option value="">No options available</option>
                    )}    
                </select>
                <p>
                    Break Even: {cropData ? 
                        `$${cropData.break_even_price.toFixed(2)} per bushel` : 
                        "N/A"}
                </p>
            </div>
            <div className={styles.plot}>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top:30, right: 30, left: 30, bottom: 70}}>
                          <Tooltip 
                              formatter={(value) => [
                                `$${value.toLocaleString(undefined, {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0
                                })}`, 
                                'Amount'
                              ]}
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                            <XAxis dataKey="category" angle={-75} textAnchor='end'/>
                            <YAxis 
                              tickFormatter={(value) => `$${value.toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                              })}`} 
                            />
                            <Bar dataKey="value" name="Amount" fill="var(--primary-color)" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <p>No data available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BarPlot;