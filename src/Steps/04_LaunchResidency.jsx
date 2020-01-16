import React from 'react';
import PropTypes from 'prop-types';
import { CogsIcon } from '@patternfly/react-icons';
import {
  Progress,
  ProgressSize,
  ProgressMeasureLocation
} from '@patternfly/react-core';

const propTypes = {
  onClose: PropTypes.func.isRequired
};

class LaunchResidency extends React.Component {
  constructor(props) {
    super(props);
    this.state = { percent: 0 };
  }

  tick() {
    if (this.state.percent < 100) {
      this.setState(prevState => ({
        percent: prevState.percent + 20
      }));
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { percent } = this.state;
    return (
      <div className="pf-l-bullseye">
        <div className="pf-c-empty-state pf-m-lg">
          <CogsIcon
            size="xl"
          />
          <h1 className="pf-c-title pf-m-lg">
            {percent === 100 ? 'Cluster Configuration Complete' : 'Spinning Up Residency Cluster'}
          </h1>
          <div className="pf-c-empty-state__body">
            <Progress
              measureLocation={ProgressMeasureLocation.inside}
              value={percent}
              size={ProgressSize.lg}
            />
          </div>
          <div className="pf-c-empty-state__body">
            <h3>
              We are creating your residency cluster with this information. This might take a second. You may want to get a <span role="img" aria-label="coffee emoji">☕</span>
            </h3>
          </div>
          <div className="pf-c-empty-state__secondary">
            <button
              className={percent === 100 ? 'pf-c-button pf-m-primary' : 'pf-c-button pf-m-link'}
              onClick={this.props.onClose}
            >
              {percent === 100 ? 'View' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

LaunchResidency.propTypes = propTypes;

export default LaunchResidency;
