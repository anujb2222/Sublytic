import React from 'react';
import { Modal } from 'antd';
import SubscriptionForm from '../subscriptions/forms/SubscriptionForm';
import { saveSubscription } from '../../services/subscriptionService';
import { notification } from 'antd';

function SubscriptionModal({ open, onClose, initialData, onSuccess }) {
  const isEdit = !!initialData;

  const handleSave = async (values) => {
    try {
      const subToSave = { ...initialData, ...values };
      await saveSubscription(subToSave, isEdit);
      notification.success({ message: `Subscription ${isEdit ? 'updated' : 'added'}!` });
      onSuccess(); // This will re-fetch the data on the homepage
      onClose();
    } catch (error) {
      notification.error({ message: 'Save Failed', description: error.message });
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Subscription' : 'Add New Subscription'}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <SubscriptionForm
        onSave={handleSave}
        onClose={onClose}
        initialData={initialData}
      />
    </Modal>
  );
}

export default SubscriptionModal;