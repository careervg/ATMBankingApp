  const API_BASE_URL =import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.detail ?? "ATM service unavailable");
  }
  return payload;
}

export function validatePin(pin) {
  return request("/auth/pin", {
    method: "POST",
    body: JSON.stringify({ pin }),
  });
}

export function getBalance(accountId) {
  return request(`/accounts/${accountId}/balance`);
}

export function deposit(accountId, amount) {
  return request(`/accounts/${accountId}/deposit`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export function withdraw(accountId, amount) {
  return request(`/accounts/${accountId}/withdraw`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export function getTransactions(accountId) {
  return request(`/accounts/${accountId}/transactions`);
}
