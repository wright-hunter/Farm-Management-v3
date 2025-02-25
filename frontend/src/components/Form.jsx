import { useEffect, useState } from 'react'
import axios from 'axios'

export const Form = ( {api} ) => {
    const [data, setData] = useState([])
    
    useEffect(() => {
        axios.get(api) // Pass down the API URL as a prop to get correct field
            .then(response => {
                setData(response.data)
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }, [])

    return (
        <div>Form</div>
    )
}

export default Form;