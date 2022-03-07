import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(
  window.ethereum as any,
  "any"
);

interface IWeb3 {
  account: string;
}

export const connectWallet = createAsyncThunk(
  "web3/connect-wallet",
  async (_, { rejectWithValue, dispatch }) => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      return rejectWithValue("Need to install MetaMask");
    }

    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      console.log("accounts : ", accounts);
      const signer = provider.getSigner();
      console.log("signer : ", signer);
      console.log(
        "balance : ",
        ethers.utils.formatEther(await provider.getBalance(signer.getAddress()))
      );
      // TODO: Should we register this event anywhere else.
      window.ethereum.on("accountsChanged", (account: any) =>
        dispatch(updateAccount(account[0]))
      );

      // NOTE: MetaMask docs recommend to reload the page when chain changes
      // window.ethereum.on("chainChanged", (_chainId) =>
      //   window.location.reload()
      // );
      window.ethereum.on("chainChanged", (_chainId) => {
        console.log("chainChanged chain id : ", _chainId);
        dispatch(reset());
      });

      // Temporary
      return { account: await signer.getAddress() };
    } catch (error) {
      console.error("error in connect wallet : ", error);

      if (error.code === 4001) {
        return rejectWithValue("Please connect to MetaMask");
      }
      return rejectWithValue(error);
    }
  }
);

const initialState: IWeb3 = {
  account: null,
};

const web3Slice = createSlice({
  name: "web3",
  initialState,
  reducers: {
    updateAccount: (state, action) => {
      state.account = action.payload;
    },
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(connectWallet.rejected, (state, action) => {
        console.log("connectWallet : rejected");
        console.error("error from connectWallet.rejected : ", action.payload);
      })
      .addCase(connectWallet.pending, (state) => {
        console.log("connectWallet : loading");
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        console.log("signer address from extra reducer : ", action.payload);
        state.account = action.payload.account;
      });
  },
});

// window.ethereum.on("accountsChanged", (account: any) =>
//   console.log("accountsChanged : ", account)
// );

export const { updateAccount, reset } = web3Slice.actions;

export default web3Slice.reducer;
