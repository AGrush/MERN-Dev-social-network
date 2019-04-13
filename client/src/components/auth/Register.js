import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
//import { isError } from "util";

class Register extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  //we used componentWillReceiveProps to map the props that came from the reducer to the state
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    //to be able to redirect to login if this registration function is successful, we pass this.props.history along to the action where it will fire last thing.
    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    //we used componentWillReceiveProps to map the props that came from the reducer to the state
    //destructuring, pull errors out
    const { errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your DevNetwork account</p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    //classnames module.......default classnames
                    className={classnames("form-control form-control-lg", {
                      //check validation/register (this is where we created errors.name)
                      //is-invalid will only exist here if errors.name = true
                      "is-invalid": errors.name
                    })}
                    placeholder="Name"
                    onChange={this.onChange}
                    value={this.state.name}
                    name="name"
                  />

                  {//invalid-feedback is a special class that only appears when there is an "is-invalid" property in an input, and we only show that if there is an errors.name object
                  errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.email
                    })}
                    placeholder="Email Address"
                    onChange={this.onChange}
                    value={this.state.email}
                    name="email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                  <small className="form-text text-muted">
                    This site uses Gravatar so if you want a profile image, use
                    a Gravatar email
                  </small>
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.password
                    })}
                    placeholder="Password"
                    onChange={this.onChange}
                    value={this.state.password}
                    name="password"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames("form-control form-control-lg", {
                      "is-invalid": errors.password2
                    })}
                    placeholder="Confirm Password"
                    onChange={this.onChange}
                    value={this.state.password2}
                    name="password2"
                  />
                  {errors.password2 && (
                    <div className="invalid-feedback">{errors.password2}</div>
                  )}
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//map all of our prop types
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  //this comes from the root reducer
  auth: state.auth,
  errors: state.errors
});

//prettier-ignore
//The connect() function connects a React component to a Redux store.
//function connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)
//withRouter here is so that we are able to redirect from an Action.
export default connect(mapStateToProps,{ registerUser })(withRouter(Register));
