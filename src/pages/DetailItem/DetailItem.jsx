import classNames from 'classnames/bind';
import axios from 'axios';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Button from '~/components/Button';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Rate from '~/components/Rate';
import GetToken from '~/Token/GetToken';
import styles from './DetailItem.module.scss';

const cx = classNames.bind(styles);

function DetailItem() {
  const { id } = useParams();
  const [count, setCount] = useState(1);
  const [shoe, setShoe] = useState({});
  const [ratings, setRatings] = useState([]);
  function handleIncrement() {
    if (count >= 10) {
      setCount(10);
    } else {
      setCount(count + 1);
    }
  }

  function handleDecrement() {
    if (count > 1) {
      setCount(count - 1);
    }
  }
  const handleAddToCart = async (id_shoes, quantity) => {
    await axios
      .post(
        'http://localhost:4000/api/cart/add',
        {
          quantity: quantity,
          id_shoes: id_shoes,
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
        toast.error(error.message);
      });
  };

  useEffect(() => {
    const getAPIDetailItem = async () => {
      const response = await axios.get(`http://localhost:4000/api/shoes/${id}`);
      setShoe(response.data.result);
      setRatings(response.data.result.rating);
    };
    getAPIDetailItem();
  }, [id]);
  console.log();

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
          <span className={cx('prouduct-price')}>{shoe.price}</span>
          <div className={cx('product-cs')}>
            <div className={cx('product-color')}>
              <div className={cx('title')}>COLOR</div>
              <div className={cx('color')} style={{ backgroundColor: `${shoe.color}` }}></div>
            </div>
            <div className={cx('product-size')}>
              <div className={cx('title')}>SIZE</div>
              <select className={cx('size')}>
                <option className={cx('option')}>M</option>
              </select>
            </div>
          </div>
          <div className={cx('product-cart')}>
            <div className={cx('product-quantity')}>
              <Icon className={cx('minus')} icon="typcn:minus" onClick={handleDecrement} />
              <span className={cx('quantity')}>{count}</span>
              <Icon className={cx('plus')} icon="typcn:plus" onClick={handleIncrement} />
            </div>
            <Button animation className={cx('btn-buy')}>
              BUY NOW
            </Button>
            <Button
              animation
              className={cx('btn-add')}
              onClick={() => {
                handleAddToCart(shoe.id, count);
              }}
            >
              ADD TO CART
            </Button>
          </div>
        </div>
      </div>
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
