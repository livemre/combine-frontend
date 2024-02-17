import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/admin/Register";
import Login from "./pages/admin/Login";
import PublisherDashboard from "./pages/admin/PublisherDashboard";
import AddCombine from "./pages/admin/AddCombine";
import AddSingleMatch from "./pages/admin/AddSingleMatch";
import AllPredictions from "./pages/admin/AllPredictions";
import { createContext, useState } from "react";
import AllCombines from "./pages/admin/AllCombines";
import Home from "./pages/Home";
import Timeline from "./pages/Timeline";
import Publisher from "./pages/Publisher";
import UserRegister from "./pages/UserRegister";
import UserLogin from "./pages/UserLogin";
import PurchasedCombines from "./components/user/PurchasedCombines";
import FavoritedCombines from "./components/user/FavoritedCombines";
import Transactions from "./pages/Transactions";
import Profile from "./components/user/Profile";
import ProfileAdmin from "./pages/admin/Profile";
import Transfers from "./pages/admin/Transfers";
import UserPasswordReset from "./pages/UserPasswordReset";
import DrawerMain from "./components/DrawerMain";
import Settings from "./pages/admin/Settings";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import Tos from "./pages/Tos";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import FollowedPublishers from "./components/user/FollowedPublishers";




export const MainContext = createContext("test");

function App() {
  const [publisher_id, setPublisherId] = useState(null);
  const [publisherName, setPublisherName] = useState(null);
  const [userID, setUserID] = useState(null);
  const [userRole, setUserRole] = useState(2);
  const [credit, setCredit] = useState();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken,setRefreshToken] = useState(null);
  const [pat,setPat] = useState(null);
  const [prt, setPrt] = useState(null);

  return (
   
    <div className="App">
      <MainContext.Provider
        value={{
          publisher_id,
          setPublisherId,
          publisherName,
          setPublisherName,
          userID,
          setUserID,
          userRole,
          setUserRole,
          credit,
          setCredit,
          showDepositModal,
          setShowDepositModal,
          accessToken,
          setAccessToken,
          refreshToken,
          setRefreshToken,
          pat,
          setPat,
          prt,
          setPrt

        }}
      >
        <BrowserRouter>
       
          <DrawerMain />
          <div style={{ height: "80px" }}></div>
   
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/timeline" element={<Timeline />} />
          
            <Route
              path="/publisher/:id/:publisher_name"
              element={<Publisher />}
            />
            <Route path="/register/" element={<UserRegister />} />
            <Route path="/login/" element={<UserLogin />} />
            <Route
              path="/purchased-combines/"
              element={<PurchasedCombines />}
            />
            <Route
              path="/favorited-combines/"
              element={<FavoritedCombines />}
            />
            <Route
              path="/followed-publishers/"
              element={<FollowedPublishers />}
            />
            <Route path="/transactions/" element={<Transactions />} />
            <Route path="/profile/" element={<Profile />} />
            <Route path="/user-password-reset/" element={<UserPasswordReset />} />
            <Route path="/contact/" element={<Contact />} />
            <Route path="/terms-of-service/" element={<Tos />} />
            <Route path="/privacy-policy/" element={<PrivacyPolicy />} />

            <Route path="/admin/" element={<Login />} />
            <Route path="/admin/register" element={<Register />} />
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/publisher-dashboard"
              element={<PublisherDashboard />}
            />
            <Route path="/admin/add-combine" element={<AddCombine />} />
            <Route
              path="/admin/add-single-match"
              element={<AddSingleMatch />}
            />
            <Route path="/admin/predictions" element={<AllPredictions />} />
            <Route path="/admin/combines" element={<AllCombines />} />
            <Route path="/admin/profile" element={<ProfileAdmin />} />
            <Route path="/admin/transfers" element={<Transfers />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Routes>
       
   
          <Footer />
  
        </BrowserRouter>
      </MainContext.Provider>
    </div>
    
  );
}

export default App;
