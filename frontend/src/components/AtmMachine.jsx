import { CardNetworkStrip } from "./CardNetworkStrip.jsx";
import { Keypad } from "./Keypad.jsx";
import { Screen } from "./Screen.jsx";

export function AtmMachine({ atm }) {
  const { state } = atm;

  return (
    <main className="atm-page">
      <section className="atm" aria-label="ATM machine">
        <img className="atm-sign" src="/assets/atm_sign.png" alt="ATM 24 hour banking" />

        <div className="atm-body">
          <CardNetworkStrip activeType={state.account?.card_type} />

          <div className="console">
            <SideButtons side="left" atm={atm} />
            <Screen atm={atm} />
            <SideButtons side="right" atm={atm} />
          </div>

          <img className="sticker" src="/assets/sticker_graf.png" alt="" />
          <img className="graffiti" src="/assets/graffiti.png" alt="" />
          <img className="systems" src="/assets/systems.png" alt="Systems" />

          <Keypad atm={atm} />
        </div>
      </section>
    </main>
  );
}

function SideButtons({ side, atm }) {
  const { state, dispatch, showBalance, loadTransactions } = atm;
  const authenticated = Boolean(state.account);

  const actions = side === "left"
    ? [
        null,
        null,
        authenticated ? { label: "Withdraw", onClick: () => dispatch({ type: "SCREEN", screen: "withdraw" }) } : null,
        authenticated ? { label: "Deposit", onClick: () => dispatch({ type: "SCREEN", screen: "deposit" }) } : null,
      ]
    : [
        authenticated ? { label: "Exit", onClick: () => dispatch({ type: "EXIT" }) } : null,
        authenticated ? { label: "History", onClick: loadTransactions } : null,
        authenticated ? { label: "Balance", onClick: showBalance } : null,
        state.screen === "pin" ? { label: "Enter PIN", onClick: atm.submitPin } : { label: "Menu", onClick: () => dispatch({ type: "SCREEN", screen: "menu" }) },
      ];

  return (
    <div className={`side-buttons side-buttons-${side}`}>
      {actions.map((action, index) => (
        <button
          className="atm-side-button"
          disabled={!action || state.loading}
          key={`${side}-${index}`}
          onClick={action?.onClick}
          type="button"
        >
          <span>{action?.label ?? ""}</span>
        </button>
      ))}
    </div>
  );
}
