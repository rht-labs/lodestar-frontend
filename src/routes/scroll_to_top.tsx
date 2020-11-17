import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { APPLICATION_CONTENT_CONTAINER_ID } from '../common/constants'

export default function ScrollToTop({children}) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.getElementById(APPLICATION_CONTENT_CONTAINER_ID)?.scrollTo?.(0, 0);
  }, [pathname]);

  return children;
}