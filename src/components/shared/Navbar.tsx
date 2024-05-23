import { DynamicWidget, useDynamicContext } from "../../lib/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { handleLogOut } = useDynamicContext();
  const router = useRouter();

  const logoutHandler = async () => {
    handleLogOut();
  };

  return (
    <nav className="bg-gradient-to-r from-primary to-secondary text-dark p-4 flex justify-between items-center shadow-lg">
      <DynamicWidget />
      <h1 className="text-2xl font-bold tracking-wide">User Rankings</h1>
      <button
        className="flex items-center p-2 rounded-full bg-accent hover:bg-blue-700 p-2 text-white transition duration-300"
        onClick={logoutHandler}
      >
        <Image src={"/logout.svg"} alt="Logout" width={24} height={24} />
        <span className="ml-2">Logout</span>
      </button>
    </nav>
  );
};

export default Navbar;
