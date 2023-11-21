import classNames from 'classnames/bind';
import axios from 'axios';
import { Icon } from '@iconify/react';

import HeadlessTippy from '@tippyjs/react/headless';
import { useRef } from 'react';
import { useState, useEffect } from 'react';

import styles from './Search.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Search() {
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResult([]);
      return;
    }
    const fetchApi = async () => {
      const response = await axios.get(`http://localhost:4000/api/shoes?search=${searchValue}&limit=5`);
      setSearchResult(response.data.result);
    };

    fetchApi();
  }, [searchValue]);

  const handleClear = () => {
    setSearchValue('');
    setSearchResult([]);
    inputRef.current.focus();
  };

  const handleHideResult = () => {
    setShowResult(false);
  };

  const handleChange = (e) => {
    const searchValue = e.target.value;

    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue);
    }
  };

  const handleSearch = () => {
    if (searchValue.trim() !== '') {
      window.location.href = `/allProducts?search=${encodeURIComponent(searchValue)}`;
    }
  };

  const inputRef = useRef();

  return (
    <div>
      <HeadlessTippy
        interactive
        visible={showResult && searchResult && searchResult.length > 0}
        render={(attrs) => (
          <div className={cx('search-result')} tabIndex="-1" {...attrs}>
            <div className={cx('wrapper')}>
              <h4 className={cx('search-title')}>Book</h4>
              {searchResult &&
                searchResult.map((result) => {
                  return (
                    <Link className={cx('item-search')} to={`/detailItem/${result.id}`}>
                      <img className={cx('image')} src={result.image} alt="Book" />
                      <div className={cx('info')}>
                        <h4 className={cx('name')}>
                          <span>{result.name}</span>
                        </h4>
                        <span className={cx('author')}>{result.Brand.name}</span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
        onClickOutside={handleHideResult}
      >
        <div className={cx('search')}>
          <input
            ref={inputRef}
            value={searchValue}
            placeholder="Search Item... "
            spellCheck={false}
            onChange={handleChange}
            onFocus={() => setShowResult(true)}
          />

          <button className={cx('search-btn')} onClick={handleSearch} onMouseDown={(e) => e.preventDefault()}>
            <Icon icon="iconamoon:search-bold" />
          </button>
        </div>
      </HeadlessTippy>
    </div>
  );
}

export default Search;
