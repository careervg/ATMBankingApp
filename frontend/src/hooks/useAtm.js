import { useReducer } from "react";

import { deposit, getBalance, getTransactions, validatePin, withdraw } from "../api/client.js";
import { atmReducer, initialAtmState } from "./atmReducer.js";

export function useAtm() {
  const [state, dispatch] = useReducer(atmReducer, initialAtmState);

  const accountId = state.account?.account_id;

  async function submitPin() {
    if (state.pin.length < 4) {
      dispatch({ type: "ERROR", error: "Enter a 4 digit PIN" });
      return;
    }
    try {
      dispatch({ type: "LOADING" });
      const account = await validatePin(state.pin);
      dispatch({ type: "AUTH_SUCCESS", account });
    } catch (error) {
      dispatch({ type: "ERROR", error: error.message });
    }
  }

  async function showBalance() {
    try {
      dispatch({ type: "LOADING" });
      const payload = await getBalance(accountId);
      dispatch({ type: "BALANCE_SUCCESS", balance: payload.balance });
    } catch (error) {
      dispatch({ type: "ERROR", error: error.message });
    }
  }

  async function submitDeposit() {
    await submitMoneyOperation(deposit, "Deposit complete");
  }

  async function submitWithdraw() {
    await submitMoneyOperation(withdraw, "Please take your cash");
  }

  async function submitMoneyOperation(operation, message) {
    if (!state.amount || Number(state.amount) <= 0) {
      dispatch({ type: "ERROR", error: "Enter a valid amount" });
      return;
    }
    try {
      dispatch({ type: "LOADING" });
      const account = await operation(accountId, Number(state.amount).toFixed(2));
      dispatch({ type: "TRANSACTION_SUCCESS", account, message });
    } catch (error) {
      dispatch({ type: "ERROR", error: error.message });
    }
  }

  async function loadTransactions() {
    try {
      dispatch({ type: "LOADING" });
      const payload = await getTransactions(accountId);
      dispatch({ type: "TRANSACTIONS_SUCCESS", transactions: payload.transactions });
      dispatch({ type: "SCREEN", screen: "history" });
    } catch (error) {
      dispatch({ type: "ERROR", error: error.message });
    }
  }

  return {
    state,
    dispatch,
    submitPin,
    showBalance,
    submitDeposit,
    submitWithdraw,
    loadTransactions,
  };
}
