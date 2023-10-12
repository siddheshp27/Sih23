import React from "react";

const Categories = () => {
  return (
    <section className="h-screen w-screen pb-8 bg-white category">
      <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-64">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:items-center lg:gap-x-16">
          <div className="max-w-2xl pb-80 text-center lg:mx-0">
            <h2 className="text-3xl font-bold text-black sm:text-4xl">
              Find documents based on Categories
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 mb-16">
            <a
              className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
              href="/accountant"
            >
              <span className="inline-block rounded-lg bg-gray-50 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  className="h-6 w-6"
                >
                  <path d="M24 24h-24v-2h.998l.009-6h21.993v6h1v2zm-3-6h-18v4h2v-2c0-.552.448-1 1-1s1 .448 1 1v2h2v-2c0-.552.448-1 1-1s1 .448 1 1v2h2v-2c0-.552.448-1 1-1s1 .448 1 1v2h2v-2c0-.552.448-1 1-1s1 .448 1 1v2h2v-4zm2-3h-21.991l.003-2h3.988v-3h2v3h2v-3h2v3h2v-3h2v3h2v-3h2v3h4v2zm-8-13h-3v1c2.966 0 6.158 1.979 7 6h-14c.547-3.78 3.638-5.827 6-6v-3h4v2zm.954 5c-.88-1.1-2.229-2-3.954-2-1.96 0-3.264.837-4.086 2h8.04z" />
                </svg>
              </span>

              <h2 className="mt-2 font-bold text-black">Central Goverment</h2>
            </a>

            <a
              className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
              href="/accountant"
            >
              <span className="inline-block rounded-lg bg-gray-50 p-3">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                >
                  <path d="M22 9.74l-2 1.02v7.24c-1.007 2.041-5.606 3-8.5 3-3.175 0-7.389-.994-8.5-3v-7.796l-3-1.896 12-5.308 11 6.231v8.769l1 3h-3l1-3v-8.26zm-18 1.095v6.873c.958 1.28 4.217 2.292 7.5 2.292 2.894 0 6.589-.959 7.5-2.269v-6.462l-7.923 4.039-7.077-4.473zm-1.881-2.371l9.011 5.694 9.759-4.974-8.944-5.066-9.826 4.346z" />
                </svg>
              </span>

              <h2 className="mt-2 font-bold text-black">Universities</h2>
            </a>

            <a
              className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
              href="/accountant"
            >
              <span className="inline-block rounded-lg bg-gray-50 p-3">
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                >
                  <path d="M6 24h-2c-.552 0-1-.448-1-1v-1c-.53 0-1.039-.211-1.414-.586s-.586-.884-.586-1.414v-8c-.552 0-1-.448-1-1v-3c0-.552.448-1 1-1v-4c0-1.657 1.343-3 3-3h16c1.657 0 3 1.343 3 3v4c.552 0 1 .448 1 1v3c0 .552-.448 1-1 1v8c0 .53-.211 1.039-.586 1.414s-.884.586-1.414.586v1c0 .552-.448 1-1 1h-2c-.552 0-1-.448-1-1v-1h-10v1c0 .552-.448 1-1 1zm-1.5-7c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm15 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm-5 1h-5c-.276 0-.5.224-.5.5s.224.5.5.5h5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm6.5-12.5c0-.276-.224-.5-.5-.5h-17c-.276 0-.5.224-.5.5v8.5s3.098 1 9 1 9-1 9-1v-8.5zm-5-3.5h-8v1h8v-1z" />
                </svg>
              </span>

              <h2 className="mt-2 font-bold text-black">Transport</h2>
            </a>

            <a
              className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
              href="/accountant"
            >
              <span className="inline-block rounded-lg bg-gray-50 p-3">
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                >
                  <path d="M7 6v-2c0-1.104.896-2 2-2h6c1.104 0 2 .896 2 2v2h5c1.104 0 2 .896 2 2v12c0 1.104-.896 2-2 2h-20c-1.104 0-2-.896-2-2v-12c0-1.104.896-2 2-2h5zm6 7v-3h-2v3h-3v2h3v3h2v-3h3v-2h-3zm1.5-9h-5c-.276 0-.5.224-.5.5v1.5h6v-1.5c0-.276-.224-.5-.5-.5" />
                </svg>
              </span>

              <h2 className="mt-2 font-bold text-black">Health and Welfare</h2>
            </a>

            <a
              className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
              href="/accountant"
            >
              <span className="inline-block rounded-lg bg-gray-50 p-3">
                <svg
                  className="w-6 h-6"
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  stroke-linejoin="round"
                  stroke-miterlimit="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m12 5.72c-2.624-4.517-10-3.198-10 2.461 0 3.725 4.345 7.727 9.303 12.54.194.189.446.283.697.283s.503-.094.697-.283c4.977-4.831 9.303-8.814 9.303-12.54 0-5.678-7.396-6.944-10-2.461z"
                    fill-rule="nonzero"
                  />
                </svg>
              </span>

              <h2 className="mt-2 font-bold text-black">Most IMP docs</h2>
            </a>

            <a
              className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
              href="/accountant"
            >
              <span className="inline-block rounded-lg bg-gray-50 p-3">
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                >
                  <path d="M24 24h-24v-18h6v6l6-4v4.008l6-4.008v4.017l6-4.017v16zm-20-16h-2v14h20v-10l-6 4v-4l-6 4v-4l-6 4v-8zm11 12h-2v-3h2v3zm-4 0h-2v-3h2v3zm-4 0h-2v-3h2v3zm12 0h-2v-3h2v3zm-16-15h-1c.198-2.182 1.785-4 3.5-4 .246 0 .478.059.683.164.316-.687 1.011-1.164 1.817-1.164s1.501.477 1.817 1.164c.205-.105.437-.164.683-.164.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5c-.246 0-.478-.059-.683-.164-.316.687-1.011 1.164-1.817 1.164-2.345 0-3.722-2.951-5 0z" />
                </svg>
              </span>

              <h2 className="mt-2 font-bold text-black">Industry</h2>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
