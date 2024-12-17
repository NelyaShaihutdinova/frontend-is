import { useState, useEffect } from 'react';

const ImportPage = () => {
    const [file, setFile] = useState(null);
    const [history, setHistory] = useState([]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file!");

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/import/upload', {
                method: 'POST',
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });
            if (response.ok) {
                alert('File uploaded successfully');
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchHistory = async () => {
        const response = await fetch('http://localhost:8080/is-lab1-backend-1.0-SNAPSHOT/api/import/history',  {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        const data = await response.json();
        setHistory(data);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div>
            <h1>Import Objects</h1>
            <input type="file" accept=".json" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>

            <h2>Import History</h2>
            <button onClick={fetchHistory}>Show History</button>
            <ul>
                {history.map((record) => (
                    <li key={record.id}>
                        ID: {record.id}, Time: {record.importTime}, Status: {record.status}, User: {record.username}, Count: {record.numberOfImportedRecords}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ImportPage;