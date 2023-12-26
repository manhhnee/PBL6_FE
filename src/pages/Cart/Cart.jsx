import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';
import { useSpring, animated } from 'react-spring';
import { Flip, ToastContainer, toast } from 'react-toastify';

import ItemCart from '~/components/ItemCart';
import Button from '~/components/Button';
import Popup from '~/components/Popup';
import AutoComplete from '~/components/AutoComplete/AutoComplete';
import styles from './Cart.module.scss';
import GetToken from '~/Token/GetToken';
import InputForm from '~/components/InputForm';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Cart() {
  const [autocompleteInputValue, setAutocompleteInputValue] = useState('');
  const [autocompleteInputValue2, setAutocompleteInputValue2] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [payload, setPayload] = useState({
    phoneNumber: '',
  });
  const [payload2, setPayload2] = useState({
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

  const modalAnimation2 = useSpring({
    opacity: isModalOpen2 ? 1 : 0,
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

  const handleBuyWithStripe = async (address, phoneNumber) => {
    if (orderItems.length === 0) {
      toast.error('Please select items to pay');
    } else {
      try {
        setIsLoading(true);

        const ItemsPayload = orderItems.map((item) => {
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.Shoes.name,
              },
              unit_amount: parseInt(((item.Shoes.price / 23000) * 100).toFixed(2)),
            },
            quantity: item.cart_item_infor.quantity,
          };
        });
        const orderItemsPayload = orderItems.map((item) => {
          return {
            id_size_item: item.id,
            id_cartItem: item.cart_item_infor.id,
            quantity: item.cart_item_infor.quantity,
            price: item.Shoes.price,
          };
        });

        const response = await axios.post(
          'http://localhost:4000/api/payment',
          {
            items: ItemsPayload,
            cart_size_items: orderItemsPayload,
            address: address,
            phoneNumber: phoneNumber,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${GetToken()}`,
            },
          },
        );

        toast.success(response.data.message);
        setIsCompleted(true);
        window.location.replace(response.data.url);
      } catch (error) {
        console.error(error.message);
        toast.error('An error occurred. Please try again.');
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

  const openModal2 = () => {
    setIsModalOpen2(true);
  };

  const closeModal2 = () => {
    setIsModalOpen2(false);
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
          <Button animation className={cx('btn')} onClick={() => openModal()} primary>
            Payment
          </Button>
          <Button
            animation
            className={cx('btn-buy')}
            onClick={() => {
              openModal2();
            }}
          >
            BUY WITH STRIPE
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
      <Popup isOpen={isModalOpen2} onRequestClose={() => closeModal2()} width={String('500px')} height={'350px'}>
        <animated.div style={modalAnimation2}>
          <h2>Payment confirmation</h2>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Enter address</div>
            <AutoComplete setParentInputValue={setAutocompleteInputValue2} />
          </div>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Enter phone number</div>
            <InputForm
              placeholder={'Enter phone number'}
              type="text"
              value={payload2.phoneNumber}
              setValue={setPayload2}
              name={'phoneNumber'}
              className={cx('input')}
              leftIcon={faPhone}
            />
          </div>
          <div className={cx('options')}>
            <Button
              onClick={() => {
                if (!isLoading && !isCompleted) {
                  handleBuyWithStripe(autocompleteInputValue2, payload2.phoneNumber);
                }
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
