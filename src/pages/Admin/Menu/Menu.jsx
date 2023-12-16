import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleList } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Button from '~/components/Button';
import config from '~/config';
import styles from './Menu.module.scss';
import { faFaceAngry } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Menu() {
  const [countPending, setCountPending] = useState();
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
    const getApiOrderPending = async () => {
      const response = await axios.get('http://54.164.6.175:4000/api/order/All/status/1', {
        headers: {
          Authorization: `Bearer ${getJwtFromCookie()}`,
        },
      });
      setCountPending(response.data.result.length);
    };
    const getApiOrderPreparing = async () => {
      const response = await axios.get('http://54.164.6.175:4000/api/order/All/status/2', {
        headers: {
          Authorization: `Bearer ${getJwtFromCookie()}`,
        },
      });
      setCountPreparing(response.data.result.length);
    };
    const getApiOrderDelivering = async () => {
      const response = await axios.get('http://54.164.6.175:4000/api/order/All/status/3', {
        headers: {
          Authorization: `Bearer ${getJwtFromCookie()}`,
        },
      });
      setCountDelivering(response.data.result.length);
    };
    const getApiOrderSuccess = async () => {
      const response = await axios.get('http://54.164.6.175:4000/api/order/All/status/4', {
        headers: {
          Authorization: `Bearer ${getJwtFromCookie()}`,
        },
      });
      setCountSuccess(response.data.result.length);
    };
    getApiOrderPending();
    getApiOrderPreparing();
    getApiOrderDelivering();
    getApiOrderSuccess();
  }, []);
  return (
    <ul className={cx('box-info')}>
      <li onClick={() => window.location.replace(config.routes.adminPending)}>
        <FontAwesomeIcon className={cx('bx')} icon={faRectangleList}></FontAwesomeIcon>
        <span className={cx('text')}>
          <h3>{countPending}</h3>
          <p>Order is pending</p>
        </span>
      </li>
      <li onClick={() => window.location.replace(config.routes.adminWaiting)}>
        <FontAwesomeIcon className={cx('bx')} icon={faRectangleList}></FontAwesomeIcon>
        <span className={cx('text')}>
          <h3>{countPreparing}</h3>
          <p>Order is prepared</p>
        </span>
      </li>
      <li onClick={() => window.location.replace(config.routes.adminDelivering)}>
        <FontAwesomeIcon className={cx('bx')} icon={faRectangleList}></FontAwesomeIcon>
        <span className={cx('text')}>
          <h3>{countDelivering}</h3>
          <p>Order is delivered</p>
        </span>
      </li>
      <li onClick={() => window.location.replace(config.routes.adminSuccess)}>
        <FontAwesomeIcon className={cx('bx')} icon={faRectangleList}></FontAwesomeIcon>
        <span className={cx('text')}>
          <h3>{countSuccess}</h3>
          <p>Order delivered successfully</p>
        </span>
      </li>
    </ul>
  );
}

export default Menu;
