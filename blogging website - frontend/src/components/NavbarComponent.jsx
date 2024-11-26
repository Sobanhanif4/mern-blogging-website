import { Link, Outlet } from "react-router-dom"
import logo from "../imgs/logo.png"
import { IoIosSearch } from "react-icons/io";
import { useState } from "react";
import { TfiWrite } from "react-icons/tfi";

const NavbarComponent = () => {
  const [ SearchVisibility, SetSearchVisibility ] = useState(false)

  return (

    <>
    <nav className="navbar">

<Link to="/" className="flex-none w-10">
  <img src={logo} className="w-full" />
</Link>

<div className={"absolute bg-white w-full left-0 top-full mt-0 5 border-b border-grey py-4 px-[5vw] md:border-0 md-block md:relative md:inset-0 md:p-0 md:w-auto md:show " + (SearchVisibility ? "show" : "hide")}>
  <input
    type="text"
    placeholder="search"
    className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-gray md: pl-16"
  />
  <IoIosSearch className="absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-2xl text-dark-grey " />
</div>

<div className="flex items-center gap-3 md:gap-6 ml-auto">
  <button className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center" onClick={() => SetSearchVisibility(currentVal => !currentVal)}>

    <IoIosSearch className="text-2xl" />
  </button>

  <Link to="/editor" className="hidden md:flex gap-2 link">
  <TfiWrite />
  </Link>

  <Link className="btn-dark py-2" to="/signin">
  Sign In
  </Link>
  <Link className="hidden md:block btn-dark py-2" to="/signup">
  Sign Up
  </Link>
</div>

</nav >

<Outlet />
    </>
  )
}

export default NavbarComponent
