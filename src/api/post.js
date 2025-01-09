// api.js
import axios from 'axios';
import { baseUrl } from './base';

const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: false,
});

export const toggleLikePost = async (postId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.post(`/posts/${postId}/like/`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to toggle like:', error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      throw new Error('Unauthorized');
    }
    throw error;
  }
};

export const createPost = async (text, media) => {
  const formData = new FormData();
  formData.append('text', text);
  if (media) {
    formData.append('image', media);
  }
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.post('/posts/create/', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      throw new Error('Unauthorized');
    }
    throw error;
  }
};

export const fetchPosts = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.get(`/posts/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      throw new Error('Unauthorized');
    }
    throw error;
  }
};

export const fetchComments = async (postId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.get(`/posts/${postId}/comments/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.comments;
  } catch (error) {
    console.error('Error creating post:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      throw new Error('Unauthorized');
    }
    throw error;
  }
};

export const submitNewComment = async (postId, text) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await apiClient.post(
      `/posts/${postId}/comment/`,
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      throw new Error('Unauthorized');
    }
    throw error;
  }
};

