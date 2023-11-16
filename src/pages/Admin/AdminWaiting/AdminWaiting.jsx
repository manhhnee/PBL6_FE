import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import Menu from '~/pages/Admin/Menu';
import Order from '~/components/Order';
import styles from './AdminWaiting.module.scss';
import GetToken from '~/Token/GetToken';

const cx = classNames.bind(styles);

function AdminWaiting() {
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const getApiOrderPending = async () => {
      const response = await axios.get('http://localhost:4000/api/order/All/status/2', {
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
        <span className={cx('title-content')}>Order is preparing</span>
      </div>
      <div className={cx('order-list')}>
        {orderList.map((order) => {
          return <Order key={order.id} data={order} icon={faSpinner}></Order>;
        })}
      </div>
    </div>
  );
}

export default AdminWaiting;
