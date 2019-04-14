/**
 * Individual boilerplate for each profile that will be mapped.
 *
 * Parent: Profiles.js
 *
 * props passed down from parent:
 * key={profile._id}
 * profile={profile}
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import isEmptyAG from "../../validation/is-empty";

class ProfileItem extends Component {
  render() {
    const { profile } = this.props;

    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-2">
            <img
              src={profile.user.avatar}
              alt=""
              //bootstrap circle class
              className="rounded-circle"
            />
          </div>
          <div className="col-lg-6 col-md-4 col-8">
            <h3>{profile.user.name}</h3>
            <p>
              {/* as its not required we have to check if it exists */}
              {profile.status}{" "}
              {isEmptyAG(profile.company) ? null : (
                <span>at {profile.company}</span>
              )}
            </p>
            <p>
              {/* as its not required we have to check if it exists */}
              {isEmptyAG(profile.location) ? null : (
                <span>{profile.location}</span>
              )}
            </p>
            <Link to={`/profile/${profile.handle}`} className="btn btn-info">
              View Profile
            </Link>
          </div>
          <div className="col-md-4 d-none d-md-block">
            <h4>Skill Set</h4>
            <ul className="list-group">
              {/* display the first four skills, map through them and output each as an li with the index as the key */}
              {profile.skills.slice(0, 4).map((skill, index) => (
                <li key={index} className="list-group-item">
                  <i className="fa fa-check pr-1" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
