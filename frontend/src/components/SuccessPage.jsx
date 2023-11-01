import React, { useEffect } from "react";

import { useSearchParams } from "react-router-dom";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams);
  const Uid = searchParams.get("id");

  const fetchData = () => {
    if (Uid) {
      sessionStorage.setItem("session id key", Uid);
    } else {
      console.log("Uid is not available. Not saving to session storage.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(searchParams);
  return (
    <div className="grid h-screen px-4 bg-white place-content-center">
      {/* <div className="text-center">
        <h1 className="font-black text-green-500 text-9xl">Success</h1>

        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          200
        </p>

        <p className="mt-4 text-gray-500">{searchParams.get("id")}</p>

        <a
          href="#"
          className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring"
        >
          Go Back Home
        </a>
      </div> */}
      <form className="mt-8 grid grid-cols-6 gap-6">
        <div className="col-span-6">
          <label
            htmlFor="Email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            type="email"
            id="Email"
            name="email"
            placeholder="Enter valid organizational email"
            className="mt-1 py-4 w-full rounded-sm border-double border-2 border-sky-500 text-gray-700 shadow-sm placeholder:bold text-sm px-2 placeholder:text-slate-400"
          />
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor="Password"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="PasswordConfirmation"
            className="block text-sm font-medium text-gray-700"
          >
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
            Login
          </button>
        </div>
        <div className="col-span-4 flex items-center flex-row justify-start">
          <p className="mt-4 text-sm text-gray-500 sm:mt-0">
            Don't have an account?
          </p>
          <button className="ml-2 text-sm text-gray-700 underline">
            Register via Digilocker
          </button>
          .
        </div>
      </form>
    </div>
  );
};

export default SuccessPage;
