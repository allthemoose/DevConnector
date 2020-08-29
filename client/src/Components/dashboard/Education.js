import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const Education = ({ education }) => {
  const educations = education.map((edu) => {
    <td key={edu._id}>
      <td key={edu.school}></td>
      <td key={edu.degree}></td>
      <td>
        <Moment format='YYYY/MM/DD'>{edu.from}</Moment> -{' '}
        {edu.to === null ? 'Now' : <Moment format='YYY/MM/DD'>{edu.to}</Moment>}
      </td>
      <td>
        <button className='btn btn-danger'>Delete</button>
      </td>
    </td>;
  });

  return (
    <Fragment>
      <h2 className='my-2'>Education Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>School</th>
            <th className='hide-sm'>Degree</th>
            <th className='hide-sm'>Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  Education: PropTypes.object.isRequired,
};

export default Education;
