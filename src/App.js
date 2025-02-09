import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import PredictionTable from './components/PredictionTable';
import Charts from './components/Charts';

const App = () => {
    const [predictions, setPredictions] = useState([]);

    const handleUpload = (data) => {
        if (data.error) {
            alert(data.error);
        } else {
            setPredictions(data.predictions);
        }
    };

    return (
        <div>
            <h1>Money Laundering Detection System</h1>
            <FileUpload onUpload={handleUpload} />
            {predictions.length > 0 && (
                <>
                    <h2>Analysis Results</h2>
                    <Charts predictions={predictions} />
                    <PredictionTable predictions={predictions} />
                </>
            )}
        </div>
    );
};

export default App; 