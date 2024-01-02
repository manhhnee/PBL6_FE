import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import Button from '~/components/Button/Button';
import config from '~/config';
import styles from './AllProduct.module.scss';

const ProductItem = React.lazy(() => import('~/components/ProductItem'));
const cx = classNames.bind(styles);

function AllBook() {
  const [shoes, setShoes] = useState({});
  const [categories, setCategories] = useState({});
  const [brands, setBrands] = useState({});
  const location = useLocation();
  const { id1, id2, search } = queryString.parse(location.search);
  const [descPrice, setDescPrice] = useState(0);
  const idCategory = id1 || '';
  const idBrand = id2 || '';
  const searchValue = search || '';
  const [activeButton, setActiveButton] = useState(1);
  const [page, setPage] = useState(() => {
    const storedPage = localStorage.getItem('page');
    return storedPage ? parseInt(storedPage) : 1;
  });
  let [totalPage, setTotalPage] = useState();

  const handlePageClick = (buttonId) => {
    setActiveButton(buttonId);
    setPage(buttonId);
    window.location.reload();
  };

  const handleCategoryClick = (buttonId) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('id1', buttonId);
    const newSearch = urlParams.toString();
    const newUrl = `${window.location.pathname}?${newSearch}`;
    window.location.href = newUrl;
  };

  const handleBrandClick = (buttonId) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('id2', buttonId);
    const newSearch = urlParams.toString();
    const newUrl = `${window.location.pathname}?${newSearch}`;
    window.location.href = newUrl;
  };

  const pagesToShow = 10;

  // Calculate the start and end pages
  const startPage = Math.max(1, Math.min(page - Math.floor(pagesToShow / 2), totalPage - pagesToShow + 1));
  const endPage = Math.min(startPage + pagesToShow - 1, totalPage);

  useEffect(() => {
    setActiveButton(page);
    localStorage.setItem('page', page);
  }, [page]);

  useEffect(() => {
    const fetchApiShoes = async () => {
      const response = await axios.get(
        `https://2hm-store.click/api/shoes?limit=100&category=${idCategory}&brand=${idBrand}&page=${page}&search=${searchValue}&isDesc=${descPrice}`,
      );
      setShoes(response.data.result);
      setTotalPage(response.data.totalPages);
    };

    const fetchApiCategories = async () => {
      const response = await axios.get('https://2hm-store.click/api/category/');
      const categoriesData = await response.data.categories;
      setCategories(categoriesData);
    };
    const fetchApiBrands = async () => {
      const response = await axios.get('https://2hm-store.click/api/brand/');
      const brandsData = await response.data.brands;
      setBrands(brandsData);
    };
    fetchApiCategories();
    fetchApiShoes();
    fetchApiBrands();
  }, [idCategory, idBrand, totalPage, page, searchValue, descPrice]);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('filters')}>
        <span className={cx('label')}>Sorted by</span>
        <div className={cx('select-input')}>
          <span className={cx('select-input__label')}>Price</span>
          <FontAwesomeIcon className={cx('select-input__icon')} icon={faChevronDown}></FontAwesomeIcon>
          <ul className={cx('select-input__list')}>
            <li className={cx('select-input__item')}>
              <Link onClick={() => setDescPrice(0)} href="" className={cx('select-input__link')}>
                Price: Low to high
              </Link>
            </li>
            <li className={cx('select-input__item')}>
              <Link onClick={() => setDescPrice(1)} href="" className={cx('select-input__link')}>
                Price: High to low
              </Link>
            </li>
          </ul>
        </div>
        <div className={cx('select-input')}>
          <span className={cx('select-input__label')}>Category</span>
          <FontAwesomeIcon className={cx('select-input__icon')} icon={faChevronDown}></FontAwesomeIcon>
          <ul className={cx('select-input__list')}>
            {categories.length &&
              categories.map((category) => {
                return (
                  <li className={cx('select-input__item')} key={category.id}>
                    <Link
                      to={`${config.routes.allProducts}?search=${encodeURIComponent(searchValue)}`}
                      onClick={() => handleCategoryClick(category.id)}
                      className={cx('select-input__link')}
                    >
                      {category.name}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className={cx('select-input')}>
          <span className={cx('select-input__label')}>Brand</span>
          <FontAwesomeIcon className={cx('select-input__icon')} icon={faChevronDown}></FontAwesomeIcon>
          <ul className={cx('select-input__list')}>
            {brands.length &&
              brands.map((brand) => {
                return (
                  <li className={cx('select-input__item')} key={brand.id}>
                    <Link
                      to={`${config.routes.allProducts}?id=${brand.id}&search=${encodeURIComponent(searchValue)}`}
                      onClick={() => handleBrandClick(brand.id)}
                      className={cx('select-input__link')}
                    >
                      {brand.name}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
      <div className={cx('book-list')}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <ProductItem items={shoes.length && shoes} />
        </React.Suspense>

        <ul className={cx('pagination')}>
          {startPage > 1 && (
            <>
              <Button className={cx('pagination-item')} onClick={() => handlePageClick(1)}>
                1
              </Button>
              {startPage > 2 && <span style={{ fontSize: '25px' }}>...</span>}
            </>
          )}
          {Array.from({ length: pagesToShow }, (_, index) => startPage + index).map((pageNumber, index) => (
            <Button
              className={cx('pagination-item', `${activeButton === pageNumber ? 'active' : ''}`)}
              onClick={() => handlePageClick(pageNumber)}
              key={index}
            >
              {pageNumber}
            </Button>
          ))}
          {endPage < totalPage && (
            <>
              {endPage < totalPage - 1 && <span style={{ fontSize: '25px' }}>...</span>}
              <Button className={cx('pagination-item')} onClick={() => handlePageClick(totalPage)}>
                {totalPage}
              </Button>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default AllBook;
