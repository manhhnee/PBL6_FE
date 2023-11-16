import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faHouseChimney,
  faList,
  faRightFromBracket,
  faShoePrints,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

import Sidebar from '~/components/Sidebar/Sidebar';
import Button from '~/components/Button/Button';
import config from '~/config';
import GetToken from '~/Token/GetToken';
import styles from './Admin.module.scss';
import { faTypo3 } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);

function Admin({ children }) {
  const [infor, setInfor] = useState({});
  const [activeButton, setActiveButton] = useState(() => {
    const storageActive = localStorage.getItem('active');
    return storageActive ? parseInt(storageActive) : 1;
  });
  const handleClick = (buttonId) => {
    setActiveButton(buttonId);
    localStorage.setItem('active', buttonId);
  };

  function Logout() {
    document.cookie = 'token=; path=/';
    window.location.replace(config.routes.login);
    localStorage.setItem('Role', null);
  }

  useEffect(() => {
    fetch('http://localhost:4000/api/user/profile/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${GetToken()}`, // trả token về server để xử lí
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success === true) {
          setInfor(response.user);
        } else {
          alert(response.message);
          window.location.replace(config.routes.login);
        }
      });
  }, []);
  const currentDate = new Date();

  return (
    <div className={cx('wrapper')}>
      <Sidebar>
        <Button
          to={config.routes.adminPending}
          leftIcon={<FontAwesomeIcon className={cx('icon')} icon={faHouseChimney}></FontAwesomeIcon>}
          className={cx('btn', `${activeButton === 1 ? 'active' : ''}`)}
          onClick={() => handleClick(1)}
        >
          Home
        </Button>
        <Button
          to={config.routes.manageStaff}
          leftIcon={<FontAwesomeIcon className={cx('icon')} icon={faShoePrints}></FontAwesomeIcon>}
          className={cx('btn', `${activeButton === 2 ? 'active' : ''}`)}
          onClick={() => handleClick(2)}
        >
          Shoes manager
        </Button>
        <Button
          to={config.routes.manageSupplier}
          leftIcon={<FontAwesomeIcon className={cx('icon')} icon={faTypo3}></FontAwesomeIcon>}
          className={cx('btn', `${activeButton === 3 ? 'active' : ''}`)}
          onClick={() => handleClick(3)}
        >
          Brand management
        </Button>
        <Button
          to={config.routes.manageCategory}
          leftIcon={<FontAwesomeIcon className={cx('icon')} icon={faList}></FontAwesomeIcon>}
          className={cx('btn', `${activeButton === 4 ? 'active' : ''}`)}
          onClick={() => handleClick(4)}
        >
          Category management
        </Button>
        <Button
          to={config.routes.revenue}
          leftIcon={<FontAwesomeIcon className={cx('icon')} icon={faChartLine}></FontAwesomeIcon>}
          className={cx('btn', `${activeButton === 5 ? 'active' : ''}`)}
          onClick={() => handleClick(5)}
        >
          Revenue
        </Button>

        <Button
          onClick={Logout}
          leftIcon={<FontAwesomeIcon className={cx('icon')} icon={faRightFromBracket}></FontAwesomeIcon>}
          className={cx('btn')}
        >
          Log out
        </Button>
      </Sidebar>
      <div className={cx('container')}>
        <div className={cx('header')}>
          <span className={cx('date')}>
            Day {currentDate.getDate()} Month {currentDate.getMonth() + 1} Year {currentDate.getFullYear()}
          </span>
          <span className={cx('name')}>
            Hi, {infor.inforUser && infor.inforUser.firstname + ' ' + infor.inforUser.lastname}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

Admin.protoTypes = {
  children: PropTypes.node.isRequired,
};

export default Admin;
