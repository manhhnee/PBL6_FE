import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';

import styles from './AutoComplete.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function AutoComplete({ setParentInputValue }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const API_KEY = 'GS65AY8rHZnAKAMvfwP8tZvMNaszJrCS1bZM6NYg';
  const API_URL = 'https://rsapi.goong.io/Place/AutoComplete';

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    setParentInputValue(value);
    if (value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const formattedAddress = suggestion.description;
    setParentInputValue(formattedAddress);
    setInputValue(formattedAddress);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(API_URL, {
          params: {
            api_key: API_KEY,
            input: inputValue,
          },
        });
        setSuggestions(response.data.predictions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    if (inputValue.length > 0) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.autocomplete')) return;
      setSuggestions([]);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={cx('input-wrapper')}>
      <div className={cx('icon')}>
        <FontAwesomeIcon icon={faLocationDot} />
      </div>
      <input
        className={cx('input')}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter a location"
      />
      {showSuggestions && (
        <ul>
          {suggestions &&
            suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion.description.replace(/,/g, ' ')}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default AutoComplete;
