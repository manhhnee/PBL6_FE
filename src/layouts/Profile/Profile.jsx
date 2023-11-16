import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUser } from '@fortawesome/free-regular-svg-icons';

import Sidebar from '~/components/Sidebar';
import Button from '~/components/Button';
import styles from './Profile.module.scss';
import config from '~/config';

const cx = classNames.bind(styles);

function Profile({ children }) {
  const [activeButton, setActiveButton] = useState(() => {
    const storageActive = localStorage.getItem('active');
    return storageActive ? parseInt(storageActive) : 1;
  });
  const handleClick = (buttonId) => {
    setActiveButton(buttonId);
    localStorage.setItem('active', buttonId);
  };

  return (
    <div className={cx('wrapper')}>
      <Sidebar>
        <Button
          to={config.routes.information}
          leftIcon={<FontAwesomeIcon icon={faUser}></FontAwesomeIcon>}
          className={cx('btn', `${activeButton === 1 ? 'active' : ''}`)}
          onClick={() => handleClick(1)}
        >
          Personal page
        </Button>
        <Button
          to={config.routes.history}
          leftIcon={<FontAwesomeIcon icon={faClock}></FontAwesomeIcon>}
          className={cx('btn', `${activeButton === 2 ? 'active' : ''}`)}
          onClick={() => handleClick(2)}
        >
          Order history
        </Button>
      </Sidebar>
      {children}
    </div>
  );
}

export default Profile;
