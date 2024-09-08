
import Header from "./Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";

const Layout = ({ children }) => {


 
  return (
    <>  
      <Header />
       <div className="">
       <ToastContainer />
        {children}
       </div>
       <Footer/>
    </>
  );
};

export default Layout;
