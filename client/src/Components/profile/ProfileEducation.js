import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({
  education: { feildofstudy, school, degree, from, current, to, description },
}) => (
  <div>
    <h3 className='text-dark'>{school}</h3>
    <p>
      <Moment format='YYYY-MM-DD'>{from}</Moment> -{' '}
      {!to ? 'Now' : <Moment format='YYYY-MM-DD'>{to}</Moment>}
    </p>
    <p>
      <strong>Degree: </strong>
      {degree}
    </p>
    <p>
      <strong>Feild of Study: </strong>
      {feildofstudy}
    </p>
    <p>
      {description && (
        <Fragment>
          <strong>Description: </strong>
          {description}
        </Fragment>
      )}
    </p>
  </div>
);

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired,
};

export default ProfileEducation;
