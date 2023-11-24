import { useState } from 'react';
import Nav from './Nav';
import SideBar from './SideBar';
import axios from 'axios';

export default function GenrateCertificate() {
  const [certData, setCertData] = useState({ eventTitle: '', certTitle: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCertData((prev) => {
      return { ...prev, [name]: value };
    });
    console.log(certData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = sessionStorage.getItem('acT'); // Assuming 'rfT' holds the access token
    console.log(accessToken);

    // Set the token in the Authorization header as "Bearer YOUR_TOKEN"
    const headers = { Authorization: `Bearer ${accessToken}` };

    const res = await axios({
      method: 'post',
      headers: headers,
      url: 'http://localhost:3000/api/organization/genCert',
      data: certData
    });

    console.log(res);
  };

  return (
    <div className="flex">
      <SideBar active="genrateCertificate" />
      <div className="flex flex-col  w-4/5">
        <Nav />
        <div className="bg-neutral flex-grow p-6">
          <form onSubmit={handleSubmit} className="w-1/2 h-1/2 p-10 flex flex-col justify-evenly">
            <label
              htmlFor="eventTitle"
              className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <input
                type="text"
                id="eventTitle"
                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                name="eventTitle"
                value={certData.eventTitle}
                onChange={handleChange}
                placeholder="Event Title"
              />

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-neutral  p-0.5 text-xs  transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Event Title
              </span>
            </label>
            <label
              htmlFor="certificateTitle"
              className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <input
                type="text"
                id="certificateTitle"
                className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                name="certTitle"
                value={certData.certTitle}
                onChange={handleChange}
                placeholder="Certificate Title"
              />

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-neutral  p-0.5 text-xs  transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Certificate Title
              </span>
            </label>
            <input type="submit" className="btn bg-black  m-4 w-10/12 " value="Genrate" />
          </form>
        </div>
      </div>
    </div>
  );
}
