import React from 'react';
import PropTypes from 'prop-types';

const ProfileTop = ({ profile: { company, location } }) => {
  return (
    <div className='profile-top bg-primary p-2'>
      <img
        className='round-img my-1'
        src='https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
        alt=''
      />
      <h1 className='large'>John Doe</h1>
      <p className='lead'>Developer at Microsoft</p>
      <p>Seattle, WA</p>
      <div className='icons my-1'>
        <a href='#' target='_blank' rel='noopener noreferrer'>
          <i className='fas fa-globe fa-2x'></i>
        </a>
        <a href='#' target='_blank' rel='noopener noreferrer'>
          <i className='fab fa-twitter fa-2x'></i>
        </a>
        <a href='#' target='_blank' rel='noopener noreferrer'>
          <i className='fab fa-facebook fa-2x'></i>
        </a>
        <a href='#' target='_blank' rel='noopener noreferrer'>
          <i className='fab fa-linkedin fa-2x'></i>
        </a>
        <a href='#' target='_blank' rel='noopener noreferrer'>
          <i className='fab fa-youtube fa-2x'></i>
        </a>
        <a href='#' target='_blank' rel='noopener noreferrer'>
          <i className='fab fa-instagram fa-2x'></i>
        </a>
      </div>
    </div>
  );
};

ProfileTop.propTypes = {};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default ProfileTop;
