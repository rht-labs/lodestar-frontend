import React, { useState } from "react";
import { Alert, Button } from "@patternfly/react-core";
import axios from "axios";

const LaunchResidency = ({ values }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setErrorResponse] = useState(null);
  const [success, setSuccessResponse] = useState(null);
  return (
    <div className="pf-l-bullseye">
      <div className="pf-c-empty-state pf-m-lg">
        {success ? (
          <span
            aria-label="thumbs up emoji"
            role="img"
            style={{ fontSize: "5rem" }}
          >
            👍🏽
          </span>
        ) : (
          <span
            aria-label="rocket emoji"
            role="img"
            style={{ fontSize: "5rem" }}
          >
            🚀
          </span>
        )}

        <div className="pf-c-empty-state__body">
          <h3>
            {!isLoading ? (
              <span>
                We are about to launch your residency cluster with this
                information.
              </span>
            ) : (
              <span>
                This might take a minute. You may want to get a
                <span role="img" aria-label="coffee emoji">
                  ☕
                </span>
              </span>
            )}
          </h3>
        </div>

        {!success ? (
          <Button
            onClick={e => {
              e.preventDefault();
              setIsLoading(true);
              axios({
                method: "post",
                url: `${process.env.REACT_APP_BACKEND_URI}/residencies`,
                data: values
              })
                .then(() => {
                  setSuccessResponse(true);
                })
                .catch(error => {
                  setErrorResponse(error);
                })
                .finally(() => {
                  setIsLoading(false);
                });
            }}
            isDisabled={isLoading}
          >
            {!isLoading ? "Let's Do It!" : "Launching..."}
          </Button>
        ) : (
          <div className="pf-c-empty-state">
            <Alert isInline title="You did it!" variant="success">
              <div>
                Your cluster should be ready soon at:
                <a
                  href={`${values.ocp_sub_domain}.rht-labs.com`}
                >{`${values.ocp_sub_domain}.rht-labs.com`}</a>
              </div>
            </Alert>
          </div>
        )}

        {hasError ? (
          <div className="pf-c-empty-state">
            <Alert isInline title="We encountered an error." variant="danger">
              {hasError.statusText}
            </Alert>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default LaunchResidency;
