const USERS_KEY = 'vexalstock_auth_users';
const SESSION_KEY = 'vexalstock_auth_session';
const OTP_KEY = 'vexalstock_auth_otp_codes';
const RESET_KEY = 'vexalstock_auth_reset_tokens';

const getStorage = (key) => {
  const raw = window.localStorage.getItem(key);
  return raw ? JSON.parse(raw) : {};
};

const setStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const getUsers = () => getStorage(USERS_KEY);
const saveUsers = (users) => setStorage(USERS_KEY, users);
const getSession = () => getStorage(SESSION_KEY);
const saveSession = (session) => setStorage(SESSION_KEY, session);
const clearSession = () => window.localStorage.removeItem(SESSION_KEY);

const getOtpCodes = () => getStorage(OTP_KEY);
const saveOtpCodes = (codes) => setStorage(OTP_KEY, codes);
const getResetTokens = () => getStorage(RESET_KEY);
const saveResetTokens = (tokens) => setStorage(RESET_KEY, tokens);

const omitPassword = (user) => {
  const { password, ...rest } = user;
  return rest;
};

const getUser = (email) => {
  const users = getUsers();
  return users[email] ? { ...users[email] } : null;
};

const persistUser = (user) => {
  const users = getUsers();
  users[user.email] = user;
  saveUsers(users);
};

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();
const generateToken = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export const login = async (email, password) => {
  const user = getUser(email);
  if (!user) {
    throw new Error('No existe una cuenta con este correo');
  }
  if (user.password !== password) {
    throw new Error('Contraseña incorrecta');
  }
  if (!user.verified) {
    throw new Error('El correo no ha sido verificado');
  }
  saveSession({ email: user.email });
  return omitPassword(user);
};

export const loginWithProvider = async (provider) => {
  const email = provider === 'google' ? 'google.user@example.com' : `${provider}.user@example.com`;
  let user = getUser(email);
  if (!user) {
    user = {
      email,
      full_name: provider === 'google' ? 'Google User' : `${provider} User`,
      role: 'user',
      verified: true,
      registered_at: new Date().toISOString(),
      password: '',
    };
    persistUser(user);
  }
  saveSession({ email: user.email });
  return omitPassword(user);
};

export const register = async (email, password) => {
  const existingUser = getUser(email);

  if (existingUser) {
    if (!existingUser.verified) {
      existingUser.password = password;
      existingUser.verified = true;
      persistUser(existingUser);
      saveSession({ email: existingUser.email });
      return { email, autoVerified: true };
    }

    throw new Error('An account with this email already exists');
  }

  const user = {
    email,
    password,
    full_name: email.split('@')[0],
    role: 'user',
    verified: true,
    registered_at: new Date().toISOString(),
  };
  persistUser(user);
  saveSession({ email: user.email });
  return { email, autoVerified: true };
};

export const verifyOtp = async ({ email, otpCode }) => {
  const otps = getOtpCodes();
  if (!otps[email] || otps[email] !== otpCode) {
    throw new Error('Invalid verification code');
  }
  const user = getUser(email);
  if (!user) {
    throw new Error('User not found');
  }
  user.verified = true;
  persistUser(user);
  delete otps[email];
  saveOtpCodes(otps);
  saveSession({ email: user.email });
  return { access_token: `local-${Date.now()}` };
};

export const resendOtp = async (email) => {
  const user = getUser(email);
  if (!user) {
    throw new Error('Email not found');
  }
  const otpCode = generateCode();
  const otps = getOtpCodes();
  otps[email] = otpCode;
  saveOtpCodes(otps);
  return true;
};

export const resetPasswordRequest = async (email) => {
  const user = getUser(email);
  if (user) {
    const token = generateToken();
    const tokens = getResetTokens();
    tokens[token] = { email, expires_at: Date.now() + 1000 * 60 * 60 };
    saveResetTokens(tokens);
  }
  return true;
};

export const resetPassword = async ({ resetToken, newPassword }) => {
  const tokens = getResetTokens();
  const record = tokens[resetToken];
  if (!record || record.expires_at < Date.now()) {
    throw new Error('Invalid or expired reset token');
  }
  const user = getUser(record.email);
  if (!user) {
    throw new Error('User not found');
  }
  user.password = newPassword;
  persistUser(user);
  delete tokens[resetToken];
  saveResetTokens(tokens);
  return true;
};

export const me = async () => {
  const session = getSession();
  if (!session?.email) {
    throw new Error('Not authenticated');
  }
  const user = getUser(session.email);
  if (!user || !user.verified) {
    throw new Error('Not authenticated');
  }
  return omitPassword(user);
};

export const logout = async () => {
  clearSession();
  return true;
};

export const getCurrentUser = async () => {
  try {
    return await me();
  } catch {
    return null;
  }
};
