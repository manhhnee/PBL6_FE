import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { useEffect, useState } from 'react';

import Sidebar from '~/components/Sidebar/Sidebar';
import config from '~/config';
import GetToken from '~/Token/GetToken';
import styles from './Admin.module.scss';

const cx = classNames.bind(styles);

function Admin({ children }) {
  const [infor, setInfor] = useState({});

  useEffect(() => {
    fetch('https://2hm-store.click/api/user/profile/me', {
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
      <Sidebar></Sidebar>
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
