import classNames from 'classnames/bind';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { useEffect, useState } from 'react';

import InputForm from '~/components/InputForm';
import styles from './Revenue.module.scss';
import moment from 'moment';
import GetToken from '~/Token/GetToken';

const cx = classNames.bind(styles);

function Revenue() {
  const [topCustomer, setTopCustomer] = useState([]);
  const [topShoes, setTopShoes] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalProfit, setTotalProfit] = useState();

  const [payload, setPayload] = useState({
    fromDate: '2023-01-01',
    toDate: '2023-12-12',
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
      const response = await axios.get('http://localhost:4000/api/revenue', {
        params: {
          startDate: fromDate,
          endDate: toDate,
        },
        headers: {
          Authorization: `Bearer ${GetToken()}`,
        },
      });
      const formattedData = response.data.result.resultByDay.map((item) => ({
        revenue_date: moment(item.date).format('DD-MM-YYYY'),
        revenue: item.totalRevenue,
        profit: item.profit,
      }));

      setTotalRevenue(response.data.result.totalRevenue);
      setTotalProfit(response.data.result.profitRevenue);
      setData(formattedData);
    };

    const fetchAPICustomers = async (fromDate, toDate) => {
      const response = await axios.get('http://localhost:4000/api/revenue/customer', {
        params: {
          startDate: fromDate,
          endDate: toDate,
        },
        headers: {
          Authorization: `Bearer ${GetToken()}`,
        },
      });
      setTopCustomer(response.data.result.customers);
    };
    const fetchAPIShoes = async (fromDate, toDate) => {
      const response = await axios.get('http://localhost:4000/api/revenue/product', {
        params: {
          startDate: fromDate,
          endDate: toDate,
        },
        headers: {
          Authorization: `Bearer ${GetToken()}`,
        },
      });
      setTopShoes(response.data.result.products);
    };

    fetchApiRevenue(payload.fromDate, payload.toDate);
    fetchAPIShoes(payload.fromDate, payload.toDate);
    fetchAPICustomers(payload.fromDate, payload.toDate);
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
            <div className={cx('header')}>Top 20 best-selling customer of the year</div>
            <ul className={cx('products')}>
              {topCustomer &&
                topCustomer.map((product, index) => {
                  const customerNumber = index + 1;
                  return (
                    product && (
                      <li key={product.id} className={cx('product-item')}>
                        {customerNumber}. {product.fullName} with{' '}
                        <span className={cx('high-light')}> {formatCurrency(product.totalPrice)} total price</span>
                      </li>
                    )
                  );
                })}
            </ul>
          </div>
          <div className={cx('BestCustomer')}>
            <div className={cx('header')}>TotalRevenue</div>
            <span className={cx('number')}>{totalRevenue && formatCurrency(totalRevenue)} total price</span>
            <div className={cx('header')}>TotalProfit</div>
            <span className={cx('number')}>{totalProfit && formatCurrency(totalProfit)} total price</span>
          </div>
          <div className={cx('Top10')}>
            <div className={cx('header')}>Top 20 best-selling shoes of the year</div>
            <ul className={cx('products')}>
              {topShoes &&
                topShoes.map((product, index) => {
                  const customerNumber = index + 1;
                  return (
                    <li key={product.id} className={cx('product-item')}>
                      {customerNumber}. {product.name} with{' '}
                      <span className={cx('high-light')}> {product.quantity} product</span>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Revenue;
