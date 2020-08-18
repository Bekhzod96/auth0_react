import React, { Component } from 'react';

class Courses extends Component {
  state = {
    courses: [],
  };

  componentDidMount() {
    fetch('/courses', {
      headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Network response was not OK');
      })
      .then((res) => {
        this.setState({ courses: res.courses });
      })
      .catch((err) => {
        this.setState({ courses: err.courses });
      });

    fetch('/admin', {
      headers: { Authorization: `Bearer ${this.props.auth.getAccessToken()}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Network response was not OK');
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
  render() {
    return (
      <ul>
        {this.state.courses.map((course) => {
          return <li key={course.id}>{course.title}</li>;
        })}
      </ul>
    );
  }
}

export default Courses;
