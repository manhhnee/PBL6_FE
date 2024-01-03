import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import styles from './AdminWaiting.module.scss';
import GetToken from '~/Token/GetToken';

const cx = classNames.bind(styles);

const Order = React.lazy(() => import('~/components/Order'));
const Menu = React.lazy(() => import('~/pages/Admin/Menu'));

function AdminWaiting() {
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const getApiOrderPending = async () => {
      const response = await axios.get('https://2hm-store.click/api/order/All/status/2', {
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
        <span className={cx('title-content')}>Order is prepared</span>
      </div>
      <div className={cx('order-list')}>
        {orderList.map((order) => {
          return <Order key={order.id} data={order} icon={faBoxOpen}></Order>;
        })}
      </div>
    </div>
  );
}

export default AdminWaiting;
