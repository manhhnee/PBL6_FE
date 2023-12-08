import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useState } from 'react';

import config from '~/config';
import styles from './Sidebar.module.scss';
import { faChartLine, faHouse, faList, faRightFromBracket, faShoePrints } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Sidebar() {
  const [activeIndex, setActiveIndex] = useState(() => {
    return parseInt(localStorage.getItem('activeIndex')) || 0;
  });

  const handleSetActive = (index) => {
    setActiveIndex(index);
  };

  function Logout() {
    document.cookie = 'token=; path=/';
    window.location.replace(config.routes.login);
    localStorage.setItem('Role', null);
  }

  useEffect(() => {
    localStorage.setItem('activeIndex', activeIndex.toString());
  }, [activeIndex]);

  return (
    <section className={cx('wrapper')}>
      <Link to="" className={cx('brand')}>
        <FontAwesomeIcon className={cx('bx')} icon={faFaceSmile}></FontAwesomeIcon>
        <span className={cx('text')}>ADMIN PAGE</span>
      </Link>
      <ul className={cx('side-menu', 'top')}>
        <li
          className={cx({ active: activeIndex === 0 })}
          onClick={() => window.location.replace(config.routes.adminPending)}
        >
          <Link to="" onClick={() => handleSetActive(0)}>
            <FontAwesomeIcon className={cx('bx')} icon={faHouse}></FontAwesomeIcon>
            <span className={cx('text')}>Home</span>
          </Link>
        </li>
        <li
          className={cx({ active: activeIndex === 1 })}
          onClick={() => window.location.replace(config.routes.manageCategory)}
        >
          <Link to="" onClick={() => handleSetActive(1)}>
            <FontAwesomeIcon className={cx('bx')} icon={faList}></FontAwesomeIcon>
            <span className={cx('text')}>Category</span>
          </Link>
        </li>
        <li
          className={cx({ active: activeIndex === 2 })}
          onClick={() => window.location.replace(config.routes.manageShoes)}
        >
          <Link to="" onClick={() => handleSetActive(2)}>
            <FontAwesomeIcon className={cx('bx')} icon={faShoePrints}></FontAwesomeIcon>
            <span className={cx('text')}>Shoes</span>
          </Link>
        </li>
        <li
          className={cx({ active: activeIndex === 3 })}
          onClick={() => window.location.replace(config.routes.revenue)}
        >
          <Link to="" onClick={() => handleSetActive(3)}>
            <FontAwesomeIcon className={cx('bx')} icon={faChartLine}></FontAwesomeIcon>
            <span className={cx('text')}>Analytics</span>
          </Link>
        </li>
      </ul>

      <ul className={cx('side-menu')}>
        <li>
          <Link to="" onClick={() => Logout()} className={cx('logout')}>
            <FontAwesomeIcon className={cx('bx')} icon={faRightFromBracket}></FontAwesomeIcon>
            <span className={cx('text')}>Logout</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}

export default Sidebar;
