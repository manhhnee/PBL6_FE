import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Button from '~/components/Button';
import config from '~/config';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function Menu() {
  const [countPreparing, setCountPreparing] = useState();
  const [countDelivering, setCountDelivering] = useState();
  const [countSuccess, setCountSuccess] = useState();
  function getJwtFromCookie() {
    //lấy token được lưu trong cookie ra
    const name = 'token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return '';
  }
  useEffect(() => {
    const getApiOrderPreparing = async () => {
      const response = await axios.get('http://localhost:4000/api/order/All/status/2', {
        headers: {
          Authorization: `Bearer ${getJwtFromCookie()}`,
        },
      });
      setCountPreparing(response.data.result.length);
    };
    const getApiOrderDelivering = async () => {
      const response = await axios.get('http://localhost:4000/api/order/All/status/3', {
        headers: {
          Authorization: `Bearer ${getJwtFromCookie()}`,
        },
      });
      setCountDelivering(response.data.result.length);
    };
    const getApiOrderSuccess = async () => {
      const response = await axios.get('http://localhost:4000/api/order/All/status/4', {
        headers: {
          Authorization: `Bearer ${getJwtFromCookie()}`,
        },
      });
      setCountSuccess(response.data.result.length);
    };
    getApiOrderPreparing();
    getApiOrderDelivering();
    getApiOrderSuccess();
  }, []);
  return (
    <div className={cx('states')}>
      <Button
        className={cx('btn-state1')}
        leftIcon={<FontAwesomeIcon className={cx('icon')} icon={faRectangleList} />}
        to={config.routes.adminWaiting}
      >
        <span className={cx('number')}>{countPreparing}</span>
        <span className={cx('state')}>Order is preparing</span>
      </Button>
      <Button
        className={cx('btn-state2')}
        leftIcon={<FontAwesomeIcon className={cx('icon')} icon={faRectangleList} />}
        to={config.routes.adminDelivering}
      >
        <span className={cx('number')}>{countDelivering}</span>
        <span className={cx('state')}>Order is delivering</span>
      </Button>
      <Button
        className={cx('btn-state3')}
        leftIcon={<FontAwesomeIcon className={cx('icon')} icon={faRectangleList} />}
        to={config.routes.adminSuccess}
      >
        <span className={cx('number')}>{countSuccess}</span>
        <span className={cx('state')}>Order delivered successfully</span>
      </Button>
    </div>
  );
}

export default Menu;
