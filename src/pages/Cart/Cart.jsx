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
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Mặc định là tiền mặt khi nhận hàng
  const [cartItems, setCartItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
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
      toast.error('Please select  to pay');
    } else {
      if (!validateForm()) {
        return;
      } else {
        const orderItemsPayload = orderItems.map((item) => ({
          id_shoes: item.id_shoes,
          quantity: item.quantity,
          id_cartItem: item.id_cartItem,
          price: item.price,
        }));

        await axios
          .post(
            'http://localhost:4000/api/order/create',
            {
              address: address,
              phoneNumber: phoneNumber,
              OrderItems: orderItemsPayload,
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
            alert(e);
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
      console.log(response.data);
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
      <Popup isOpen={isModalOpen} onRequestClose={() => closeModal()} width={String('500px')} height={String('400px')}>
        <animated.div style={modalAnimation}>
          <h2>Payment confirmation</h2>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Enter your address</div>
            <AutoComplete setParentInputValue={setAutocompleteInputValue} />
            {errorMessages.address && <div className={cx('error-message')}>{errorMessages.address}</div>}
          </div>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Enter your phone number</div>
            <InputForm
              placeholder=""
              type="text"
              value={payload.phoneNumber}
              setValue={setPayload}
              name={'phoneNumber'}
              className={cx('input')}
              leftIcon={faPhone}
            ></InputForm>
          </div>
          <div className={cx('options')}>
            <div className={cx('payment-methods')}>
              <label>
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={handlePaymentMethodChange}
                />
                Payment in cash upon receipt
              </label>
              <label>
                <input
                  type="radio"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={handlePaymentMethodChange}
                />
                Pay with PayPal
              </label>
            </div>
            {paymentMethod === 'cash' ? (
              <Button onClick={() => handleOrderAll(autocompleteInputValue, payload.phoneNumber)} outline>
                Confirm
              </Button>
            ) : (
              <PaypalAll address={autocompleteInputValue} orderItems={orderItems} />
            )}
          </div>
        </animated.div>
      </Popup>
    </div>
  );
}

export default Cart;
