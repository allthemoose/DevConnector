import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const CommentItem = ({ comment: { user, name, avatar, text, date } }) => {
  return (
    <Fragment>
      <div class='post bg-white p-1 my-1'>
        <div>
          <Link to={`/profile/${user}`}>
            <img className='round-img' src={avatar} alt='' />
            <h4>{name}</h4>{' '}
          </Link>
        </div>
        <div>
          <p className='my-1'>{text}</p>
          <p className='post-date'>
            Posted on <Moment format='YYYY-MM-DD'>{date}</Moment>
          </p>
        </div>
      </div>
    </Fragment>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default CommentItem;
