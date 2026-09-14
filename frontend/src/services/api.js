const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/api";

async function apiRequest(
  endpoint,
  options = {},
  token = null
) {
  const headers = {
    ...(options.body
      ? {
          "Content-Type": "application/json",
        }
      : {}),

    ...(options.headers || {}),

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const contentType =
    response.headers.get("content-type");

  let data;

  if (
    contentType &&
    contentType.includes("application/json")
  ) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data.message ||
          "Something went wrong.";

    const error = new Error(
      message.trim()
    );

    error.status = response.status;

    throw error;
  }

  return data;
}

// =========================
// Authentication
// =========================

export async function login(
  email,
  password
) {
  return apiRequest("/login", {
    method: "POST",

    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function register(
  name,
  email,
  password
) {
  return apiRequest("/register", {
    method: "POST",

    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

// =========================
// User Profile
// =========================

export async function getCurrentUser(
  token
) {
  return apiRequest(
    "/me",
    {
      method: "GET",
    },
    token
  );
}

// =========================
// Expenses
// =========================

export async function getExpenses(
  token
) {
  return apiRequest(
    "/expenses",
    {
      method: "GET",
    },
    token
  );
}

export async function createExpense(
  expense,
  token
) {
  return apiRequest(
    "/expenses",
    {
      method: "POST",

      body: JSON.stringify(expense),
    },
    token
  );
}

export async function updateExpense(
  id,
  expense,
  token
) {
  return apiRequest(
    `/expenses/${id}`,
    {
      method: "PUT",

      body: JSON.stringify(expense),
    },
    token
  );
}

export async function deleteExpense(
  id,
  token
) {
  return apiRequest(
    `/expenses/${id}`,
    {
      method: "DELETE",
    },
    token
  );
}