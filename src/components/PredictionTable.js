import React from 'react';

const PredictionTable = ({ predictions }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Sender Account</th>
                    <th>Receiver Account</th>
                    <th>Amount</th>
                    <th>Payment Currency</th>
                    <th>Payment Type</th>
                    <th>Time</th>
                    <th>Is Laundering</th>
                    <th>Probability</th>
                </tr>
            </thead>
            <tbody>
                {predictions.map((pred, index) => (
                    <tr key={index}>
                        <td>{pred.Sender_account}</td>
                        <td>{pred.Receiver_account}</td>
                        <td>{pred.Amount}</td>
                        <td>{pred.Payment_currency}</td>
                        <td>{pred.Payment_type}</td>
                        <td>{pred.Time}</td>
                        <td>{pred.Is_laundering}</td>
                        <td>{pred.Laundering_probability}%</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PredictionTable; 