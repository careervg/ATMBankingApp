const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

export function Keypad({ atm }) {
  const { state, dispatch, submitPin, submitDeposit, submitWithdraw } = atm;
  const amountMode = state.screen === "deposit" || state.screen === "withdraw";

  function pressKey(key) {
    if (state.loading) return;
    if (amountMode) {
      dispatch({ type: "AMOUNT_DIGIT", digit: key });
      return;
    }
    if (state.screen === "pin" && key !== ".") {
      dispatch({ type: "PIN_DIGIT", digit: key });
    }
  }

  function submit() {
    if (state.screen === "pin") submitPin();
    if (state.screen === "deposit") submitDeposit();
    if (state.screen === "withdraw") submitWithdraw();
  }

  return (
    <div className="keypad" aria-label="ATM keypad">
      <div className="number-pad">
        {keys.map((key) => (
          <button key={key} onClick={() => pressKey(key)} type="button">
            {key}
          </button>
        ))}
        <button onClick={() => dispatch({ type: "BACKSPACE" })} type="button">
          Del
        </button>
      </div>
      <div className="command-pad">
        <button className="cancel" onClick={() => dispatch({ type: "EXIT" })} type="button">
          Cancel
        </button>
        <button className="clear" onClick={() => dispatch({ type: "CLEAR" })} type="button">
          Clear
        </button>
        <button className="enter" onClick={submit} type="button">
          Enter
        </button>
      </div>
    </div>
  );
}
