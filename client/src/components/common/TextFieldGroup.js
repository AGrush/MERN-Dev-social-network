/**
 * A text input component that accepts props and we can reuse in our forms
 *
 * Parent: Auth, AddEducation, AddExperience, CreateProfile, EditProfile
 *
 * props passed down from parent:
 * see below
 */

import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

//functional component so we pass props to it
const TextFieldGroup = ({
  name,
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  disabled
}) => {
  return (
    <div className="form-group">
      <input
        type={type}
        className={classnames("form-control form-control-lg", {
          "is-invalid": error
        })}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

//always use proptypes when handling props
TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string
};

//if we don't pass it in it will be the default
TextFieldGroup.defaultProps = {
  type: "text"
};

export default TextFieldGroup;
