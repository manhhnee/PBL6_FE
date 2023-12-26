import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './ProductItem.module.scss';
import { Link } from 'react-router-dom';
import Image from '~/components/Image';

const cx = classNames.bind(styles);

function ProductItem({ items }) {
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
    });
  }
  function formatCurrency(number) {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
    return formatter.format(number);
  }
  return (
    <div className={cx('book-items')}>
      <div className={cx('container')}>
        {items &&
          items.map((item) => {
            return (
              <Link key={item.id} onClick={scrollToTop} to={`/detailItem/${item.id}`} className={cx('item')}>
                <Image src={item.image} className={cx('img')} />
                <div className={cx('title')}>{item.name}</div>
                <div className={cx('price')}>{formatCurrency(item.price)}</div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

ProductItem.protoTypes = {
  items: PropTypes.array.isRequired,
};

export default ProductItem;
