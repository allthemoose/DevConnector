import { GET_POSTS, CREATE_POST, POST_ERROR } from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case CREATE_POST:
    case POST_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    default:
      return { ...state };
  }
}
