import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { Flip, ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

import Image from '~/components/Image';
import Button from '~/components/Button';
import GetToken from '~/Token/GetToken';
import styles from './ItemCart.module.scss';

const cx = classNames.bind(styles);

function BookItemCart({ data, onSelect }) {
  console.log(data);
  const [isChecked, setIsChecked] = useState(false);

  const handleDeleteCart = async () => {
    await axios
      .delete(`http://localhost:4000/api/cart/delete/${data.id}`, {
        headers: { Authorization: `Bearer ${GetToken()}` },
      })
      .then((response) => {
        toast.success(response.data.message);

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((err) => {
        alert('Something went wrong', err);
      });
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    onSelect(data, !isChecked);
  };

  function formatCurrency(number) {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
    return formatter.format(number);
  }

  return (
    <div className={cx('wrapper')}>
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
      <div className={cx('content-left')}>
        <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} className={cx('checkbox')} />
        <Image
          className={cx('img')}
          src="https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b26aa8f-0173-409b-b30a-7ce2d88573a4/custom-nike-dunk-low-by-you.png"
        ></Image>
      </div>
      <div className={cx('content-center')}>
        <span className={cx('book-name')}>{data.name}</span>
        <span className={cx('book-category')}>Color: {data.color}</span>
        <span className={cx('book-price')}>{data.Price && formatCurrency(data.Price)}</span>
        <span className={cx('book-quantity')}>x{data.cart_item_infor.quantity}</span>
      </div>
      <div className={cx('content-right')}>
        <div className={cx('options')}>
          <Button onClick={() => handleDeleteCart()} outline className={cx('btn')}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

BookItemCart.protoTypes = {
  data: PropTypes.node.isRequired,
  onSelect: PropTypes.func,
};

export default BookItemCart;
