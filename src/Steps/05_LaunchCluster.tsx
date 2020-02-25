import React, { useState } from "react";
import { Alert, Button } from "@patternfly/react-core";
import axios, { AxiosError } from "axios";
import slugProperties from "../utilities/slugProperties";
import { AppSettings } from "../settings/config";

const LaunchCluster = ({ values }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setErrorResponse] = useState<AxiosError | null>(null);
  const [success, setSuccessResponse] = useState<boolean | null>(null);
  return (
    <div className="pf-l-bullseye">
      <div className="pf-c-empty-state">
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
                We are about to launch your project cluster with this
                information! Are you ready?
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
            onClick={() => {
              setErrorResponse(null);
              setIsLoading(true);
              axios({
                headers: {
                  "X-APPLICATION-NONSENSE": "sure-you-can-access-stuff-#yolo"
                },
                method: "post",
                url: `${AppSettings.backendUrl}/engagements/create`,
                data: slugProperties(values, [
                  "ocp_sub_domain",
                  "customer_name",
                  "project_name"
                ])
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
              {hasError.message}
            </Alert>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default LaunchCluster;
