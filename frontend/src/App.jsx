import { useRef, useReducer, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { MyContext } from './MyContext';
import Home from './components/Home';
import Login from './components/Login';
import CertificateGenerator from './components/CertificateGenrator';
import Certificate from './components/Certificate';
import Admin from './components/Admin';
import Organization from './components/Organization';
import { ClientContext } from './MyContent';
import Register from './components/userRegistration';

function App() {
  const { loggedUserData } = useContext(ClientContext);
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
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/generate" element={<CertificateGenerator formState={formState} dispatch={dispatch} />}></Route>
        <Route path="/generated-certificate" element={<Certificate {...formState} />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/organization" element={<Organization />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
