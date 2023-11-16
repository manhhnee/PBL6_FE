import classNames from 'classnames/bind';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { useEffect, useState } from 'react';

import InputForm from '~/components/InputForm';
import styles from './Revenue.module.scss';
import moment from 'moment';

const cx = classNames.bind(styles);

function Revenue() {
  function getJwtFromCookie() {
    //lấy token được lưu trong cookie ra
    const name = 'token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return '';
  }

  const [numOfProduct, setNumberOfProduct] = useState();
  const [revenueYear, setRevenueYear] = useState();
  const [profitYear, setProfitYear] = useState();
  const [topProduct, setTopProduct] = useState([]);
  const [potentialCustomer, setPotentialCustomer] = useState({});

  const [payload, setPayload] = useState({
    fromDate: '',
    toDate: '',
  });

  const [data, setData] = useState([]);

  function formatCurrency(number) {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
    return formatter.format(number);
  }

  useEffect(() => {
    const fetchApiRevenue = async (fromDate, toDate) => {
      const response = await axios.get('http://localhost:5000/api/order/revenue', {
        params: {
          dateMin: fromDate,
          dateMax: toDate,
        },
        headers: {
          Authorization: `Bearer ${getJwtFromCookie()}`,
        },
      });
      const formattedData = response.data.chartRevenue.map((item) => ({
        revenue_date: moment(item.revenue_date).format('DD-MM-YYYY'),
        revenue: item.revenue,
        profit: item.profit,
      }));
      setData(formattedData);
      console.log(response.data.chartRevenue);
    };

    const fetchApiRevenueOfYear = async () => {
      const response = await axios.get('http://localhost:5000/api/order/revenueOfYear', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getJwtFromCookie()}`,
        },
      });
      setNumberOfProduct(response.data.NumberOfProducts);
      setRevenueYear(response.data.RevenueofYear);
      setProfitYear(response.data.profitOfYear);
      setTopProduct(response.data.TopProduct);
      setPotentialCustomer(response.data.potentialCustomer);
    };

    fetchApiRevenueOfYear();
    fetchApiRevenue(payload.fromDate, payload.toDate);
  }, [payload.fromDate, payload.toDate]);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('revenue-field')}>
        <div className={cx('header1')}>Sales order statistics</div>

        <div className={cx('date-field')}>
          <div className={cx('date')}>
            <span className={cx('title')}>Date from</span>
            <InputForm
              type="date"
              name={'fromDate'}
              value={payload.fromDate}
              setValue={setPayload}
              className={cx('input')}
            ></InputForm>
          </div>
          <div className={cx('date')}>
            <span className={cx('title')}>Date to</span>
            <InputForm
              type="date"
              name={'toDate'}
              value={payload.toDate}
              setValue={setPayload}
              className={cx('input')}
            ></InputForm>
          </div>
        </div>
        <div className={cx('chart')}>
          <BarChart width={1220} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="revenue_date" />
            <YAxis />
            <Tooltip />
            <Legend
              iconType="circle" // Kiểu biểu tượng chú thích (circle, plainline, square, rectangle, diamond, triangle, wye)
              align="center" // Vị trí chú thích (center, left, right)
              iconSize={14} // Căn chỉnh theo chiều dọc (top, middle, bottom)
            />
            <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
            <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
          </BarChart>
        </div>
      </div>
      <div className={cx('revenue-field')}>
        <div className={cx('header1')}>General statistics for a year</div>
        <div className={cx('content')}>
          <div className={cx('Top10')}>
            <div className={cx('header')}>Top 10 best-selling products of the year</div>
            <ul className={cx('products')}>
              {topProduct &&
                topProduct.map((product, index) => {
                  const productNumber = index + 1;
                  return (
                    <li key={product.id} className={cx('product-item')}>
                      {productNumber}. {product.product_name} with{' '}
                      <span className={cx('high-light')}> {product.total_sold} product</span>
                    </li>
                  );
                })}
            </ul>
          </div>

          <div className={cx('BestCustomer')}>
            <div className={cx('header')}>Potential customers</div>
            <span className={cx('name')}>
              {potentialCustomer && potentialCustomer.FirstName + ' ' + potentialCustomer.LastName}
            </span>
            <span className={cx('number')}>{potentialCustomer.total_purchases} purchased product</span>
          </div>
          <div className={cx('revenue')}>
            <div className={cx('sold-product')}>
              <div className={cx('header')}>Total number of products sold</div>
              <div className={cx('number')}>{numOfProduct && numOfProduct}</div>
            </div>
            <div className={cx('total-revenue')}>
              <div className={cx('header')}>Total revenue for the year</div>
              <div className={cx('number')}>{revenueYear && formatCurrency(revenueYear)}</div>
            </div>
            {/* <div className={cx('total-revenue')}>
              <div className={cx('header')}>Total profit for the year</div>
              <div className={cx('number')}>{profitYear && formatCurrency(profitYear)}</div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Revenue;
