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
    EmailLogin: '',
    PasswordLogin: '',
  });

  const [payload2, setPayload2] = useState({
    EmailRegister: '',
    PasswordRegister: '',
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
    try {
      const response = await fetch('http://localhost:4000/api/user/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: payload.EmailLogin.trim(),
          password: payload.PasswordLogin.trim(),
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
        if (data.errors && data.errors.email) {
          toast.error(data.errors.email.message);
        } else if (data.errors && data.errors.password) {
          toast.error(data.error.password.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const HandleSubmitSignUp = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: payload2.EmailRegister.trim(),
          password: payload2.PasswordRegister.trim(),
          firstname: payload2.firstName.trim(),
          lastname: payload2.lastName.trim(),
          phoneNumber: payload2.phoneNumber.trim(),
          confirm_password: payload2.confirm_password.trim(),
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success === true) {
        toast.success('Register successful!');
        setTimeout(() => {
          setIsSignupMode(false);
        }, 10000);
      } else {
        if (data.errors && data.errors.email) {
          toast.error(data.errors.email.message);
        } else if (data.errors && data.errors.password) {
          toast.error(data.errors.password.message);
        } else if (data.errors && data.errors.firstname) {
          toast.error(data.errors.firstname.message);
        } else if (data.errors && data.errors.lastname) {
          toast.error(data.errors.lastname.message);
        } else if (data.errors && data.errors.confirm_password) {
          toast.error(data.errors.confirm_password.message);
        } else if (data.errors && data.errors.phoneNumber) {
          toast.error(data.errors.phoneNumber.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {}
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
                value={payload.EmailLogin}
                setValue={setPayload}
                name={'EmailLogin'}
              />

              <InputForm
                placeholder="Password"
                leftIcon={faLock}
                type="password"
                value={payload.PasswordLogin}
                setValue={setPayload}
                name={'PasswordLogin'}
              />

              <Button signin_signup className={cx('btn')} onClick={handleLoginSubmit} id="LoginBtn">
                Login
              </Button>
            </div>
            <div className={cx('sign-up-form')}>
              <h2 className={cx('title')}>Register Page</h2>
              <InputForm
                placeholder="FirstName"
                leftIcon={faSignature}
                type="text"
                value={payload2.firstName}
                setValue={setPayload2}
                name={'firstName'}
              />

              <InputForm
                placeholder="LastName"
                leftIcon={faSignature}
                type="text"
                value={payload2.lastName}
                setValue={setPayload2}
                name={'lastName'}
              />

              <InputForm
                placeholder="Phone Number"
                leftIcon={faPhone}
                type="text"
                value={payload2.phoneNumber}
                setValue={setPayload2}
                name={'phoneNumber'}
              />

              {/* <AutoComplete setParentInputValue={setAutocompleteInputValue} /> */}

              <InputForm
                placeholder="Email"
                leftIcon={faUser}
                type="text"
                value={payload2.EmailRegister}
                setValue={setPayload2}
                name={'EmailRegister'}
              />

              <InputForm
                placeholder="Password"
                leftIcon={faLock}
                type="text"
                value={payload2.PasswordRegister}
                setValue={setPayload2}
                name={'PasswordRegister'}
              />

              <InputForm
                placeholder="Confirm Password"
                leftIcon={faLock}
                type="text"
                value={payload2.confirm_password}
                setValue={setPayload2}
                name={'confirm_password'}
              />
              <Button signin_signup className={cx('btn')} onClick={HandleSubmitSignUp} id="RegisterBtn">
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
              <button className={cx('btn', 'transparent')} onClick={handleSignupClick} id="Register">
                Register
              </button>
            </div>
            <img className={cx('image')} src={images.log} alt="logo-log"></img>
          </div>
          <div className={cx('panel', 'right-panel')}>
            <div className={cx('content')}>
              <h3>PBL 6: Project CN 1 </h3>
              <p>Member: Nguyễn Đức Mạnh, Trần Anh Hào, Hồ Thanh Hưng</p>
              <button className={cx('btn', 'transparent')} onClick={handleSigninClick} id="Login">
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
