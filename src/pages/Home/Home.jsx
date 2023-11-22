import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import axios from 'axios';

import Button from '~/components/Button';
import styles from './Home.module.scss';
import config from '~/config';

const cx = classNames.bind(styles);

function Home() {
  const [categories, setCategories] = useState([]);
  const [shoes, setShoes] = useState([]);
  useEffect(() => {
    const fetchAPICategories = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/category/');
        setCategories(response.data.categories);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchAPIShoes = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/shoes?limit=10');
        setShoes(response.data.result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPICategories();
    fetchAPIShoes();
  }, []);
  console.log(shoes);
  return (
    <div className={cx('wrapper')}>
      <div className={cx('slide-bar')}>
        <img
          className={cx('slide')}
          alt="slide1"
          src="https://media.gq.com/photos/646fdd946cbe43aa644cd88b/4:3/w_1500,h_1125,c_limit/shoes-art.jpg"
        ></img>
      </div>
      <div className={cx('categories')}>
        <div className={cx('list-category')}>
          {categories &&
            categories.map((category) => {
              return (
                <div className={cx('category')}>
                  <Link>
                    <img className={cx('category-image')} src={category.image} alt="category"></img>
                    <div className={cx('category-container')}>
                      <div className={cx('category-title')}>{category.name}</div>
                      <Button
                        animation
                        className={cx('category-btn')}
                        to={`${config.routes.allProducts}?id1=${category.id}`}
                      >
                        SHOP NOW
                      </Button>
                    </div>
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
      <div className={cx('list-item')}>
        {shoes &&
          shoes.map((shoe) => {
            return (
              <div className={cx('item')}>
                <img src={shoe.image} className={cx('item-img')} alt="img"></img>
                <div className={cx('item-overlay')}>
                  <div className={cx('item-icon')}>
                    <Icon icon="mdi:cart-outline" />
                  </div>
                  <Link className={cx('item-icon')} to={`detailItem/${shoe.id}`}>
                    <Icon icon="iconamoon:search-bold" />
                  </Link>
                  <div className={cx('item-icon')}>
                    <Icon icon="mdi:heart-outline" />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className={cx('btn-wrap')}>
        <Button
          animation
          className={cx('btn')}
          onClick={() => {
            window.location.replace(config.routes.allProducts);
          }}
        >
          See all
        </Button>
      </div>
    </div>
  );
}

export default Home;
