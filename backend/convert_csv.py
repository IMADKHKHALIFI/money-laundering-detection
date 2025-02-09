import pandas as pd

def convert_csv(input_file, output_file):
    # Read the original CSV
    df = pd.read_csv(input_file)
    
    # If any required columns are missing, add them with default values
    required_columns = ['Time', 'Payment_currency', 'Payment_type', 'Amount',
                       'Sender_account', 'Receiver_account', 'Received_currency',
                       'Sender_bank_location', 'Receiver_bank_location']
    
    for col in required_columns:
        if col not in df.columns:
            if col == 'Received_currency':
                df[col] = df['Payment_currency']  # Copy from Payment_currency
            elif col.endswith('_account'):
                df[col] = [f'ACC{i:03d}' for i in range(len(df))]  # Generate account numbers
            elif col.endswith('_location'):
                df[col] = 'Unknown'  # Default location
            else:
                df[col] = None  # Default value for other columns
    
    # Extract time from datetime if needed
    if 'Date' in df.columns:
        df['Time'] = pd.to_datetime(df['Time']).dt.strftime('%H:%M:%S')
    
    # Map currencies to accepted values
    currency_map = {
        'USD': 'USD',
        'EUR': 'EUR',
        'GBP': 'GBP'
    }
    
    # Map payment types to accepted values
    payment_type_map = {
        'Bank Transfer': 'Bank Transfer',
        'Wire Transfer': 'WIRE',
        'SWIFT': 'SWIFT',
        'SEPA': 'SEPA'
    }
    
    # Apply mappings
    df['Payment_currency'] = df['Payment_currency'].map(currency_map)
    df['Payment_type'] = df['Payment_type'].map(payment_type_map)
    df['Received_currency'] = df['Received_currency'].map(currency_map)
    
    # Reorder columns
    converted_df = df[required_columns]
    
    # Save the converted CSV
    converted_df.to_csv(output_file, index=False)
    print(f"Converted CSV saved to {output_file}")
    return converted_df

if __name__ == "__main__":
    input_file = "transaction.csv"
    output_file = "converted_transaction.csv"
    
    try:
        converted_df = convert_csv(input_file, output_file)
        print("\nFirst few rows of converted data:")
        print(converted_df.head())
    except Exception as e:
        print(f"Error converting CSV: {str(e)}") 