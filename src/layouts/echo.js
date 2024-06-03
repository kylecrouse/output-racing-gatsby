import * as React from "react";
import "./layout.scss";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Layout = ({ pageContext, uri, children }) => {
  React.useEffect(() => {
    document.documentElement.style.setProperty("--highlight-color", "#ffc26f");
    document.documentElement.style.setProperty("--primary-color", "#884a39");
    document.documentElement.style.setProperty(
      "--secondary-color",
      "hsl(13, 41%, 28%)"
    );
    document.documentElement.style.setProperty(
      "--highlight-opposite-color",
      "#f9e0bb"
    );
  }, []);
  return (
    <>
      <Navbar series={pageContext.seriesName} page={uri.split("/")[2]} />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
