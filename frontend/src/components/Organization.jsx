import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import axios from 'axios';
import SideBar from './SideBar';

export default function Organization() {
  const [selectedCert, setSelectedCert] = useState(null);

  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const test = async () => {
      const accessToken = sessionStorage.getItem('acT'); // Assuming 'rfT' holds the access token
      console.log(accessToken);

      // Set the token in the Authorization header as "Bearer YOUR_TOKEN"
      const headers = { Authorization: `Bearer ${accessToken}` };

      const res = await axios({
        method: 'post',
        headers: headers,
        url: 'http://localhost:3000/api/organization/getCertificates'
      });

      console.log(res);
      if (res.data.success) setCertificates(res.data.success);
    };
    test();
  }, []);

  const cards = certificates.map(({ certificateData: { certTitle, eventTitle }, certificateId }, index) => {
    console.log(certTitle, eventTitle, certificateId);
    return <Card title={certTitle} eventTitle={eventTitle} key={certificateId} certId={certificateId} setSelectedCert={setSelectedCert} />;
  });
  console.log(cards);

  return (
    <div className="flex">
      <SideBar active="certificates" />
      <div className="flex flex-col  w-4/5">
        <Nav />
        <div className="bg-neutral flex-grow ">
          <Modal id={selectedCert} />
          <div className="flex p-5  justify-start ">{cards}</div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, eventTitle, certId, setSelectedCert }) {
  const handleClick = (e) => {
    e.preventDefault();
    setSelectedCert(e.target.value);
    document.getElementById('my_modal_5').showModal();
    console.log(e.target.value);
  };

  return (
    // <div className="m-5 rounded-lg w-3/12 h-5">
    <div className="bg-white p-6 m-5 w-3/12">
      <h3 className="mt-4 text-lg font-medium text-gray-900">{eventTitle}</h3>
      <p className="my-2 text-sm text-gray-700">{title}</p>
      <button className="bg-base-100 w-full rounded  p-4 text-sm font-medium" value={certId} onClick={handleClick}>
        Assign
      </button>
    </div>
    // {/* </div> */}
  );
}

function Modal({ id }) {
  const [data, setData] = useState({ id: id, userName: '' });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value, id: id };
    });
    console.log(data);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    const accessToken = sessionStorage.getItem('acT'); // Assuming 'rfT' holds the access token
    // Set the token in the Authorization header as "Bearer YOUR_TOKEN"
    const headers = { Authorization: `Bearer ${accessToken}` };
    console.log(data);
    const res = await axios({
      method: 'post',
      headers: headers,
      url: 'http://localhost:3000/api/organization/assignCert',
      data
    });

    console.log(res);
  };

  return (
    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-md">Assign Certificate with ID :</h3>
        <code className="bg-gray-500 p-1 my-2 rounded-md">{id}</code>
        <p className="py-4">
          <label
            htmlFor="Username"
            className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
          >
            <input
              type="text"
              id="Username"
              name="userName"
              className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
              placeholder="Username"
              value={data.userName}
              onChange={handleChange}
            />

            <span className="pointer-events-none absolute bg-base-100 start-2.5 top-0 -translate-y-1/2  p-0.5 text-xs  transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
              Username
            </span>
          </label>
        </p>
        <div className="flex justify-between">
          <div className="modal-action">
            <form onSubmit={handleAssign}>
              <input type="submit" className="btn" value="Assign" />
            </form>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <input type="submit" className="btn" value="Close" />
            </form>
          </div>
        </div>
      </div>
    </dialog>
    // <div className="rounded-2xl w-2/5 absolute m-5 border border-blue-100 bg-white p-4 shadow-lg sm:p-6 lg:p-8" role="alert">
    //   <p className="mt-4 text-gray-500">
    //     <label
    //       htmlFor="Username"
    //       className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
    //     >
    //       <input
    //         type="text"
    //         id="Username"
    //         className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
    //         placeholder="Username"
    //       />

    //       <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
    //         Username
    //       </span>
    //     </label>
    //   </p>

    //   <div className="mt-6 sm:flex sm:gap-4">
    //     <input className="btn" placeholder="Assign" />
    //   </div>
    // </div>
  );
}
