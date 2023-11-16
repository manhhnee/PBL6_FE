import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { Flip, ToastContainer, toast } from 'react-toastify';

import Image from '~/components/Image';
import Button from '~/components/Button';
import styles from './Order.module.scss';
import axios from 'axios';
import { faX } from '@fortawesome/free-solid-svg-icons';
import GetToken from '~/Token/GetToken';

const cx = classNames.bind(styles);

function Order({ data, icon }) {
  if (!data) {
    return null;
  }

  const handleChangeStatus = async (id) => {
    await axios
      .put(
        `http://localhost:5000/api/order/changeStatus/${id}`,
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
  if (data.id_Status === 1) {
    iconComponent = <FontAwesomeIcon className={cx('icon')} icon={icon} spinPulse />;
    buttonComponent = (
      <Button onClick={() => handleChangeStatus(data.id)} className={cx('btn')} blue>
        Confirm
      </Button>
    );
  } else if (data.id_Status === 2) {
    iconComponent = <FontAwesomeIcon className={cx('icon')} icon={icon} bounce />;
    buttonComponent = (
      <Button onClick={() => handleChangeStatus(data.id)} className={cx('btn')} blue>
        Confirm
      </Button>
    );
  } else if (data.id_Status === 3) {
    iconComponent = <FontAwesomeIcon className={cx('icon')} icon={icon} beat />;
  } else if (data.id_Status === 4) {
    iconComponent = <FontAwesomeIcon className={cx('icon')} icon={faX} beat />;
  } else {
    iconComponent = null;
    buttonComponent = null;
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
    </div>
  );
}

export default Order;
