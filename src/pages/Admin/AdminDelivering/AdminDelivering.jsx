import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { faTruckFast } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import Order from '~/components/Order';
import Menu from '~/pages/Admin/Menu';
import styles from './AdminDelivering.module.scss';
import GetToken from '~/Token/GetToken';

const cx = classNames.bind(styles);

function AdminDelivering() {
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    const getApiOrderPending = async () => {
      const response = await axios.get('http://localhost:4000/api/order/All/status/3', {
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
        <span className={cx('title-content')}>Order is shipping</span>
      </div>
      <div className={cx('order-list')}>
        {orderList.map((order) => {
          return <Order key={order.id} data={order} icon={faTruckFast}></Order>;
        })}
      </div>
    </div>
  );
}

export default AdminDelivering;
