import React, { useEffect, useState } from 'react';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PaypalAll = ({ address, orderItems }) => {
  console.log(address);
  const [loggedIn, setLoggedIn] = useState(!!getJwtFromCookie());
  const [totalPrice, setTotalPrice] = useState(null);

  function getJwtFromCookie() {
    const name = 'token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return '';
  }

  const handleOrderAll = async (address) => {
    const orderItemsPayload = orderItems.map((item) => ({
      idCartItem: item.id,
      id_BookSupplier: item.id_BookSupplier,
      quantity: item.quantity,
      Price: item.Price,
      Amount: item.Amount,
    }));

    await axios
      .post(
        'http://localhost:5000/api/order/add',
        {
          address: address,
          payment: 2,
          OrderItems: orderItemsPayload,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getJwtFromCookie()}`,
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
        toast.error(e);
      });
  };

  useEffect(() => {
    setLoggedIn(!!getJwtFromCookie());
    const totalPrice = orderItems.reduce((total, item) => total + item.Price, 0);
    setTotalPrice(totalPrice);
  }, [orderItems]);

  return (
    <div>
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
      {address.trim() && loggedIn && orderItems.length > 0 && (
        <PayPalScriptProvider
          options={{
            'client-id': 'AQ_w1dR_0xJj-tYWIXmCsLKulaYJlr3GvQk3zv88z1NkBbIXDnnYoXpQvw2NaBIRRZl9hi8-EmQsU4JN',
          }}
        >
          <PayPalButtons
            style={{ layout: 'horizontal' }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: `${(totalPrice / 24000).toFixed(2)}`,
                    },
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then(() => {
                handleOrderAll(address);
              });
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default PaypalAll;
