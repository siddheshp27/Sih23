import { useState } from 'react';
import Nav from './Nav';
import SideBar from './SideBar';
import axios from 'axios';

export default function GenrateCertificate() {
  const [certData, setCertData] = useState({
    eventTitle: '',
    certTitle: '',
    additionalFields: [] // Array to store additional fields dynamically
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCertData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleAdditionalFieldChange = (index, e) => {
    const updatedFields = [...certData.additionalFields];
    updatedFields[index][e.target.name] = e.target.value;
    setCertData({ ...certData, additionalFields: updatedFields });
  };

  const addAdditionalField = () => {
    setCertData({
      ...certData,
      additionalFields: [...certData.additionalFields, { label: '', value: '' }]
    });
  };

  const removeAdditionalField = () => {
    const updatedFields = [...certData.additionalFields];
    updatedFields.pop();
    setCertData({ ...certData, additionalFields: updatedFields });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Constructing the requestData object
    const requestData = {
      eventTitle: certData.eventTitle,
      certTitle: certData.certTitle,
      additionalFields: certData.additionalFields.map((field) => ({
        label: field.label,
        value: field.value
      }))
    };

    console.log(requestData);
    // const accessToken = sessionStorage.getItem('acT'); // Assuming 'rfT' holds the access token

    // // Set the token in the Authorization header as "Bearer YOUR_TOKEN"
    // const headers = { Authorization: `Bearer ${accessToken}` };

    // const res = await axios({
    //   method: 'post',
    //   headers: headers,
    //   url: 'http://localhost:3000/api/organization/genCert',
    //   data: requestData
    // });

    // console.log(res);
  };

  return (
    <div className="flex">
      <SideBar active="genrateCertificate" />
      <div className="flex flex-col w-4/5">
        <div className="bg-neutral flex-grow p-6">
          <form
            onSubmit={handleSubmit}
            className="w-full h-screen
           p-10 flex flex-col justify-start overflow-y-auto"
          >
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
              className="mt-4 relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
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

              <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-neutral p-0.5 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                Certificate Title
              </span>
            </label>

            {/* Plus button to add additional fields */}
            <div className="flex flex-col mt-2">
              <button type="button" onClick={addAdditionalField} className="btn bg-black px-4 py-2 text-white rounded-full my-4">
                +
              </button>

              {/* Render additional fields dynamically */}
              {certData.additionalFields.map((field, index) => (
                <div key={index} className="flex mt-2 gap-8">
                  <label
                    htmlFor={`additionalFieldLabel${index}`}
                    className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <input
                      type="text"
                      id={`additionalFieldLabel${index}`}
                      className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                      name="label"
                      value={field.label}
                      onChange={(e) => handleAdditionalFieldChange(index, e)}
                      placeholder="Extra Field label"
                    />

                    <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-neutral p-0.5 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                      Extra Field label
                    </span>
                  </label>

                  <label
                    htmlFor={`additionalFieldValues${index}`}
                    className="relative block rounded-md border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <input
                      type="text"
                      id={`additionalFieldValues${index}`}
                      className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
                      name="value"
                      value={field.value}
                      onChange={(e) => handleAdditionalFieldChange(index, e)}
                      placeholder="Extra Field value"
                    />

                    <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-neutral p-0.5 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
                      Extra Field view
                    </span>
                  </label>
                  {/* Minus button to remove the latest added field */}
                  {index === certData.additionalFields.length - 1 && (
                    <button type="button" onClick={removeAdditionalField} className="btn w-1/2 bg-red-500 px-2 py-2 text-white rounded-full">
                      -
                    </button>
                  )}
                </div>
              ))}
            </div>
            <input type="submit" className="btn bg-black mt-2 w-10/12 ml-8" value="Generate" />
          </form>
        </div>
      </div>
    </div>
  );
}
