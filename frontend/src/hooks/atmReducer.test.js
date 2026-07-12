import { describe, expect, it } from "vitest";

import { atmReducer, initialAtmState } from "./atmReducer.js";

describe("atmReducer", () => {
  it("accepts pin digits", () => {
    const state = atmReducer(initialAtmState, { type: "PIN_DIGIT", digit: "1" });
    expect(state.pin).toBe("1");
  });

  it("moves to menu after authentication", () => {
    const state = atmReducer(initialAtmState, {
      type: "AUTH_SUCCESS",
      account: { account_id: 1, customer_name: "Peter Parker", card_type: "star", balance: "1250.00" },
    });

    expect(state.screen).toBe("menu");
    expect(state.account.customer_name).toBe("Peter Parker");
  });

  it("clears session on exit", () => {
    const loggedIn = {
      ...initialAtmState,
      account: { account_id: 1 },
      screen: "menu",
    };

    expect(atmReducer(loggedIn, { type: "EXIT" })).toEqual(initialAtmState);
  });
});
