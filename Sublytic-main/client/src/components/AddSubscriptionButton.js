import React from 'react';
import './AddSubscriptionButton.css';

function AddSubscriptionButton({ onClick }) {
  return (
    <button className="add-subscription-btn" onClick={onClick}>
      + Add Subscription
    </button>
  );
}

export default AddSubscriptionButton;
