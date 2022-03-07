import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

interface IWeb3 {
  account: any;
}

export const connectWallet = createAsyncThunk(
  "web3/connect-wallet",
  async (_, { rejectWithValue }) => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      rejectWithValue("Need to install MetaMask");
    }
    const provider = new ethers.providers.Web3Provider(
      window.ethereum as any,
      "any"
    );
    const accounts = await provider.send("eth_requestAccounts", []);
    console.log("accounts : ", accounts);

    const signer = provider.getSigner();
    console.log("signer : ", signer);

    // Temporary
    return signer.getAddress();
  }
);

const initialState: IWeb3 = {
  account: null,
};

const web3Slice = createSlice({
  name: "web3",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(connectWallet.pending, (state) => {
        console.log("connectWallet : loading");
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        console.log("signer address from extra reducer : ", action.payload);
        state.account = action.payload;
      });
  },
});

export const {} = web3Slice.actions;

export default web3Slice.reducer;
