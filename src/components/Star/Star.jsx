import PropTypes from 'prop-types';
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import styles from './Star.module.scss';

const cx = classNames.bind(styles);

const Star = ({ rating = 5, setRating, isUpdate = false }) => {
  const [hoverRating, setHoverRating] = useState(1);

  const handleClick = (rating) => {
    setRating(rating);
  };

  const stars = [];
  if (isUpdate === true) {
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesomeIcon
          className={cx('icon')}
          key={i}
          icon={faStar}
          color={i < hoverRating || i < rating ? 'gold' : 'gray'}
          onClick={() => handleClick(i + 1)}
          onMouseEnter={() => setHoverRating(i + 1)}
          onMouseLeave={() => setHoverRating(0)}
        ></FontAwesomeIcon>,
      );
    }
  } else {
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesomeIcon
          className={cx('icon')}
          key={i}
          icon={faStar}
          color={i < rating ? 'gold' : 'gray'}
        ></FontAwesomeIcon>,
      );
    }
  }
  return <div>{stars}</div>;
};

Star.proptoTypes = {
  rating: PropTypes.number,
  setRating: PropTypes.node,
  isUpdate: PropTypes.bool,
};

export default Star;
