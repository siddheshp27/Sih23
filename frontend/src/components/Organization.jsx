import React, { useState } from 'react';
import Nav from './Nav';
import axios from 'axios';
import SideBar from './SideBar';

export default function Organization() {
  const clickHandle = (e) => {
    e.preventDefault();

    window.location.href = `http://localhost:5173/generate`;

    // const accessToken = localStorage.getItem('acT'); // Assuming 'rfT' holds the access token
    // console.log(accessToken);

    // // Set the token in the Authorization header as "Bearer YOUR_TOKEN"
    // const headers = { Authorization: `Bearer ${accessToken}` };

    // axios({
    //   method: 'post',
    //   headers: headers,
    //   url: 'http://localhost:3000/api/auth/registerOrg',
    //   data: orgData
    // });

    // console.log(orgData);
  };

  const changeHandle = (e) => {
    e.preventDefault();
    setOrgData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      };
    });
  };

  return (
    <div className="flex">
      <SideBar active="certificates" />
      <div className="flex flex-col  w-4/5">
        <Nav />
        <div className="bg-neutral  flex-grow "></div>
      </div>
    </div>
  );
}
