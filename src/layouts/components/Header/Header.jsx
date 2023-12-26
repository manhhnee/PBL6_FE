import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import React from 'react';
import Tippy from '@tippyjs/react';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';

import config from '~/config';
import GetToken from '~/Token/GetToken';
import Search from '~/layouts/components/Search';
import styles from './Header.module.scss';
import axios from 'axios';
import Image from '~/components/Image';

const cx = classNames.bind(styles);

function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const [infor, setInfor] = useState({});
  const navigate = useNavigate();
  const goLogin = useCallback(
    (flag) => {
      navigate(config.routes.login, { state: { flag } });
    },
    [navigate],
  );
  const getAPIProfiler = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/user/profile/me', {
        headers: {
          Authorization: `Bearer ${GetToken()}`,
        },
      });
      console.log(response.data.user);
      if ((response.data.success === true) & (localStorage.getItem('Role') === 'customer')) {
        setIsLogin(true);
        setInfor(response.data.user.inforUser);
      } else {
        setIsLogin(false);
        setInfor({});
      }
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  useEffect(() => {
    getAPIProfiler();
  }, []);

  function Logout() {
    document.cookie = 'token=;';
    window.location.replace('/');
    localStorage.setItem('Role', null);
  }

  return (
    <header className={cx('header')}>
      <div className={cx('container')}>
        <div className={cx('header-nav')}>
          <div className={cx('header-logo')}>
            <div className={cx('logo-wrap')}>
              <Link to="/" title="CoconamaTeaBar">
                2H&M
              </Link>
            </div>
          </div>
          <Search />
          <div className={cx('header-actions')}>
            {isLogin ? (
              <div className={cx('actions')}>
                <Tippy content="CART">
                  <div
                    onClick={() => {
                      window.location.replace(config.routes.cart);
                    }}
                  >
                    <Icon className={cx('cart-icon')} icon="mdi:cart-outline" />
                  </div>
                </Tippy>
                <HeadlessTippy
                  interactive
                  placement="bottom-end"
                  delay={[0, 500]}
                  render={(attrs) => (
                    <div className={cx('menu-item')} tabIndex="-1" {...attrs}>
                      <button onClick={Logout} className={cx('user-btn')}>
                        <Icon className={cx('logout-icon')} icon="tabler:logout" />
                        <span>Log out</span>
                      </button>
                    </div>
                  )}
                >
                  <div
                    className={cx('avatar')}
                    onClick={() => {
                      window.location.replace(config.routes.information);
                    }}
                  >
                    <Image src={infor.avatar} alt="Avatar"></Image>
                  </div>
                </HeadlessTippy>
              </div>
            ) : (
              <div>
                <button className={cx('custom-btn', 'btn-3')} onClick={() => goLogin(false)}>
                  <span>Login</span>
                </button>
                <button className={cx('custom-btn', 'btn-3')} onClick={() => goLogin(true)}>
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
