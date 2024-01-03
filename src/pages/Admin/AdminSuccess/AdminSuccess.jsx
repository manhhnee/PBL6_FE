import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import styles from './AdminSuccess.module.scss';
import GetToken from '~/Token/GetToken';

const cx = classNames.bind(styles);

const Order = React.lazy(() => import('~/components/Order'));
const Menu = React.lazy(() => import('~/pages/Admin/Menu'));

function AdminSuccess() {
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const getApiOrderPending = async () => {
      const response = await axios.get('https://2hm-store.click/api/order/All/status/4', {
        headers: { Authorization: `Bearer ${GetToken()}` },
      });
      setOrderList(response.data.result);
    };
    getApiOrderPending();
  }, []);
  return (
    <div className={cx('content')}>
      <Menu />
      <div className={cx('header-content')}>
        <span className={cx('title-content')}>Order delivered successfully</span>
      </div>
      <div className={cx('order-list')}>
        {orderList.map((order) => {
          return <Order key={order.id} data={order} icon={faCheckCircle}></Order>;
        })}
      </div>
    </div>
  );
}

export default AdminSuccess;
