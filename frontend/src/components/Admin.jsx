import React, { useState } from 'react';
import axios from 'axios';

export default function Admin() {
  const [orgData, setOrgData] = useState({ orgId: '', orgName: '', email: '', password: '', address: '', phoneNumber: '' });
  // console.log(accessToken);

  const register = (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('acT'); // Assuming 'rfT' holds the access token
    console.log(accessToken);

    // Set the token in the Authorization header as "Bearer YOUR_TOKEN"
    const headers = { Authorization: `Bearer ${accessToken}` };

    axios({
      method: 'post',
      headers: headers,
      url: 'http://localhost:3000/api/auth/registerOrg',
      data: orgData
    });

    console.log(orgData);
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
    <div className="p-7 m-7 bg-white">
      <form onSubmit={register} className="mt-8 grid grid-cols-6 gap-6">
        <div className="col-span-6 sm:col-span-3">
          <label htmlFor="OrgId" className="block text-sm font-medium text-gray-700">
            Organization Id
          </label>

          <input
            type="text"
            id="OrgId"
            name="orgId"
            placeholder="Enter valid Organization Id"
            className="mt-1 py-4 w-full rounded-sm border-double border-2 border-sky-500 text-gray-700 shadow-sm placeholder:bold text-sm px-2 placeholder:text-slate-400"
            onChange={changeHandle}
          />
        </div>
        <div className="col-span-6 sm:col-span-3 ">
          <label htmlFor="OrgName" className="block text-sm font-medium text-gray-700">
            Organization Name
          </label>

          <input
            type="text"
            id="OrgName"
            name="orgName"
            placeholder="Enter valid Organization Name"
            className="mt-1 py-4 w-full rounded-sm border-double border-2 border-sky-500 text-gray-700 shadow-sm placeholder:bold text-sm px-2 placeholder:text-slate-400"
            onChange={changeHandle}
          />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            id="Email"
            name="email"
            placeholder="Enter valid Email"
            className="mt-1 py-4 w-full rounded-sm border-double border-2 border-sky-500 text-gray-700 shadow-sm placeholder:bold text-sm px-2 placeholder:text-slate-400"
            onChange={changeHandle}
          />
        </div>
        <div className="col-span-6 sm:col-span-3 ">
          <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
            Password
          </label>

          <input
            type="password"
            id="Password"
            name="password"
            placeholder="Enter valid password"
            className="mt-1 py-4 w-full rounded-sm border-double border-2 border-sky-500 text-gray-700 shadow-sm placeholder:bold text-sm px-2 placeholder:text-slate-400"
            onChange={changeHandle}
          />
        </div>

        <div className="col-span-6 sm:col-span-3">
          <label htmlFor="Address" className="block text-sm font-medium text-gray-700">
            Address
          </label>

          <input
            type="text"
            id="Address"
            name="address"
            placeholder="Enter valid UserName"
            className="mt-1 py-4 w-full rounded-sm border-double border-2 border-sky-500 text-gray-700 shadow-sm placeholder:bold text-sm px-2 placeholder:text-slate-400"
            onChange={changeHandle}
          />
        </div>
        <div className="col-span-6 sm:col-span-3 ">
          <label htmlFor="PhoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>

          <input
            type="text"
            id="PhoneNumber"
            name="phoneNumber"
            placeholder="Enter valid password"
            className="mt-1 py-4 w-full rounded-sm border-double border-2 border-sky-500 text-gray-700 shadow-sm placeholder:bold text-sm px-2 placeholder:text-slate-400"
            onChange={changeHandle}
          />
        </div>

        <div className="col-span-6  flex items-center flex-row justify-between">
          <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
            Register Organization
          </button>
        </div>
      </form>
    </div>
  );
}
