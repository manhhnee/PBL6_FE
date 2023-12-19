import classNames from 'classnames/bind';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flip, ToastContainer, toast } from 'react-toastify';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import GetToken from '~/Token/GetToken';
import Image from '~/components/Image';
import Button from '~/components/Button';
import Popup from '../Popup';
import styles from './Order.module.scss';

const cx = classNames.bind(styles);

function Order({ data, icon }) {
  const [orderList, setOrderList] = useState({});
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const modalAnimation1 = useSpring({
    opacity: isModalOpen1 ? 1 : 0,
  });

  if (!data) {
    return null;
  }

  const openModal1 = async (id) => {
    setIsModalOpen1(true);
    const response = await axios.get(`http://localhost:4000/api/order/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GetToken()}`,
      },
    });
    setOrderList(response.data.result.Order_items);
  };

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };

  const handleChangeStatus = async (id) => {
    await axios
      .put(
        `http://localhost:4000/api/order/updateStatus/${id}`,
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
      .catch((e) => {
        toast.success(e);
      });
  };

  const orderDate = data.OrderDate;
  const formattedDate = moment(orderDate).format('YYYY-MM-DD');

  let iconComponent;
  let buttonComponent;
  if (data.id_status === 1) {
    iconComponent = <FontAwesomeIcon className={cx('icon')} icon={icon} spinPulse />;
    buttonComponent = (
      <div>
        <Button
          onClick={() => {
            openModal1(data.id);
          }}
          className={cx('btn')}
          outline
        >
          Get Detail
        </Button>
        <Button onClick={() => handleChangeStatus(data.id)} className={cx('btn')} blue>
          Confirm
        </Button>
      </div>
    );
  } else if (data.id_status === 2) {
    iconComponent = <FontAwesomeIcon className={cx('icon')} icon={icon} bounce />;
    buttonComponent = (
      <div>
        <Button
          onClick={() => {
            openModal1(data.id);
          }}
          className={cx('btn')}
          outline
        >
          Get Detail
        </Button>
        <Button onClick={() => handleChangeStatus(data.id)} className={cx('btn')} blue>
          Confirm
        </Button>
      </div>
    );
  } else if (data.id_status === 3) {
    iconComponent = <FontAwesomeIcon className={cx('icon')} icon={icon} bounce />;
    buttonComponent = (
      <Button onClick={() => handleChangeStatus(data.id)} className={cx('btn')} blue>
        Confirm
      </Button>
    );
  } else if (data.id_status === 4) {
    iconComponent = <FontAwesomeIcon className={cx('icon')} icon={faCheckCircle} beat />;
  }

  function formatCurrency(number) {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
    return formatter.format(number);
  }

  return (
    <div className={cx('order')}>
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
      <Image className={cx('order-image')} src={data.Account.inforUser.avatar} alt="avatar"></Image>
      {iconComponent}

      <div className={cx('name-order')}>{data.Account.inforUser.firstname + ' ' + data.Account.inforUser.lastname}</div>

      <div className={cx('day-order')}>{formattedDate}</div>
      <div className={cx('address')}>{data.order_address}</div>
      <div className={cx('price-order')}>{data.totalPrice && formatCurrency(data.totalPrice)}</div>
      {buttonComponent}
      <Popup isOpen={isModalOpen1} onRequestClose={() => closeModal1()} width={'700px'} height={'500px'}>
        <animated.div style={modalAnimation1}>
          <h2>Detail information</h2>
          {orderList.length > 0 &&
            orderList.map((orderItem) => {
              return (
                <div className={cx('information')}>
                  <Image alt="Image" className={cx('order-image')} src={orderItem.Shoes.image}></Image>
                  <span>Name: {orderItem.Shoes.name}</span>
                  <span>{formatCurrency(orderItem.Shoes.price)}</span>
                  <span> Amount: {orderItem.order_item_infor.quantity}</span>
                </div>
              );
            })}
        </animated.div>
      </Popup>
    </div>
  );
}

export default Order;
