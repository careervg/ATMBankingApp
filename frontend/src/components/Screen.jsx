const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function Screen({ atm }) {
  const { state, dispatch, submitDeposit, submitWithdraw } = atm;

  return (
    <section className="screen" aria-live="polite">
      {state.loading ? <p className="screen-title">Processing...</p> : <ScreenContent atm={atm} />}
      {state.error && <p className="screen-error">{state.error}</p>}

      {(state.screen === "deposit" || state.screen === "withdraw") && (
        <div className="amount-actions">
          <button onClick={state.screen === "deposit" ? submitDeposit : submitWithdraw} type="button">
            Confirm
          </button>
          <button onClick={() => dispatch({ type: "SCREEN", screen: "menu" })} type="button">
            Back
          </button>
        </div>
      )}
    </section>
  );
}

function ScreenContent({ atm }) {
  const { state } = atm;

  if (state.screen === "pin") {
    return (
      <>
        <p className="screen-title">Welcome to the ATM</p>
        <p className="pin-display">{state.pin ? "•".repeat(state.pin.length) : "Enter PIN"}</p>
      </>
    );
  }

  if (state.screen === "balance") {
    return (
      <>
        <p className="screen-title">Current Balance</p>
        <p className="balance">{currency.format(Number(state.account.balance))}</p>
        <p className="screen-hint">Select Menu to continue</p>
      </>
    );
  }

  if (state.screen === "deposit" || state.screen === "withdraw") {
    return (
      <>
        <p className="screen-title">{state.screen === "deposit" ? "Deposit Funds" : "Withdraw Funds"}</p>
        <p className="amount-display">{state.amount ? `$${state.amount}` : "$0.00"}</p>
        <p className="screen-hint">Use keypad, then Confirm</p>
      </>
    );
  }

  if (state.screen === "receipt") {
    return (
      <>
        <p className="screen-title">{state.message}</p>
        <p className="balance">{currency.format(Number(state.account.balance))}</p>
        <p className="screen-hint">Updated balance</p>
      </>
    );
  }

  if (state.screen === "history") {
    return (
      <>
        <p className="screen-title">Recent Activity</p>
        <ul className="history-list">
          {state.transactions.slice(0, 4).map((item) => (
            <li key={item.id}>
              <span>{item.type}</span>
              <strong>{currency.format(Number(item.amount))}</strong>
            </li>
          ))}
          {state.transactions.length === 0 && <li>No transactions yet</li>}
        </ul>
      </>
    );
  }

  return (
    <>
      <p className="screen-title">Hi {state.account.customer_name}!</p>
      <p className="screen-subtitle">Please make a choice...</p>
      <div className="screen-options">
        <span className="left-option withdraw">Withdraw</span>
        <span className="left-option deposit">Deposit</span>
        <span className="right-option exit">Exit</span>
        <span className="right-option balance-option">Balance</span>
        <span className="right-option pin-option">Re-Enter PIN</span>
      </div>
    </>
  );
}
