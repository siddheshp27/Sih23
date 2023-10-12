import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

const Register = () => {
  let [userData, setUserData] = useState({
    photo: 'https://myfirewallbucket.s3.ap-south-1.amazonaws.com/8799pp',
    name: 'Siddhesh Bhagwan Patil',
    userName: '8799',
    gender: 'M',
    dob: '27-03-2003'
  });
  const [searchParams] = useSearchParams();
  console.log(searchParams);
  const Uid = searchParams.get('id');

  useEffect(() => {
    const reqToAxios = async () => {
      const response = await axios.post('http://localhost:3000/api/auth/getAadhar', { dId: Uid });
      console.log(response.data);
      setUserData(response.data);
    };
    // if (Uid) reqToAxios();
  }, []);

  console.log(searchParams);
  return (
    <div>
      {userData && (
        <div className=" bg-white h-screen ">
          ``
          <div className="flex border-black border-2">
            <div className="flex  items-center m-5 ">
              <img src={userData?.photo} className="h-32" />
            </div>
            <div className="   ">
              <form className="mt-8 grid grid-cols-6 gap-6">
                <div className="col-span-6 ">
                  <label htmlFor="Name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>

                  <input
                    type="text"
                    id="Name"
                    name="name"
                    className="mt-1 py-4 w-full rounded-sm border-double border-2 border-sky-500 text-gray-700 shadow-sm placeholder:bold text-sm px-2 placeholder:text-slate-400"
                    value={userData?.name}
                    disabled
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="Username" className="block text-sm font-medium text-gray-700">
                    UserName
                  </label>

                  <input
                    type="text"
                    id="Username"
                    name="userName"
                    className="mt-1 py-4 w-full rounded-sm border-double border-2 border-sky-500 text-gray-700 shadow-sm placeholder:bold text-sm px-2 placeholder:text-slate-400"
                    value={userData?.userName}
                    disabled
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="Gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>

                  <select
                    id="Gender"
                    name="gender"
                    value={userData?.gender}
                    className="mt-1 py-4 w-full rounded-sm border-double border-2 border-sky-500 text-gray-700 shadow-sm placeholder:bold text-sm px-2 placeholder:text-slate-400"
                    disabled
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                <div className="col-span-6">
                  <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    id="Email"
                    name="email"
                    placeholder="Enter valid email"
                    className="mt-1 py-4 w-full rounded-sm border-double border-2 border-sky-500 text-gray-700 shadow-sm placeholder:bold text-sm px-2 placeholder:text-slate-400"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>

                  <input
                    type="password"
                    id="Password"
                    name="password"
                    placeholder="Enter valid password"
                    className="mt-1 py-4 w-full rounded-sm border-double border-2 border-sky-500 text-gray-700 shadow-sm placeholder:bold text-sm px-2 placeholder:text-slate-400"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="PasswordConfirmation" className="block text-sm font-medium text-gray-700">
                    Password Confirmation
                  </label>

                  <input
                    type="password"
                    id="PasswordConfirmation"
                    name="password_confirmation"
                    placeholder="Re-enter your password"
                    className="mt-1 py-4 w-full rounded-sm border-double border-2 border-sky-500 text-gray-700 shadow-sm placeholder:bold text-sm px-2 placeholder:text-slate-400"
                  />
                </div>
                <div className="col-span-6 flex items-center flex-row justify-between">
                  <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
