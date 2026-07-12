export const initialAtmState = {
  account: null,
  screen: "pin",
  pin: "",
  amount: "",
  message: "Welcome to the ATM",
  loading: false,
  error: "",
  transactions: [],
};

export function atmReducer(state, action) {
  switch (action.type) {
    case "PIN_DIGIT":
      if (state.pin.length >= 8) return state;
      return { ...state, pin: `${state.pin}${action.digit}`, error: "" };
    case "AMOUNT_DIGIT":
      if (state.amount.length >= 8) return state;
      return { ...state, amount: `${state.amount}${action.digit}`, error: "" };
    case "BACKSPACE":
      return state.screen === "pin"
        ? { ...state, pin: state.pin.slice(0, -1), error: "" }
        : { ...state, amount: state.amount.slice(0, -1), error: "" };
    case "CLEAR":
      return { ...state, pin: "", amount: "", error: "" };
    case "LOADING":
      return { ...state, loading: true, error: "" };
    case "AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        account: action.account,
        pin: "",
        screen: "menu",
        message: `Hi ${action.account.customer_name}!`,
      };
    case "BALANCE_SUCCESS":
      return {
        ...state,
        loading: false,
        account: { ...state.account, balance: action.balance },
        screen: "balance",
        message: "Current Balance",
      };
    case "TRANSACTION_SUCCESS":
      return {
        ...state,
        loading: false,
        account: action.account,
        amount: "",
        screen: "receipt",
        message: action.message,
      };
    case "TRANSACTIONS_SUCCESS":
      return { ...state, loading: false, transactions: action.transactions };
    case "SCREEN":
      return { ...state, screen: action.screen, amount: "", error: "" };
    case "ERROR":
      return { ...state, loading: false, error: action.error };
    case "EXIT":
      return { ...initialAtmState };
    default:
      return state;
  }
}
