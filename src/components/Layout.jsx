
import Header from "./Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children }) => {


 
  return (
    <>  
      <Header />
       <div className="">

       <ToastContainer />
        {children}
       </div>
    </>
  );
};

export default Layout;
