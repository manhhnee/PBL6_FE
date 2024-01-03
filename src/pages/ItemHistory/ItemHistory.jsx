import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCheckCircle, faSpinner, faTruckFast, faX } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';
import { useSpring, animated } from 'react-spring';
import { Flip, ToastContainer, toast } from 'react-toastify';
import Star from '~/components/Star';

import Image from '~/components/Image';
import Button from '~/components/Button';
import styles from './ItemHistory.module.scss';
import Popup from '~/components/Popup/Popup';
import InputForm from '~/components/InputForm/InputForm';
import GetToken from '~/Token/GetToken';

const cx = classNames.bind(styles);

function BookItemHistory() {
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const [historyDetails, setHistoryDetails] = useState({});
  const [idStatus, setIdStatus] = useState();
  const [idShoe, setIDShoe] = useState();
  const [idOrder, setIDOrder] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payload, setPayload] = useState({
    comment: '',
  });
  const [rating, setRating] = useState(5);

  const modalAnimation = useSpring({
    opacity: isModalOpen ? 1 : 0,
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getApiHistoryDetail = async () => {
      try {
        const response = await axios.get(`https://2hm-store.click/api/order/${id}`, {
          headers: {
            Authorization: `Bearer ${GetToken()}`,
          },
        });
        console.log(response.data.result);
        setHistoryDetails(response.data.result);
        setIdStatus(response.data.result.id_status);
      } catch (error) {
        console.error('Error fetching history details:', error);
        // Handle the error, e.g., show an error message to the user
      }
    };
    getApiHistoryDetail();
  }, [id]);

  const handleRating = async (idShoe, idOrder, star, comment) => {
    await axios
      .post(
        'https://2hm-store.click/api/rating/add',
        {
          id_shoes: idShoe,
          id_order_item: idOrder,
          comment: comment,
          star: star,
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
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  let iconComponent;
  let statusComponent;
  if (historyDetails && historyDetails.id_status === 1) {
    iconComponent = <FontAwesomeIcon icon={faSpinner} className={cx('icon')} spinPulse />;
    statusComponent = <span className={cx('status-name')}>Order is being pending</span>;
  } else if (historyDetails && historyDetails.id_status === 2) {
    iconComponent = <FontAwesomeIcon icon={faCheckCircle} className={cx('icon')} beat></FontAwesomeIcon>;
    statusComponent = <span className={cx('status-name')}>The order is being prepared</span>;
  } else if (historyDetails && historyDetails.id_status === 3) {
    iconComponent = <FontAwesomeIcon icon={faTruckFast} className={cx('icon')} bounce></FontAwesomeIcon>;
    statusComponent = <span className={cx('status-name')}>The order is being delivering</span>;
  } else if (historyDetails && historyDetails.id_status === 4) {
    iconComponent = <FontAwesomeIcon icon={faCheckCircle} className={cx('icon')} beatFade></FontAwesomeIcon>;
    statusComponent = <span className={cx('status-name')}>The order has been successfully</span>;
  } else if (historyDetails && historyDetails.id_status === 5) {
    iconComponent = <FontAwesomeIcon icon={faX} className={cx('icon1')} beatFade></FontAwesomeIcon>;
    statusComponent = <span className={cx('status-name1')}>The order has been cancelled</span>;
  }

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
      <Popup isOpen={isModalOpen} onRequestClose={() => closeModal()} width={'700px'} height={'400px'}>
        <animated.div style={modalAnimation}>
          <h2>Rating</h2>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Stars</div>
            <div className={cx('star')}>
              <Star rating={rating} setRating={setRating} isUpdate={true}></Star>
            </div>
          </div>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Enter comment</div>
            <InputForm
              placeholder=""
              type="text"
              value={payload.comment}
              setValue={setPayload}
              name={'comment'}
              className={cx('input')}
              leftIcon={faBook}
            />
          </div>

          <div className={cx('options1')}>
            <Button onClick={() => handleRating(idShoe, idOrder, rating, payload.comment)} primary>
              Confirm
            </Button>
          </div>
        </animated.div>
      </Popup>
      <div className={cx('container')}>
        {historyDetails.Order_items &&
          historyDetails.Order_items.map((order) => {
            console.log(order);
            return (
              <div className={cx('content')} key={order.id}>
                <div className={cx('content-left')}>
                  <Image className={cx('img')} src={order.Shoes.image}></Image>
                </div>
                <div className={cx('content-center')}>
                  <span className={cx('book-name')}>{order.Shoes.name}</span>
                  <span className={cx('book-category')}>Size: {order.size}</span>
                  <span className={cx('book-price')}>{order.Fixed_Price && formatCurrency(order.Fixed_Price)}</span>
                  <span className={cx('book-quantity')}>x{order.order_item_infor.quantity}</span>
                </div>
                <div className={cx('content-right')}>
                  <div className={cx('status')}>
                    {iconComponent}
                    {statusComponent}
                  </div>
                  <div className={cx('options')}>
                    {idStatus === 4 && order.order_item_infor.isRate === 0 ? (
                      <Button
                        onClick={() => {
                          openModal();
                          setIDShoe(order.Shoes.id);
                          setIDOrder(order.order_item_infor.id);
                        }}
                        blue
                        className={cx('btn')}
                      >
                        Rating
                      </Button>
                    ) : null}
                    <Button to={`/detailItem/${order.Shoes.id}`} white className={cx('btn')}>
                      Repurchase
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default BookItemHistory;
