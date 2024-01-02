import classNames from 'classnames/bind';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faSpinner, faTruckFast, faX } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import moment from 'moment';
import { Flip, ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';

import GetToken from '~/Token/GetToken';
import Profile from '~/layouts/Profile';
import Button from '~/components/Button/Button';
import config from '~/config';
import styles from './History.module.scss';

const cx = classNames.bind(styles);

function History() {
  const [historyOrder, setHistoryOrder] = useState([]);

  useEffect(() => {
    const getApiHistoryOrder = async () => {
      const response = await axios.get('https://2hm-store.click/api/order/history', {
        headers: {
          Authorization: `Bearer ${GetToken()}`,
        },
      });
      setHistoryOrder(response.data.result);
    };
    getApiHistoryOrder();
  }, []);

  console.log(historyOrder);

  const handleCancelOrder = async (id) => {
    await axios
      .put(
        `https://2hm-store.click/api/order/cancel/${id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GetToken()}`,
          },
        },
      )
      .then((res) => {
        toast.success(res.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  function formatCurrency(number) {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
    return formatter.format(number);
  }

  return (
    <Profile>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        transition={Flip}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className={cx('container')}>
        <span className={cx('header')}>Order history</span>
        {historyOrder &&
          historyOrder.map((order) => {
            let iconComponent;
            let statusComponent;
            let btnComponent;
            if (order.Status.status === 'đang chờ') {
              iconComponent = <FontAwesomeIcon icon={faSpinner} className={cx('icon')} spinPulse></FontAwesomeIcon>;
              statusComponent = <span className={cx('status-name')}>Order is pending</span>;
              btnComponent = (
                <Button
                  onClick={() => {
                    handleCancelOrder(order.id);
                  }}
                  primary
                  className={cx('btn')}
                >
                  Cancel order
                </Button>
              );
            } else if (order.Status.status === 'đang chuẩn bị') {
              iconComponent = <FontAwesomeIcon icon={faCheckCircle} className={cx('icon')} beat></FontAwesomeIcon>;
              statusComponent = <span className={cx('status-name')}>The order is being prepared</span>;
            } else if (order.Status.status === 'đang giao') {
              iconComponent = <FontAwesomeIcon icon={faTruckFast} className={cx('icon')} bounce></FontAwesomeIcon>;
              statusComponent = <span className={cx('status-name')}>The order is being delivering</span>;
            } else if (order.Status.status === 'giao thành công') {
              iconComponent = <FontAwesomeIcon icon={faCircleCheck} className={cx('icon')} beatFade></FontAwesomeIcon>;
              statusComponent = <span className={cx('status-name1')}>The order has been successfully</span>;
            } else if (order.Status.status === 'đã hủy') {
              iconComponent = <FontAwesomeIcon icon={faX} className={cx('icon1')} beatFade></FontAwesomeIcon>;
              statusComponent = <span className={cx('status-name1')}>The order has been cancelled</span>;
            }
            if (!order) {
              return null;
            }
            const orderDate = order.OrderDate;
            const formattedDate = moment(orderDate).format('DD-MM-YYYY');
            return (
              <div className={cx('wrapper')}>
                <div className={cx('content-center')}>
                  <span className={cx('book-price')}>{order.totalPrice && formatCurrency(order.totalPrice)}</span>
                  <span className={cx('book-date')}>Order date: {formattedDate}</span>
                  <span className={cx('book-address')}>Delivery address: {order.order_address}</span>
                  <span className={cx('book-paymethod')}>Order phone number: {order.order_phoneNumber}</span>
                </div>
                <div className={cx('content-right')}>
                  <div className={cx('status')}>
                    {order && iconComponent}
                    {order && statusComponent}
                  </div>
                  <div className={cx('options')}>
                    {order && btnComponent}
                    <Button to={`${config.routes.historydetails}?id=${order.id}`} white className={cx('btn')}>
                      View order details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Profile>
  );
}

export default History;
