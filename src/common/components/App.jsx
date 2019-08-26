import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

class App extends React.Component {
  render() {
    return (
      <div>
        test
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect()(App);
