/**
 * Component to render the first 5 repos of a given github username using the github API.
 *
 * props passed down from parent:
 * username={profile.githubusername}
 *
 */

import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class ProfileGithub extends Component {
  constructor(props) {
    super(props);

    //api variables
    this.state = {
      clientId: "a27cbb5b38d220d655f6",
      clientSecret: "ef4af1fd6dca8a38e80354387a1f80d720f83754",
      //number of repositories per page
      count: 5,
      //sort by date
      sort: "created: asc",
      repos: []
    };
  }

  //when the page loads get the list of repos using the right GitHub API endpoint and set it to the repos state
  componentDidMount() {
    const { username } = this.props;
    const { count, sort, clientId, clientSecret } = this.state;
    fetch(
      `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
    ) //with fetch unlike axios we have to map it to json
      .then(res => res.json())
      .then(data => {
        //if we leave the page before the fetch returns a response don't set state i.e. if the div below doesn't exist, then don't attempt to set state to a state object that doesn't exist.
        if (this.refs.myRef) {
          this.setState({ repos: data });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    const { repos } = this.state;
    //map over the repos objects from the github response and create a list, add all of that into a variable.
    const repoItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <Link to={repo.html_url} className="text-info" target="_blank">
                {repo.name}
              </Link>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-success">
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ));
    //render the mapped list from above variable
    return (
      <div ref="myRef">
        <hr />
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    );
  }
}

//the prop we passed down the component tree
ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired
};

export default ProfileGithub;
