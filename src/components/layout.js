import * as React from "react";

import MainLayout from "../layouts/main";
import OutputLayout from "../layouts/output";
import NightOwlLayout from "../layouts/nightowl";
import EchoLayout from "../layouts/echo";

const Layout = (props) => {
  const { seriesName = null } = props.pageContext;
  console.log(seriesName);
  return seriesName === "echo-dirt-series" ? (
    <EchoLayout {...props} />
  ) : seriesName === "reverb-series" ? (
    <NightOwlLayout {...props} />
  ) : seriesName === "output-series" ? (
    <OutputLayout {...props} />
  ) : (
    <MainLayout {...props} />
  );
};

export default Layout;
