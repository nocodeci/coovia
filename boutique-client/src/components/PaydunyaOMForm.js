import React, { useState } from 'react';
import axios from 'axios';

const PaydunyaOMForm = () => {
  // Les données client et le token de facture viendraient probablement des props ou d'un contexte global.
  // Pour cet exemple, nous les codons en dur.
  const customerInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    paymentToken: 'VOTRE_TOKEN_DE_FACTURE_ICI' // IMPORTANT: à rendre dynamique
  };

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const laravelApiUrl = `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/process-paydunya-payment`;

      const response = await axios.post(laravelApiUrl, {
        phone_number: phone,
        otp: otp,
        payment_token: customerInfo.paymentToken,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email
      });

      if (response.data.success) {
        setStatus('success');
        setMessage(response.data.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Une erreur critique est survenue.');
    }
  };

  if (status === 'success') {
    return (
      <div className="payment-success">
        <h3>Paiement Réussi !</h3>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="paydunya-form-container">
      <form onSubmit={handleSubmit}>
        <h3>Paiement par Orange Money (CI)</h3>
        <p>Veuillez composer le #144*82# pour obtenir votre code de paiement.</p>

        <div className="form-group">
          <label htmlFor="phone">Numéro de téléphone Orange</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07xxxxxxxx"
            required
            disabled={status === 'loading'}
          />
        </div>

        <div className="form-group">
          <label htmlFor="otp">Code OTP de paiement</label>
          <input
            id="otp"
            type="text"
            pattern="\d*"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Code à 4 chiffres"
            required
            disabled={status === 'loading'}
          />
        </div>

        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Validation en cours...' : 'Payer'}
        </button>

        {status === 'error' && <p className="error-message">{message}</p>}
      </form>
    </div>
  );
};

export default PaydunyaOMForm; 