import axios from 'axios';
import { setAlert } from './alert';

import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  CREATE_POST,
} from './types';

//Get Posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/post');
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

//Add Like
export const addLike = (post_id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/post/like/${post_id}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { post_id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

//removeLike
export const removeLike = (post_id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/post/unlike/${post_id}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { post_id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

//delete a post
export const deletePost = (post_id) => async (dispatch) => {
  try {
    await axios.delete(`/api/post/${post_id}`);
    dispatch({
      type: DELETE_POST,
      payload: post_id,
    });
    dispatch(setAlert('Post Removed', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

//create a post
export const createPost = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    const res = await axios.post(`/api/post/`, formData, config);
    dispatch({
      type: CREATE_POST,
      payload: res.data,
    });
    dispatch(setAlert('Post Created', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
