import classNames from 'classnames/bind';
import axios from 'axios';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSpring, animated } from 'react-spring';

import Button from '~/components/Button';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Rate from '~/components/Rate';
import GetToken from '~/Token/GetToken';
import styles from './DetailItem.module.scss';
import Popup from '~/components/Popup';
import AutoComplete from '~/components/AutoComplete';
import InputForm from '~/components/InputForm';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function DetailItem() {
  const [autocompleteInputValue, setAutocompleteInputValue] = useState('');
  const [autocompleteInputValue2, setAutocompleteInputValue2] = useState('');
  const { id } = useParams();
  const [count, setCount] = useState(1);
  const [shoe, setShoe] = useState({});
  const [shoeSize, setShoeSize] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [idSize, setIDSize] = useState();
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
  const modalAnimation = useSpring({
    opacity: isModalOpen ? 1 : 0,
  });
  const modalAnimation2 = useSpring({
    opacity: isModalOpen2 ? 1 : 0,
  });

  //Handle Buy with Stripe
  const handleBuyStripe = async (address, phoneNumber) => {
    console.log(idSize, count, shoe.price, ((shoe.price / 23000) * 100).toFixed(2));
    try {
      setIsLoading(true);

      const response = await axios.post(
        'http://localhost:4000/api/payment',
        {
          items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: shoe.name,
                },
                unit_amount: parseInt(((shoe.price / 23000) * 100).toFixed(2), 10),
              },
              quantity: count,
            },
          ],
          size_items: {
            id_size_item: idSize,
            quantity: count,
            price: shoe.price,
          },

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

      setIsCompleted(true);

      // Chuyển hướng sau khi hoàn tất
      window.location.replace(response.data.url);
    } catch (err) {
      console.log(err.message);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  function handleIncrement() {
    setCount(count + 1);
  }

  function handleDecrement() {
    if (count > 1) {
      setCount(count - 1);
    }
  }
  const handleAddToCart = async () => {
    await axios
      .post(
        'http://localhost:4000/api/cart/add',
        {
          quantity: count,
          id_size_item: idSize,
        },
        {
          headers: {
            Authorization: `Bearer ${GetToken()}`,
          },
        },
      )
      .then((response) => {
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error('Vui lòng thử lại !');
      });
  };

  const handleCreateOneOrder = async (item, address, phoneNumber) => {
    if (!GetToken()) {
      toast.warning('Please login to order!');
    } else {
      try {
        const response = await axios.post(
          'http://localhost:4000/api/order/createOneItem',
          {
            Item: {
              id_size_item: idSize,
              quantity: count,
              price: item.price,
            },
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
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        toast.error(error.message || 'An error occurred while processing your request.');
      }
    }
  };

  useEffect(() => {
    const getAPIDetailItem = async () => {
      const response = await axios.get(`http://localhost:4000/api/shoes/${id}`);
      setShoe(response.data.result);
      setShoeSize(response.data.result.Size_items);
      setRatings(response.data.result.rating);
      if (response.data.result.Size_items && response.data.result.Size_items.length > 0) {
        setIDSize(response.data.result.Size_items[0].id);
      }
    };

    getAPIDetailItem();
  }, [id]);
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

  function formatCurrency(number) {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
    return formatter.format(number);
  }

  return (
    <div className={cx('container')}>
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
      <div className={cx('product')}>
        <div className={cx('product-img')}>
          <img alt="img" src={shoe.image && shoe.image[0].image} className={cx('img')}></img>
        </div>
        <div className={cx('prouduct-info')}>
          <h1 className={cx('product-name')}>{shoe.name}</h1>
          <p className={cx('product-des')}>{shoe.description}</p>
          <span className={cx('prouduct-price')}>{formatCurrency(shoe.price)}</span>
          <div className={cx('product-cs')}>
            <div className={cx('product-color')}>
              <div className={cx('title')}>COLOR</div>
              <div className={cx('color')} style={{ backgroundColor: `${shoe.color}` }}></div>
            </div>
            <div className={cx('product-size')}>
              <div className={cx('title')}>SIZE</div>
              <select
                className={cx('size')}
                onChange={(e) => {
                  const selectedSizeId = e.target.value;
                  setIDSize(selectedSizeId);
                }}
                value={idSize}
              >
                {shoeSize &&
                  shoeSize.map((size) => {
                    return (
                      <option key={size.id} className={cx('option')} value={size.id}>
                        {size.size} - {size.amount} Product
                      </option>
                    );
                  })}
              </select>
            </div>
          </div>
          <div className={cx('product-cart')}>
            <div className={cx('product-quantity')}>
              <Icon className={cx('minus')} icon="typcn:minus" onClick={handleDecrement} />
              <input
                type="text"
                className={cx('quantity')}
                value={count}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  if (!isNaN(newValue) && newValue >= 0) {
                    setCount(newValue);
                  }
                }}
              />
              <Icon className={cx('plus')} icon="typcn:plus" onClick={handleIncrement} />
            </div>
            <Button animation className={cx('btn-buy')} onClick={() => openModal()}>
              BUY NOW
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
            <Button
              animation
              className={cx('btn-add')}
              onClick={() => {
                handleAddToCart();
              }}
            >
              ADD TO CART
            </Button>
          </div>
        </div>
      </div>
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
            <Button onClick={() => handleCreateOneOrder(shoe, autocompleteInputValue, payload.phoneNumber)} outline>
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
            <Button onClick={() => handleBuyStripe(autocompleteInputValue2, payload2.phoneNumber)} outline>
              Confirm
            </Button>
          </div>
        </animated.div>
      </Popup>
      <div className={cx('extra-detail')}>
        <div className={cx('header-field')}>
          <span className={cx('header-rate')}>Rating</span>
        </div>
        <div className={cx('content')}>
          {ratings.map((rating, index) => {
            return <Rate data={rating} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default DetailItem;
