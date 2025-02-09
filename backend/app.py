from flask import Flask, request, jsonify, render_template, flash, redirect, url_for
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
import joblib
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Load the pre-trained model and get expected features
MODEL_PATH = r'D:\To\vs\python\money-laundering-detection\backend\xgboost_model.pkl'
model = None
EXPECTED_FEATURES = []

try:
    model = joblib.load(MODEL_PATH)
    EXPECTED_FEATURES = model.get_booster().feature_names
    print(f"Expected features: {EXPECTED_FEATURES}")
except Exception as e:
    print(f"Error loading model: {e}")

UPLOAD_FOLDER = 'uploads'
PREDICTIONS_FOLDER = 'predictions'
ALLOWED_EXTENSIONS = {'csv'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PREDICTIONS_FOLDER'] = PREDICTIONS_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_csv_structure(df):
    required_columns = ['Time', 'Payment_currency', 'Payment_type', 'Amount', 
                       'Sender_account', 'Receiver_account', 'Received_currency',
                       'Sender_bank_location', 'Receiver_bank_location']
    missing_columns = set(required_columns) - set(df.columns)
    if missing_columns:
        raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")
    
    # Validate data types and values
    if not all(df['Payment_currency'].isin(['USD', 'EUR', 'GBP'])):
        raise ValueError("Payment_currency must be one of: USD, EUR, GBP")
    
    if not all(df['Payment_type'].isin(['WIRE', 'SWIFT', 'SEPA', 'Bank Transfer'])):
        raise ValueError("Payment_type must be one of: WIRE, SWIFT, SEPA, Bank Transfer")

def preprocess_data(df):
    try:
        processed_df = df.copy()

        processed_df["Time"] = pd.to_datetime(processed_df["Time"], format="%H:%M:%S", errors="coerce")
        processed_df["Time"] = processed_df["Time"].dt.hour * 3600 + processed_df["Time"].dt.minute * 60 + processed_df["Time"].dt.second

        processed_df['Sender_account'] = processed_df['Sender_account'].astype(int)
        processed_df['Receiver_account'] = processed_df['Receiver_account'].astype(int)

        processed_df['Amount'] = pd.to_numeric(processed_df['Amount'])

        categorical_columns = ["Payment_currency", "Received_currency", 
                             "Sender_bank_location", "Receiver_bank_location", 
                             "Payment_type"]
        
        for col in categorical_columns:
            if col in processed_df.columns:
                le = LabelEncoder()
                processed_df[col] = le.fit_transform(processed_df[col].astype(str))

        missing_features = [col for col in EXPECTED_FEATURES if col not in processed_df.columns]
        if missing_features:
            raise ValueError(f"Missing features: {', '.join(missing_features)}")

        return processed_df[EXPECTED_FEATURES]
    
    except Exception as e:
        raise ValueError(f"Error in preprocessing: {str(e)}")

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Please upload a CSV file'}), 400

    if file.content_length > MAX_FILE_SIZE:
        return jsonify({'error': 'File size exceeds the maximum limit of 10MB'}), 400

    try:
        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(temp_path)

        df = pd.read_csv(temp_path)
        
        processed_df = preprocess_data(df)
        
        predictions = model.predict(processed_df)
        probabilities = model.predict_proba(processed_df)[:, 1]

        results = []
        for i, (_, row) in enumerate(df.iterrows()):
            results.append({
                'Sender_account': row.get('Sender_account', ''),
                'Receiver_account': row.get('Receiver_account', ''),
                'Amount': float(row['Amount']),
                'Payment_currency': row['Payment_currency'],
                'Payment_type': row['Payment_type'],
                'Time': row['Time'],
                'Is_laundering': 'YES' if predictions[i] == 1 else 'NO',
                'Laundering_probability': round(float(probabilities[i]) * 100, 2)
            })

        output_df = pd.DataFrame(results)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_filename = f'prediction_{timestamp}.csv'
        output_path = os.path.join(app.config['PREDICTIONS_FOLDER'], output_filename)
        output_df.to_csv(output_path, index=False)

        os.remove(temp_path)

        return jsonify({
            'predictions': results,
            'summary': {
                'total_transactions': len(results),
                'flagged_transactions': sum(1 for r in results if r['Is_laundering'] == 'YES'),
                'average_probability': round(float(np.mean(probabilities)) * 100, 2)
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Update paths to be relative to the script location
    base_dir = os.path.dirname(__file__)
    app.config['UPLOAD_FOLDER'] = os.path.join(base_dir, UPLOAD_FOLDER)
    app.config['PREDICTIONS_FOLDER'] = os.path.join(base_dir, PREDICTIONS_FOLDER)
    
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['PREDICTIONS_FOLDER'], exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5000)

