import React from 'react';
import { CogsIcon } from '@patternfly/react-icons';

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
          <div className="pf-c-progress pf-m-singleline">
              <div className="pf-c-progress__description" />
              <div
                className="pf-c-progress__status"
                aria-hidden="true"
              >
                <span className="pf-c-progress__measure">
                  {percent}%
                </span>
              </div>
              <div
                className="pf-c-progress__bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={percent}
                aria-describedby="progress-singleline-example-description"
              >
                <div
                  className="pf-c-progress__indicator"
                  style={{
                    width: `${percent}%`
                  }}
                />
              </div>
            </div>
          </div>
          <div className="pf-c-empty-state__body">
            <h3>
              We are creating your residency cluster with this information. This might take a second. You may want to get a <span role="img" aria-label="coffee emoji">☕</span>
            </h3>
          </div>
          <div className="pf-c-empty-state__secondary">
            <button
              className={percent === 100 ? 'pf-c-button pf-m-primary' : 'pf-c-button pf-m-link'}
            >
              {percent === 100 ? 'View' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default LaunchResidency;
