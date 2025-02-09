import React, { useState } from 'react';

const FileUpload = ({ onUpload }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/api/predict', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            onUpload(data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} accept=".csv" required />
            <button type="submit">Analyze Transactions</button>
        </form>
    );
};

export default FileUpload; 