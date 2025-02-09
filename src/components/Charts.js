import React from 'react';
import { Bar } from 'react-chartjs-2';

const Charts = ({ predictions }) => {
    const data = {
        labels: predictions.map((pred, index) => `Transaction ${index + 1}`),
        datasets: [
            {
                label: 'Laundering Probability (%)',
                data: predictions.map(pred => pred.Laundering_probability),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return <Bar data={data} />;
};

export default Charts; 