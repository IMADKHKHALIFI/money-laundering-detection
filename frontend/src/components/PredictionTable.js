const PredictionTable = ({ predictions }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Sender Account</th>
          <th>Receiver Account</th>
          <th>Amount</th>
          <th>Currency</th>
          <th>Is Laundering</th>
          <th>Probability (%)</th>
        </tr>
      </thead>
      <tbody>
        {predictions.map((prediction, index) => (
          <tr key={index}>
            <td>{prediction.Sender_account}</td>
            <td>{prediction.Receiver_account}</td>
            <td>{prediction.Amount}</td>
            <td>{prediction.Payment_currency}</td>
            <td>{prediction.Is_laundering}</td>
            <td>{prediction.Laundering_probability}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default PredictionTable

