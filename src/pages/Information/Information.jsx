import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faSignature, faUpload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Flip, ToastContainer, toast } from 'react-toastify';
import { useSpring, animated } from 'react-spring';

import GetToken from '~/Token/GetToken';
import InputForm from '~/components/InputForm';
import Button from '~/components/Button';
import Profile from '~/layouts/Profile';
import Popup from '~/components/Popup';
import styles from './Information.module.scss';

const cx = classNames.bind(styles);

function Information() {
  const [infor, setInfor] = useState({});
  const [avatar, setAvatar] = useState({});
  const [image, setImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [payload1, setPayload1] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    avatar: '',
  });

  const [payload2, setPayload2] = useState({
    password: '',
    newPassword: '',
    againPassword: '',
  });

  useEffect(() => {
    const fetchAPIProfile = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/profile/me', {
          headers: {
            Authorization: `Bearer ${GetToken()}`,
          },
        });
        const user = response.data.user.inforUser;
        if (response.data.success === true) {
          setInfor(user);
          setImage(user.Avatar);
        } else {
          setInfor({});
        }

        setPayload1((prevPayload1) => ({
          ...prevPayload1,
          firstName: user.firstname,
          lastName: user.lastname,
          phoneNumber: user.phoneNumber,
        }));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPIProfile();
  }, []);

  const handleUpdateInfor = async () => {
    try {
      await axios
        .put(
          `http://localhost:4000/api/user/updateProfile`,
          {
            lastname: payload1.lastName,
            firstname: payload1.firstName,
            phoneNumber: payload1.phoneNumber,
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
          setInfor({ ...infor, payload1 });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch((e) => {
          toast.error(e.message);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdateAva = async () => {
    const formData = new FormData();
    formData.append('image', avatar);
    const response = await fetch('http://localhost:4000/api/user/update-avatar', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GetToken()}`, // trả token về server để xử lí
      },
      body: formData,
    });

    const data = await response.json();
    console.log(data);
    if (data.success === true) {
      toast.success(data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast.error(data.message);
    }
  };

  const handleChangePassword = async (oldPass, newPass, againPass) => {
    await axios
      .put(
        'http://localhost:4000/api/user/change-password',
        {
          Password: oldPass,
          NewPassword: newPass,
          AgainPassword: againPass,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GetToken()}`,
          },
        },
      )
      .then((res) => {
        toast(res.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
    };

    reader.readAsDataURL(file);
    setAvatar(e.target.files[0]);
  };

  const modalAnimation = useSpring({
    opacity: isModalOpen ? 1 : 0,
  });

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
    setPayload1({});
  };

  return (
    <Profile>
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
      <div className={cx('container')}>
        <div className={cx('main-header')}>Personal page</div>
        <div className={cx('information-field')}>
          <div className={cx('information')}>
            <div className={cx('header')}>Personal information</div>
            <div className={cx('description-field')}>
              <div className={cx('description')}>Update your avatar and information here</div>

              <Button blue className={cx('save-btn')} onClick={() => handleUpdateInfor()}>
                Save
              </Button>
              <Button primary className={cx('changePass-btn')} onClick={openModal}>
                Change password
              </Button>
            </div>
          </div>
          <div className={cx('text-field')}>
            <div className={cx('header')}>Full name</div>
            <div className={cx('input-field')}>
              <div className={cx('input-wrapper')}>
                <InputForm
                  placeholder=""
                  type="text"
                  value={payload1.firstName}
                  setValue={setPayload1}
                  name={'firstName'}
                  className={cx('input')}
                  leftIcon={faSignature}
                />
              </div>
              <div className={cx('input-wrapper')}>
                <InputForm
                  placeholder=""
                  type="text"
                  value={payload1.lastName}
                  setValue={setPayload1}
                  name={'lastName'}
                  className={cx('input')}
                  leftIcon={faSignature}
                />
              </div>
            </div>
          </div>
          <div className={cx('text-field')}>
            <div className={cx('header')}>Phone number</div>
            <div className={cx('input-field')}>
              <div className={cx('input-wrapper')}>
                <InputForm
                  placeholder=""
                  type="text"
                  value={payload1.phoneNumber}
                  setValue={setPayload1}
                  name={'phoneNumber'}
                  className={cx('input')}
                  leftIcon={faPhone}
                />
              </div>
            </div>
          </div>

          <div className={cx('text-field')}>
            <div className={cx('header')}>Your avatar</div>
            <div className={cx('input-field')}>
              {avatar && <img src={image} className={cx('image')} alt="" />}
              <label htmlFor="file-upload" className={cx('upload-btn')}>
                <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                <input id="file-upload" type="file" onChange={handleImgChange}></input>
              </label>
              <Button
                animation
                className={cx('upd-ava')}
                onClick={() => {
                  handleUpdateAva();
                }}
              >
                Update Avatar
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Popup isOpen={isModalOpen} onRequestClose={() => closeModal()} width={'700px'} height={'500px'}>
        <animated.div style={modalAnimation}>
          <h2>Change password</h2>
          <div className={cx('header')}>Please enter your old password</div>
          <div className={cx('input-field')}>
            <InputForm
              placeholder=""
              type="text"
              value={payload2.password}
              setValue={setPayload2}
              name={'password'}
              className={cx('input')}
            />
          </div>
          <div className={cx('header')}>Please enter your new password</div>
          <div className={cx('input-field')}>
            <InputForm
              placeholder=""
              type="text"
              value={payload2.newPassword}
              setValue={setPayload2}
              name={'newPassword'}
              className={cx('input')}
            />
          </div>
          <div className={cx('header')}>Please enter again your new password</div>
          <div className={cx('input-field')}>
            <InputForm
              placeholder=""
              type="text"
              value={payload2.againPassword}
              setValue={setPayload2}
              name={'againPassword'}
              className={cx('input')}
            />
          </div>

          <div className={cx('options')}>
            <Button
              onClick={() => {
                // handleChangePassword(payload2.password, payload2.newPassword, payload2.againPassword);
              }}
              outline
            >
              Confirm
            </Button>
          </div>
        </animated.div>
      </Popup>
    </Profile>
  );
}

export default Information;
