import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { createPost } from '../../actions/post';
import PropTypes from 'prop-types';

const PostForm = ({ createPost, history }) => {
  const [text, setText] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    createPost({ text });
  };

  return (
    <Fragment>
      <div className='post-form'>
        <div className='bg-primary p'>
          <h3>Say Something...</h3>
        </div>
        <form className='form my-1' onSubmit={(e) => onSubmit(e)}>
          <textarea
            name='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
            cols='30'
            rows='5'
            placeholder='Create a post'
            required
          ></textarea>
          <input type='submit' className='btn btn-dark my-1' value='Submit' />
        </form>
      </div>
    </Fragment>
  );
};

PostForm.propTypes = {
  createPost: PropTypes.func.isRequired,
};

export default connect(null, { createPost })(PostForm);
