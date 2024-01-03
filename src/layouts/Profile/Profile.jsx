import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUser } from '@fortawesome/free-regular-svg-icons';

import styles from './Profile.module.scss';
import config from '~/config';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Profile({ children }) {
  const [activeIndex, setActiveIndex] = useState(() => {
    return parseInt(localStorage.getItem('activeIndex')) || 0;
  });

  const handleSetActive = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    localStorage.setItem('activeIndex', activeIndex.toString());
  }, [activeIndex]);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('sidebar')}>
        <ul className={cx('side-menu', 'top')}>
          <li
            className={cx({ active: activeIndex === 0 })}
            onClick={() => window.location.replace(config.routes.information)}
          >
            <Link to="" onClick={() => handleSetActive(0)}>
              <FontAwesomeIcon className={cx('bx')} icon={faUser}></FontAwesomeIcon>
              <span className={cx('text')}>Personal Page</span>
            </Link>
          </li>
          <li
            className={cx({ active: activeIndex === 1 })}
            onClick={() => window.location.replace(config.routes.history)}
          >
            <Link to="" onClick={() => handleSetActive(1)}>
              <FontAwesomeIcon className={cx('bx')} icon={faClock}></FontAwesomeIcon>
              <span className={cx('text')}>Order history</span>
            </Link>
          </li>
        </ul>
      </div>
      {children}
    </div>
  );
}

export default Profile;
