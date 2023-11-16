import React, { useEffect, useState } from 'react';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const Paypal = ({ idBookSupplier, quantity, price, amount, address }) => {
  console.log(address);
  const [loggedIn, setLoggedIn] = useState(!!getJwtFromCookie());

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

  const handleCreateOneOrder = async (id_BookSupplier, quantity, Price, Amount, address) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/order/addOneItem',
        {
          payment: 2,
          id_BookSupplier: id_BookSupplier,
          quantity: quantity,
          Price: Price,
          Amount: Amount,
          address: address,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getJwtFromCookie()}`,
          },
        },
      );

      toast.success(response.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setLoggedIn(!!getJwtFromCookie());
  }, []);

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
      {address.trim() && loggedIn && (
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
                      value: `${price}`,
                    },
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then(() => {
                handleCreateOneOrder(idBookSupplier, quantity, (price * 24000).toFixed(2), amount, address);
              });
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default Paypal;
