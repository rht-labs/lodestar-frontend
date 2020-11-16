import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({children}) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.getElementById('main-application-content')?.scrollTo?.(0, 0);
  }, [pathname]);

  return children;
}