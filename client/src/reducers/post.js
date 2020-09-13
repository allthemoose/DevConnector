import { GET_POST, CREATE_POST, DELETE_POST } from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_POST:
      return {};
    default:
      return { ...state };
  }
}
