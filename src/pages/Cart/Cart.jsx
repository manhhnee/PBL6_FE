import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';
import { useSpring, animated } from 'react-spring';
import { Flip, ToastContainer, toast } from 'react-toastify';

import ItemCart from '~/components/ItemCart';
import Button from '~/components/Button';
import Popup from '~/components/Popup';
import PaypalAll from '~/components/PaypalAll';
import AutoComplete from '~/components/AutoComplete/AutoComplete';
import styles from './Cart.module.scss';
import GetToken from '~/Token/GetToken';
import InputForm from '~/components/InputForm';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Cart() {
  const [autocompleteInputValue, setAutocompleteInputValue] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [payload, setPayload] = useState({
    phoneNumber: '',
  });
  const [errorMessages, setErrorMessages] = useState({
    address: '',
  });
  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!autocompleteInputValue.trim()) {
      errors.address = 'Please enter your order address!';
      isValid = false;
    }

    if (!payload.phoneNumber.trim()) {
      errors.phoneNumber = 'Please enter your order phoneNumber!';
      isValid = false;
    }

    setErrorMessages(errors);

    return isValid;
  };
  const modalAnimation = useSpring({
    opacity: isModalOpen ? 1 : 0,
  });

  const handleItemSelect = (Item) => {
    const updatedOrderItems = orderItems.slice();

    const index = updatedOrderItems.findIndex((item) => item.id === Item.id);

    if (index !== -1) {
      updatedOrderItems.splice(index, 1);
    } else {
      updatedOrderItems.push(Item);
    }

    setOrderItems(updatedOrderItems);
  };

  const handleOrderAll = async (address, phoneNumber) => {
    if (orderItems.length === 0) {
      toast.error('Please select to pay');
    } else {
      if (!validateForm()) {
        return;
      } else {
        const orderItemsPayload = orderItems.map((item) => ({
          id_size_item: item.id,
          quantity: item.cart_item_infor.quantity,
          id_cartItem: item.cart_item_infor.id,
          price: item.Shoes.price,
        }));
        console.log(orderItemsPayload);

        await axios
          .post(
            'http://localhost:4000/api/order/create',
            {
              cartItems: orderItemsPayload,
              address: address,
              phoneNumber: phoneNumber,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${GetToken()}`,
              },
            },
          )
          .then((res) => {
            toast.success(res.data.message);
            window.location.reload();
          })
          .catch((e) => {
            toast.error(e.message);
          });
      }
    }
  };

  useEffect(() => {
    const fetchApiCarts = async () => {
      const response = await axios.get(`http://localhost:4000/api/cart/details`, {
        headers: {
          Authorization: `Bearer ${GetToken()}`,
        },
      });
      const cartsData = await response.data;
      setCartItems(cartsData.Cart.Cart_Items);
    };
    fetchApiCarts();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={cx('container')}>
      <ToastContainer
        position="top-right"
        autoClose={4000}
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
      {cartItems.length === 0 ? (
        <p className={cx('cart-item-null')}>There are no products in your shopping cart.</p>
      ) : (
        cartItems.map((cartItem) => {
          return (
            <ItemCart
              data={cartItem}
              onSelect={() => {
                handleItemSelect(cartItem);
              }}
              key={cartItem.id}
            />
          );
        })
      )}
      {cartItems.length > 0 && (
        <div className={cx('options')}>
          <Button className={cx('btn')} onClick={() => openModal()} primary>
            Payment
          </Button>
        </div>
      )}
      ,
      <Popup isOpen={isModalOpen} onRequestClose={() => closeModal()} width={String('500px')} height={'350px'}>
        <animated.div style={modalAnimation}>
          <h2>Payment confirmation</h2>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Enter address</div>
            <AutoComplete setParentInputValue={setAutocompleteInputValue} />
          </div>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Enter phone number</div>
            <InputForm
              placeholder={'Enter phone number'}
              type="text"
              value={payload.phoneNumber}
              setValue={setPayload}
              name={'phoneNumber'}
              className={cx('input')}
              leftIcon={faPhone}
            />
          </div>
          <div className={cx('options')}>
            <Button
              onClick={() => {
                handleOrderAll(autocompleteInputValue, payload.phoneNumber);
              }}
              outline
            >
              Confirm
            </Button>
          </div>
        </animated.div>
      </Popup>
    </div>
  );
}

export default Cart;
