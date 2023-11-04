import Nav from './Nav';
import SideBar from './SideBar';

export default function GenrateCertificate() {
  return (
    <div className="flex">
      <SideBar active="genrateCertificate" />
      <div className="flex flex-col  w-4/5">
        <Nav />
        <div className="bg-neutral flex-grow p-6">
          <form>
            <input type="text" />
          </form>
        </div>
      </div>
    </div>
  );
}
