import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGithubRepos } from '../../actions/profile';

const ProfileGithub = ({ username, getGithubRepos, repos }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos, username]);
  return (
    repos &&
    repos.length > 0 && (
      <div className='profile-github'>
        <h2 className='text-primary my-1'>
          <i className='fab fa-github'></i> Github Repos
        </h2>
        {repos.map((repo) => (
          <div key={repo.id} className='repo bg-white p-1 my-1'>
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  target='blank'
                  rel='noopener  noreferer'
                >
                  {repo.name}
                </a>
              </h4>
              <p>{repo.desc}</p>
            </div>
            <div>
              <ul>
                <li className='badge badge-primary'>
                  Stars: {repo.stargazers_count}{' '}
                </li>
                <li className='badge badge-dark'>
                  Watcher: {repo.watchers_count}{' '}
                </li>
                <li className='badge badge-light'>
                  Forks: {repo.forks_count}{' '}
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    )
  );
};

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired,
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  repos: state.profile.repos,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
