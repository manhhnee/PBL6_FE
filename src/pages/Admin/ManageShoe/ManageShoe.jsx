import classNames from 'classnames/bind';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { faAudioDescription, faShoePrints, faMoneyBill, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useSpring, animated } from 'react-spring';
import { Flip, ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '~/components/Button/Button';
import InputForm from '~/components/InputForm/InputForm';
import Popup from '~/components/Popup/Popup';
import CustomSelect from '~/components/CustomSelect';
import GetToken from '~/Token/GetToken';
import styles from './ManageShoe.module.scss';

const cx = classNames.bind(styles);

function ManageShoe() {
  const [shoes, setShoes] = useState([]);
  const [avatar, setAvatar] = useState([]);
  const [image, setImage] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [shoeId, setShoeID] = useState();
  const [shoeIDSize, setShoeIDSize] = useState();
  const [search, setSearch] = useState('');
  const [filteredShoes, setFilteredShoes] = useState([]);
  const [payload, setPayload] = useState({
    name: '',
    category: '',
    brand: '',
    color: '',
    price: '',
    import_price: '',
    description: '',
    size: '',
    amount: '',
  });

  const [payload2, setPayload2] = useState({
    name: '',
    category: '',
    brand: '',
    color: '',
    price: '',
    import_price: '',
    description: '',
    size: '',
    amount: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    name: null,
    category: null,
    brand: null,
    color: null,
    price: null,
    import_price: null,
    description: null,
    size: null,
    amount: null,
  });

  const [errorMessages2, setErrorMessages2] = useState({
    name: null,
    category: null,
    brand: null,
    color: null,
    price: null,
    import_price: null,
    description: null,
    size: null,
    amount: null,
  });
  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!payload.name.trim()) {
      errors.name = 'Please enter shoe name';
      isValid = false;
    }

    if (!payload.description.trim()) {
      errors.description = 'Please enter a description';
      isValid = false;
    }

    if (!payload.price.toString().trim()) {
      errors.price = 'Please enter selling price';
      isValid = false;
    }

    if (!payload.publisher.trim()) {
      errors.publisher = 'Please enter publisher';
      isValid = false;
    }

    setErrorMessages(errors);

    return isValid;
  };

  const validateForm2 = () => {
    let isValid = true;
    const errors = {};

    if (!payload2.name.trim()) {
      errors.name = 'Please enter shoe name';
      isValid = false;
    }

    if (!payload2.description.trim()) {
      errors.description = 'Please enter a description';
      isValid = false;
    }

    if (!payload2.price.toString().trim()) {
      errors.price = 'Please enter selling price';
      isValid = false;
    }

    if (!payload2.publisher.trim()) {
      errors.publisher = 'Please enter publisher';
      isValid = false;
    }

    setErrorMessages2(errors);

    return isValid;
  };

  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);

  const getshoes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/shoes?limit=10000');
      setShoes(response.data.result);
      setFilteredShoes(response.data.result);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchApiDetailshoe = async (id) => {
    try {
      setIsModalOpen1(true);
      const response = await axios.get(`http://localhost:4000/api/shoes/${id}`);

      const shoe = response.data.result;

      setPayload((prevPayload) => ({
        ...prevPayload,
        name: shoe.name,
        description: shoe.description,
        amount: shoe.amount,
        color: shoe.color,
        size: shoe.size,
        category: shoe.Category.name,
        brand: shoe.Brand.name,
      }));
    } catch (e) {
      toast.error(e.message);
    }
  };

  const fetchApiCategories = async () => {
    const response = await axios.get('http://localhost:4000/api/category');
    const categoriesData = await response.data.categories;
    setCategories(categoriesData);
  };

  const fetchApiBrand = async () => {
    const response = await axios.get('http://localhost:4000/api/brand');
    const brandData = await response.data.brands;
    setBrand(brandData);
  };

  const handleAddshoe = async (idCategory, idBrand, name, price, import_price, description, color, image) => {
    if (!validateForm2()) {
      return;
    } else {
      await axios
        .post(
          'http://localhost:4000/api/shoes/add',
          {
            id_category: idCategory,
            id_brand: idBrand,
            name: name,
            price: price,
            import_price: import_price,
            description: description,
            color: color,
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
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  const handleAddShoeSize = async (size, amount) => {
    try {
      await axios
        .post(
          `http://localhost:4000/api/shoes/add_size/${shoeIDSize}`,
          {
            amount: amount,
            size: size,
          },
          {
            headers: {
              'Content-Type': 'application/json',
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
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpdateshoe = async (id, idCategory, idBrand, name, size, color, amount, description) => {
    if (!validateForm()) {
      return;
    } else {
      await axios
        .put(
          `http://localhost:4000/api/shoes/updateInfor/${id}`,
          {
            id_category: idCategory,
            id_brand: idBrand,
            name: name,
            size: size,
            color: color,
            amount: amount,
            description: description,
          },
          {
            headers: {
              'Content-Type': 'application/json',
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
    }
  };
  const handleDeleteshoe = async (id) => {
    await axios
      .delete(`http://localhost:4000/api/shoes/delete/${id}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${GetToken()}`,
        },
      })
      .then((res) => {
        toast.success(res.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((e) => {
        alert(e);
      });
  };

  useEffect(() => {
    getshoes();
    fetchApiCategories();
    fetchApiBrand();
  }, []);

  useEffect(() => {
    const result = shoes.filter((shoe) => {
      return shoe.name.toLowerCase().match(search.toLowerCase());
    });

    setFilteredShoes(result);
  }, [search, shoes]);

  const modalAnimation1 = useSpring({
    opacity: isModalOpen1 ? 1 : 0,
  });
  const modalAnimation2 = useSpring({
    opacity: isModalOpen2 ? 1 : 0,
  });
  const modalAnimation3 = useSpring({
    opacity: isModalOpen3 ? 1 : 0,
  });

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };

  const openModal2 = () => {
    setIsModalOpen2(true);
    setPayload({});
  };

  const openModal3 = () => {
    setIsModalOpen3(true);
    setPayload({});
  };

  const closeModal2 = () => {
    setIsModalOpen2(false);
  };

  const closeModal3 = () => {
    setIsModalOpen3(false);
    setShoeIDSize();
  };

  const columns = [
    {
      name: 'Shoes name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Category',
      selector: (row) => row.Category.name,
    },
    {
      name: 'Brand',
      selector: (row) => row.Brand.name,
    },
    {
      name: 'Selling price',
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: 'Import price',
      selector: (row) => row.import_price,
      sortable: true,
    },
  ];

  const handleRowClick = (row) => {
    const ShoeID = row.id;
    fetchApiDetailshoe(ShoeID);
    setShoeID(ShoeID);
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
      <DataTable
        title="Shoes list"
        columns={columns}
        data={filteredShoes}
        fixedHeader
        fixedHeaderScrollHeight="500px"
        pointerOnHover
        highlightOnHover
        pagination
        className={cx('fixed-header')}
        subHeader
        subHeaderComponent={
          <div className={cx('wrapper-header')} style={{ zIndex: 0 }}>
            <Button onClick={openModal2} leftIcon={<FontAwesomeIcon icon={faPlus} />} blue>
              Add shoe
            </Button>
            <Button onClick={openModal3} leftIcon={<FontAwesomeIcon icon={faPlus} />} blue>
              Add shoe size
            </Button>
            <input
              type="text"
              placeholder="Search for shoes here"
              className={cx('search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            ></input>
          </div>
        }
        onRowClicked={(row) => {
          handleRowClick(row);
        }}
      />

      <Popup isOpen={isModalOpen1} onRequestClose={() => closeModal1()} width={'700px'} height={'700px'}>
        <animated.div style={modalAnimation1}>
          <h2>Shoe information</h2>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Shoe name</div>
            <InputForm
              placeholder="Enter name shoe..."
              type="text"
              value={payload.name}
              setValue={setPayload}
              name={'name'}
              className={cx('input')}
              leftIcon={faShoePrints}
            />
            {errorMessages.name && <div className={cx('error-message')}>{errorMessages.name}</div>}
          </div>
          <div className={cx('header')}>Description</div>
          <div className={cx('input-field')}>
            <InputForm
              placeholder="Enter shoe description..."
              type="text"
              value={payload.description}
              setValue={setPayload}
              name={'description'}
              className={cx('input')}
              leftIcon={faAudioDescription}
            />
            {errorMessages.description && <div className={cx('error-message')}>{errorMessages.description}</div>}
          </div>
          <div className={cx('header')}>Color</div>
          <div className={cx('input-field')}>
            <InputForm
              placeholder="Enter shoe color..."
              type="text"
              value={payload.color}
              setValue={setPayload}
              name={'color'}
              className={cx('input')}
              leftIcon={faAudioDescription}
            />
            {errorMessages.color && <div className={cx('error-message')}>{errorMessages.color}</div>}
          </div>
          <div className={cx('header')}>Select category</div>
          <div className={cx('input-field')}>
            <CustomSelect data={categories} setId={setSelectedCategoryId}></CustomSelect>
            {errorMessages.category && <div className={cx('error-message')}>{errorMessages.category}</div>}
          </div>
          <div className={cx('header')}>Select brand</div>
          <div className={cx('input-field')}>
            <CustomSelect data={brand} setId={selectedBrandId}></CustomSelect>
            {errorMessages.brand && <div className={cx('error-message')}>{errorMessages.brand}</div>}
          </div>
          <div className={cx('options')}>
            <Button
              onClick={() =>
                handleUpdateshoe(
                  shoeId,
                  selectedCategoryId,
                  selectedBrandId,
                  payload.name,
                  payload.size,
                  payload.color,
                  payload.amount,
                  payload.description,
                )
              }
              outline
            >
              Change information
            </Button>
            <Button onClick={() => handleDeleteshoe(shoeId)} primary>
              Delete
            </Button>
          </div>
        </animated.div>
      </Popup>
      <Popup
        isOpen={isModalOpen2}
        onRequestClose={() => closeModal2()}
        width={'700px'}
        height={'700px'}
        className={cx('popup')}
      >
        <animated.div style={modalAnimation2}>
          <h2>shoe information</h2>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Shoe name</div>
            <InputForm
              placeholder="Enter name shoe..."
              type="text"
              value={payload.name}
              setValue={setPayload2}
              name={'name'}
              className={cx('input')}
              leftIcon={faShoePrints}
            />
            {errorMessages2.name && <div className={cx('error-message')}>{errorMessages2.name}</div>}
          </div>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Price</div>
            <InputForm
              placeholder="Enter shoe price..."
              type="text"
              value={payload.price}
              setValue={setPayload2}
              name={'price'}
              className={cx('input')}
              leftIcon={faMoneyBill}
            />
            {errorMessages2.price && <div className={cx('error-message')}>{errorMessages2.price}</div>}
          </div>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Import price</div>
            <InputForm
              placeholder="Enter shoe import price..."
              type="text"
              value={payload.import_price}
              setValue={setPayload2}
              name={'import_price'}
              className={cx('input')}
              leftIcon={faMoneyBill}
            />
            {errorMessages2.price && <div className={cx('error-message')}>{errorMessages2.price}</div>}
          </div>
          <div className={cx('header')}>Description</div>
          <div className={cx('input-field')}>
            <InputForm
              placeholder="Enter shoe description..."
              type="text"
              value={payload.description}
              setValue={setPayload2}
              name={'description'}
              className={cx('input')}
              leftIcon={faAudioDescription}
            />
            {errorMessages2.description && <div className={cx('error-message')}>{errorMessages2.description}</div>}
          </div>

          <div className={cx('header')}>Color</div>
          <div className={cx('input-field')}>
            <InputForm
              placeholder="Enter shoe color..."
              type="text"
              value={payload.color}
              setValue={setPayload2}
              name={'color'}
              className={cx('input')}
              leftIcon={faAudioDescription}
            />
            {errorMessages2.color && <div className={cx('error-message')}>{errorMessages2.color}</div>}
          </div>

          <div className={cx('header')}>Select category</div>
          <div className={cx('input-field')}>
            <CustomSelect data={categories} setId={setSelectedCategoryId}></CustomSelect>
            {errorMessages2.category && <div className={cx('error-message')}>{errorMessages2.category}</div>}
          </div>
          <div className={cx('header')}>Select brand</div>
          <div className={cx('input-field')}>
            <CustomSelect data={brand} setId={setSelectedBrandId}></CustomSelect>
            {errorMessages2.brand && <div className={cx('error-message')}>{errorMessages2.brand}</div>}
          </div>
          <div className={cx('header')}>Image of shoe</div>
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
            <Button
              onClick={() =>
                handleAddshoe(
                  selectedCategoryId,
                  selectedBrandId,
                  payload2.name,
                  payload2.price,
                  payload2.import_price,
                  payload2.description,
                  payload2.color,
                  payload2.size,
                  payload2.amount,
                  avatar,
                )
              }
              outline
            >
              Confirm
            </Button>
          </div>
        </animated.div>
      </Popup>
      <Popup
        isOpen={isModalOpen3}
        onRequestClose={() => closeModal3()}
        width={'600px'}
        height={'500px'}
        className={cx('popup')}
      >
        <animated.div style={modalAnimation3}>
          <h2>Add shoe size</h2>
          <div className={cx('header')}>Select shoes</div>
          <div className={cx('input-field')}>
            <CustomSelect data={shoes} setId={setShoeIDSize}></CustomSelect>
            {errorMessages2.category && <div className={cx('error-message')}>{errorMessages2.category}</div>}
          </div>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Shoe size</div>
            <InputForm
              placeholder="Enter size shoe..."
              type="text"
              value={payload.size}
              setValue={setPayload}
              name={'size'}
              className={cx('input')}
              leftIcon={faShoePrints}
            />
            {errorMessages.size && <div className={cx('error-message')}>{errorMessages.size}</div>}
          </div>
          <div className={cx('input-field')}>
            <div className={cx('header')}>Shoe amount</div>
            <InputForm
              placeholder="Enter amount shoe..."
              type="text"
              value={payload.amount}
              setValue={setPayload}
              name={'amount'}
              className={cx('input')}
              leftIcon={faShoePrints}
            />
            {errorMessages.amount && <div className={cx('error-message')}>{errorMessages.amount}</div>}
          </div>
          <div className={cx('options')}>
            <Button onClick={() => handleAddShoeSize(payload.size, payload.amount)} outline>
              Confirm
            </Button>
          </div>
        </animated.div>
      </Popup>
    </div>
  );
}

export default ManageShoe;
