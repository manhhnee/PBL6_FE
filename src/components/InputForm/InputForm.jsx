import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './InputForm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function InputForm({ placeholder, leftIcon, type, value, setValue, name, className, readOnly, error }) {
  let classes = cx('wrapper', { [className]: className }, { error: error });
  return (
    <div className={classes}>
      <div className={cx('icon')}>{leftIcon && <FontAwesomeIcon icon={leftIcon}></FontAwesomeIcon>}</div>
      <input
        readOnly={readOnly}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue((prev) => ({ ...prev, [name]: e.target.value }))}
      />
    </div>
  );
}

InputForm.protoTypes = {
  placeholder: PropTypes.string,
  leftIcon: PropTypes.node,
  type: PropTypes.node.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.node,
  name: PropTypes.string,
  className: PropTypes.node,
};

export default InputForm;
