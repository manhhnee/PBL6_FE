import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Footer() {
  return (
    <footer className={cx('footer')}>
      <div className={cx('container')}>
        <div className={cx('row')}>
          <div className={cx('col')}>
            <h3 className={cx('footer-title')}>Giới thiệu</h3>
            <ul className={cx('footer-linklist')}>
              <li>
                <Link>Về chúng tôi</Link>
              </li>
              <li>
                <Link>Sản phẩm</Link>
              </li>
              <li>
                <Link>Cửa hàng</Link>
              </li>
              <li>
                <Link>Khuyến mãi</Link>
              </li>
            </ul>
          </div>
          <div className={cx('col')}>
            <h3 className={cx('footer-title')}>Giới thiệu</h3>
            <ul className={cx('footer-linklist')}>
              <li>
                <Link>Về chúng tôi</Link>
              </li>
              <li>
                <Link>Sản phẩm</Link>
              </li>
              <li>
                <Link>Cửa hàng</Link>
              </li>
              <li>
                <Link>Khuyến mãi</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
