import React, { useEffect, useState, useContext } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext';

export default function Nav() {
  const navigation = [
    { name: 'Home', href: '#' },
    { name: 'About Us', href: '#' },
    { name: 'Contact Us', href: '#' }
  ];
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const context = useContext(UserContext);
  const [accessToken, setAccessToken] = useState();
  console.log(context);
  useEffect(() => {
    console.log(pathname);
    console.log('yee');
    const acc = sessionStorage.getItem('acT');
    setAccessToken(acc);
    if (!acc) {
      if (pathname !== '/') {
        console.log('login first');
        navigate('/');
      }
    } else {
      // if(pathname === "/")
    }
  }, []);

  const handleLog = () => {
    if (accessToken) {
      console.log(accessToken);
      sessionStorage.removeItem('acT');
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return <div className="flex w-full h-16 bg-base-100"></div>;
}

{
  /* <div onClick={handleLog} className="text-sm font-semibold leading-6 text-white">
  Log {accessToken ? 'out' : 'in'} <span aria-hidden="true">&rarr;</span>
</div> */
}
