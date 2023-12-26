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
        <h2 className={cx('header')}>Category</h2>
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
      <div className={cx('items')}>
        <h2 className={cx('header')}>TOP 10</h2>
        <div className={cx('list-item')}>
          {shoes &&
            shoes.map((shoe) => {
              return (
                <div className={cx('item')}>
                  <img src={shoe.image} className={cx('item-img')} alt="img"></img>
                  <div className={cx('item-overlay')}>
                    <Link className={cx('item-icon')} to={`detailItem/${shoe.id}`}>
                      <Icon icon="iconamoon:search-bold" />
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className={cx('btn-wrap')}>
        <div className={cx('custom-button-container')}>
          <Link to={config.routes.allProducts} className={cx('custom-button')}>
            <span className={cx('bg-transition')}></span>
            <span className={cx('icon-transition')}>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
            <span className={cx('button-text')}>See all</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
