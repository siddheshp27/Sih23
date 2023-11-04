import { useRef, useReducer, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { MyContext } from './MyContext';
import Home from './components/Home';
import Login from './components/Login';
import CertificateGenerator from './components/CertificateGenrator';
import Certificate from './components/Certificate';
import Admin from './components/Admin';
import Organization from './components/Organization';
import { ClientContext } from './MyContent';
import { UserContext } from './userContext';
import Register from './components/userRegistration';
import User from './components/User';
import GenrateCertificate from './components/GenerateCertificate';

function App() {
  const { loggedUserData } = useContext(ClientContext);
  const [userData, setUserData] = useState({});
  // console.log(loggedUserData);
  const initialState = {
    name: 'Your Name',
    course: 'Your Course',
    dateOfConductStart: '2020-05-20',
    dateOfConductEnd: '2023-05-20',
    signature: '',
    signatureDetails: 'Signature'
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'TEXT_CHANGE':
        return { ...state, [action.field]: action.payload };

      default:
        break;
    }
  };

  const [formState, dispatch] = useReducer(reducer, initialState);
  return (
    <Router>
      <UserContext.Provider value={{ userData, setUserData }}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/admin" element={<Admin />}></Route>
          <Route path="/organization" element={<Organization />}></Route>
          <Route path="/user" element={<User />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/generate" element={<CertificateGenerator formState={formState} dispatch={dispatch} />}></Route>
          <Route path="/generated-certificate" element={<Certificate {...formState} />}></Route>
          <Route path="/genrateCertificate" element={<GenrateCertificate />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
