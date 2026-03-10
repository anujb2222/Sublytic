import axios from 'axios';

const API_URL = 'http://localhost:5000/api/subscriptions';

export const getSubscriptions = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(API_URL, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};

export const saveSubscription = async (subscription, isEdit = false) => {
  const token = localStorage.getItem('token');
  const url = isEdit ? `${API_URL}/${subscription.id}` : API_URL;
  const method = isEdit ? 'put' : 'post';

  try {
    const response = await axios[method](url, subscription, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return isEdit ? response.data : response.data;
  } catch (error) {
    console.error('Error saving subscription:', error);
    throw error;
  }
};

export const deleteSubscription = async (id) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
};