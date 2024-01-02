import classNames from 'classnames/bind';
import axios from 'axios';
import { faBoxOpen, faCheckCircle, faSpinner, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

import Menu from '~/pages/Admin/Menu';
import Order from '~/components/Order';
import GetToken from '~/Token/GetToken';
import styles from './AdminPending.module.scss';

const cx = classNames.bind(styles);

function AdminPending() {
  const [orderList, setOrderList] = useState([]);
  const getIcon = (id) => {
    switch (id) {
      case 1:
        return faSpinner;
      case 2:
        return faBoxOpen;
      case 3:
        return faTruckFast;
      case 4:
        return faCheckCircle;
      default:
        return null;
    }
  };
  useEffect(() => {
    const getApiOrderList = async () => {
      const response = await axios.get('https://2hm-store.click/api/order/All/status/1', {
        headers: { Authorization: `Bearer ${GetToken()}` },
      });
      setOrderList(response.data.result);
    };
    getApiOrderList();
  }, []);

  return (
    <div className={cx('content')}>
      <Menu />
      <div className={cx('header-content')}>
        <span className={cx('title-content')}>Pending orders</span>
      </div>
      <div className={cx('order-list')}>
        {orderList &&
          orderList.map((order) => {
            return <Order data={order} icon={getIcon(order.id_status)}></Order>;
          })}
      </div>
    </div>
  );
}

export default AdminPending;
