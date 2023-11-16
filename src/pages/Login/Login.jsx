import { faLock, faPhone, faUser, faSignature } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import images from '~/assets/images';
import Button from '~/components/Button';
import InputForm from '~/components/InputForm';
import config from '~/config';
import styles from './Login.module.scss';

const cx = classNames.bind(styles);

function Login() {
  const location = useLocation();

  const [isSignupMode, setIsSignupMode] = useState(location.state?.flag);
  const [payload, setPayload] = useState({
    Email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    confirm_password: '',
  });

  //   const [autocompleteInputValue, setAutocompleteInputValue] = useState('');

  const handleSignupClick = () => setIsSignupMode(true);
  const handleSigninClick = () => setIsSignupMode(false);

  //   const validateForm = () => {
  //     let isValid = true;
  //     const errors = {};

  //     if (!payload.Email.trim()) {
  //       errors.Email = 'Vui lòng nhập tên người dùng';
  //       isValid = false;
  //     }

  //     if (!payload.password.trim()) {
  //       errors.password = 'Vui lòng nhập mật khẩu';
  //       isValid = false;
  //     }

  //     if (isSignupMode) {
  //       if (!payload.firstName.trim()) {
  //         errors.firstName = 'Vui lòng nhập họ';
  //         isValid = false;
  //       }

  //       if (!payload.lastName.trim()) {
  //         errors.lastName = 'Vui lòng nhập tên';
  //         isValid = false;
  //       }

  //       if (!payload.phoneNumber.trim()) {
  //         errors.phoneNumber = 'Vui lòng nhập số điện thoại';
  //         isValid = false;
  //       }

  //       if (!autocompleteInputValue.trim()) {
  //         errors.address = 'Vui lòng nhập địa chỉ';
  //         isValid = false;
  //       }
  //     }

  //     setErrorMessages(errors);

  //     return isValid;
  //   };

  const handleLoginSubmit = async () => {
    const response = await fetch('http://localhost:4000/api/user/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payload.Email.trim(),
        password: payload.password.trim(),
      }),
    });

    const data = await response.json();
    console.log(data);
    if (data.success === true) {
      toast.success('Login successful');
      localStorage.setItem('Role', data.role);
      document.cookie = `token=${data.accessToken}`;
      setTimeout(() => {
        if (data.role === 'admin') {
          window.location.replace(config.routes.adminPending);
        } else {
          window.location.replace(config.routes.home);
        }
      }, 2000);
    } else {
      toast.error('Please login again!');
    }
  };
  const HandleSubmitSignUp = async () => {
    const response = await fetch('http://localhost:4000/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payload.Email.trim(),
        password: payload.password.trim(),
        firstname: payload.firstName.trim(),
        lastname: payload.lastName.trim(),
        phoneNumber: payload.phoneNumber.trim(),
        confirm_password: payload.confirm_password.trim(),
      }),
    });
    const data = await response.json();
    if (data.success === true) {
      toast.success('Register successful!');
      setTimeout(() => {
        setIsSignupMode(false);
      }, 2000);
    } else {
      toast.error(data.message);
    }
  };

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
      <div className={cx('container', `${isSignupMode ? 'sign-up-mode' : ''}`)}>
        <div className={cx('form-container')}>
          <div className={cx('signin-signup')}>
            <div className={cx('sign-in-form')}>
              <h2 className={cx('title')}>Login Page</h2>
              <InputForm
                placeholder="Email"
                leftIcon={faUser}
                type="text"
                value={payload.Email}
                setValue={setPayload}
                name={'Email'}
              />

              <InputForm
                placeholder="Password"
                leftIcon={faLock}
                type="password"
                value={payload.password}
                setValue={setPayload}
                name={'password'}
              />

              <Button signin_signup className={cx('btn')} onClick={handleLoginSubmit}>
                Login
              </Button>
            </div>
            <div className={cx('sign-up-form')}>
              <h2 className={cx('title')}>Register Page</h2>
              <InputForm
                placeholder="FirstName"
                leftIcon={faSignature}
                type="text"
                value={payload.firstName}
                setValue={setPayload}
                name={'firstName'}
              />

              <InputForm
                placeholder="LastName"
                leftIcon={faSignature}
                type="text"
                value={payload.lastName}
                setValue={setPayload}
                name={'lastName'}
              />

              <InputForm
                placeholder="Phone Number"
                leftIcon={faPhone}
                type="text"
                value={payload.phoneNumber}
                setValue={setPayload}
                name={'phoneNumber'}
              />

              {/* <AutoComplete setParentInputValue={setAutocompleteInputValue} /> */}

              <InputForm
                placeholder="Email"
                leftIcon={faUser}
                type="text"
                value={payload.Email}
                setValue={setPayload}
                name={'Email'}
              />

              <InputForm
                placeholder="Password"
                leftIcon={faLock}
                type="text"
                value={payload.password}
                setValue={setPayload}
                name={'password'}
              />

              <InputForm
                placeholder="Confirm Password"
                leftIcon={faLock}
                type="text"
                value={payload.confirm_password}
                setValue={setPayload}
                name={'confirm_password'}
              />
              <Button signin_signup className={cx('btn')} onClick={HandleSubmitSignUp}>
                Register
              </Button>
            </div>
          </div>
        </div>
        <div className={cx('panels-container')}>
          <div className={cx('panel', 'left-panel')}>
            <div className={cx('content')}>
              <h3>PBL 6: Project CN 1 </h3>
              <p>Member: Nguyễn Đức Mạnh, Trần Anh Hào, Hồ Thanh Hưng</p>
              <button className={cx('btn', 'transparent')} onClick={handleSignupClick}>
                Register
              </button>
            </div>
            <img className={cx('image')} src={images.log} alt="logo-log"></img>
          </div>
          <div className={cx('panel', 'right-panel')}>
            <div className={cx('content')}>
              <h3>PBL 6: Project CN 1 </h3>
              <p>Member: Nguyễn Đức Mạnh, Trần Anh Hào, Hồ Thanh Hưng</p>
              <button className={cx('btn', 'transparent')} onClick={handleSigninClick}>
                Login
              </button>
            </div>
            <img className={cx('image')} src={images.register} alt="logo-log"></img>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
