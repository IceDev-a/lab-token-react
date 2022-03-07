import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "redux/reducers";
import { connectWallet } from "redux/slices/web3";
import { useAppDispatch } from "redux/store";

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const account = useSelector((state: RootState) => state.web3.account);

  return (
    <>
      <nav className="fixed flex justify-between py-6 w-full lg:px-48 md:px-12 px-4 content-center bg-secondary z-10">
        <div className="flex items-center">
          <p>Logo</p>
        </div>
        {/* <ul className="font-montserrat items-center hidden md:flex">
          <li className="mx-3 growing-underline">
            <Link to="/">Home</Link>
          </li>
          <li className="growing-underline mx-3">
            <a href="features">Features</a>
          </li>
          <li className="growing-underline mx-3">
            <a href="pricing">Pricing</a>
          </li>
        </ul> */}
        <div className="font-montserrat hidden md:block">
          {account ? (
            <p>Connected to {account}</p>
          ) : (
            <button
              className="py-2 px-4 text-white bg-black rounded-3xl"
              onClick={async () => {
                await dispatch(connectWallet());
              }}
            >
              Connect to wallet
            </button>
          )}
        </div>
        <div id="showMenu" className="md:hidden">
          <AiOutlineMenu />
        </div>
      </nav>
      <div
        id="mobileNav"
        className="hidden px-4 py-6 fixed top-0 left-0 h-full w-full bg-secondary z-20 animate-fade-in-down"
      >
        <div id="hideMenu" className="flex justify-end">
          <AiOutlineMenu />
        </div>
        {/* <ul className="font-montserrat flex flex-col mx-8 my-24 items-center text-3xl">
          <li className="my-6">
            <a href="howitworks">How it works</a>
          </li>
          <li className="my-6">
            <a href="features">Features</a>
          </li>
          <li className="my-6">
            <a href="pricing">Pricing</a>
          </li>
        </ul> */}
      </div>
    </>
  );
};
