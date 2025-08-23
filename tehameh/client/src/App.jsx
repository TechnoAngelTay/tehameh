import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import axios from 'axios';
import viteLogo from '/vite.svg'
import './App.css'





function App() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/'); // Replace with your backend URL and endpoint
                setData(response.data);
            } catch (err) {
                setError(err);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures it runs once on component mount

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Data from Backend:</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

export default App
