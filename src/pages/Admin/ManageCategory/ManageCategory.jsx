import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { Flip, ToastContainer, toast } from 'react-toastify';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';

import Image from '~/components/Image';
import Button from '~/components/Button';
import InputForm from '~/components/InputForm';
import Popup from '~/components/Popup';
import styles from './ManageCategory.module.scss';
import axios from 'axios';
import GetToken from '~/Token/GetToken';

const cx = classNames.bind(styles);

function ManageCategory() {
  const [listCategory, setListCategory] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [avatar, setAvatar] = useState([]);
  const [image, setImage] = useState([]);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [payload, setPayload] = useState({
    name: '',
    image: '',
  });

  useEffect(() => {
    const fetchApiCategory = async () => {
      const response = await axios.get(`http://localhost:4000/api/category`, {
        headers: {
          Authorization: `Bearer ${GetToken()}`,
        },
      });
      console.log(response.data.categories);
      setListCategory(response.data.categories);
    };
    fetchApiCategory();
  }, []);

  const handleAddCategory = async (name, image) => {
    await axios
      .post(
        'http://localhost:4000/api/category/add',
        {
          name: name,
          image: image,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${GetToken()}`,
          },
        },
      )
      .then((res) => {
        toast.success(res.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const handleDeleteCategory = async () => {
    await axios
      .delete(`http://localhost:4000/api/category/delele/${selectedCategoryId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GetToken()}`,
        },
      })
      .then((res) => {
        toast.success(res.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const modalAnimation1 = useSpring({
    opacity: isModalOpen1 ? 1 : 0,
    transform: isModalOpen1 ? 'translateY(0)' : 'translateY(-100%)',
  });
  const modalAnimation2 = useSpring({
    opacity: isModalOpen2 ? 1 : 0,
    transform: isModalOpen2 ? 'translateY(0)' : 'translateY(-100%)',
  });

  const openModal1 = (categoryId, categoryName, imgUrl) => {
    setSelectedCategoryId(categoryId);
    setIsModalOpen1(true);
    setPayload((prevState) => ({
      ...prevState,
      name: categoryName,
      image: imgUrl,
    }));
  };

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };

  const openModal2 = () => {
    setIsModalOpen2(true);
  };

  const closeModal2 = () => {
    setIsModalOpen2(false);
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
    };

    reader.readAsDataURL(file);
    setAvatar(e.target.files[0]);
  };

  return (
    <div className={cx('wrapper')}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        transition={Flip}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className={cx('btn')}>
        <Button onClick={() => openModal2()} blue leftIcon={<FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>}>
          Add category
        </Button>
      </div>

      <Popup isOpen={isModalOpen2} onRequestClose={() => closeModal2()} width={'450px'} height={'450px'}>
        <animated.div style={modalAnimation2}>
          <h2>Add category</h2>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Category name</div>
            <InputForm
              placeholder={listCategory.name}
              type="text"
              value={payload.name}
              setValue={setPayload}
              name={'name'}
              className={cx('input')}
              leftIcon={faBookmark}
            />
          </div>
          <div className={cx('header')}>Image of category</div>
          <div className={cx('input-field')}>
            <div className={cx('upload-field')}>
              {avatar && <img src={image} className={cx('image')} alt="Avatar" />}
              <label htmlFor="file-upload" className={cx('upload-btn')}>
                <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                <input id="file-upload" type="file" onChange={handleImgChange}></input>
              </label>
            </div>
          </div>
          <div className={cx('options')}>
            <Button onClick={() => handleAddCategory(payload.name, avatar)} outline>
              Confirm
            </Button>
          </div>
        </animated.div>
      </Popup>

      <div className={cx('category-list')}>
        {listCategory &&
          listCategory.map((category) => {
            return (
              <div
                className={cx('category')}
                onClick={() => openModal1(category.id, category.name, category.image)}
                key={category.id}
              >
                <Image src={category.image} alt="category" className={cx('image')} />
                <span className={cx('name')}>{category.name}</span>
              </div>
            );
          })}
      </div>

      <Popup isOpen={isModalOpen1} onRequestClose={() => closeModal1()} width={'450px'} height={'450px'}>
        <animated.div style={modalAnimation1}>
          <h2>Category information</h2>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Category name</div>
            <InputForm
              placeholder={listCategory.Name}
              type="text"
              value={payload.name}
              setValue={setPayload}
              name={'name'}
              className={cx('input')}
              leftIcon={faBookmark}
            />
          </div>
          <div className={cx('header')}>Image of category</div>
          <div className={cx('input-field')}>
            <div className={cx('upload-field')}>
              {avatar && <img src={image} className={cx('image')} alt="Avatar" />}
              <label htmlFor="file-upload" className={cx('upload-btn')}>
                <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
                <input id="file-upload" type="file" onChange={handleImgChange}></input>
              </label>
            </div>
          </div>

          <div className={cx('options')}>
            <Button onClick={() => handleDeleteCategory()} primary>
              Delete category
            </Button>
          </div>
        </animated.div>
      </Popup>
    </div>
  );
}

export default ManageCategory;
