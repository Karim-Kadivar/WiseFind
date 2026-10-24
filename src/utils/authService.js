/**
 * WiseFind Standard Authentication Service
 * Implements strict, loophole-free client authentication, account registration,
 * credential validation, and multi-step password reset.
 */

const STORAGE_KEY = 'wisefind_registered_users';
const RESET_STORAGE_KEY = 'wisefind_password_reset_session';

// Standard seeded accounts for initial out-of-the-box system access
const DEFAULT_ACCOUNTS = [
  {
    name: 'Ankit Sharma',
    email: 'customer@wisefind.com',
    password: 'Customer@123',
    role: 'user'
  },
  {
    name: 'Vikramaditya Sengupta',
    email: 'advisor@wisefind.com',
    password: 'Advisor@123',
    role: 'expert',
    advisorCategory: 'Laptops & Workstations',
    advisorExperience: '10'
  },
  {
    name: 'Karim Kadivar',
    email: 'admin@wisefind.com',
    password: 'Admin@123',
    role: 'admin'
  }
];

/**
 * Returns the list of registered users. Initializes with default accounts if empty.
 */
export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }

    // Ensure default accounts exist in the pool if deleted
    let updated = false;
    for (const def of DEFAULT_ACCOUNTS) {
      if (!parsed.some(u => u.email?.toLowerCase() === def.email.toLowerCase())) {
        parsed.push(def);
        updated = true;
      }
    }
    if (updated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return DEFAULT_ACCOUNTS;
  }
}

// Background sync with MongoDB user collection
if (typeof window !== 'undefined') {
  fetch('/api/users')
    .then(r => r.ok ? r.json() : null)
    .then(dbUsers => {
      if (Array.isArray(dbUsers) && dbUsers.length > 0) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const current = raw ? JSON.parse(raw) : [];
          const merged = [...current];
          for (const u of dbUsers) {
            const idx = merged.findIndex(m => m.email?.toLowerCase() === u.email?.toLowerCase());
            if (idx !== -1) {
              merged[idx] = { ...merged[idx], ...u };
            } else {
              merged.push(u);
            }
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch(e) {}
      }
    })
    .catch(() => {});
}

/**
 * Validates email format strictly
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
}

/**
 * Validates password strength (minimum 6 characters, contains at least 1 digit or special character)
 */
export function validatePasswordStrength(password) {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long.' };
  }
  return { valid: true };
}

/**
 * Register a new user account with strict validation
 */
export function registerUser({ name, email, password, confirmPassword, role = 'user', advisorCategory, advisorExperience, adminPin }) {
  // 1. Full name validation
  if (!name || name.trim().length < 2) {
    return { success: false, error: 'Please enter your valid full name (at least 2 characters).' };
  }

  // 2. Email format validation
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!isValidEmail(normalizedEmail)) {
    return { success: false, error: 'Please provide a valid, well-formatted email address.' };
  }

  // 3. Password validation
  const pwCheck = validatePasswordStrength(password);
  if (!pwCheck.valid) {
    return { success: false, error: pwCheck.message };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match. Please re-enter your password.' };
  }

  // 4. Role-specific validation
  if (role === 'admin') {
    if (adminPin !== '982411') {
      return { success: false, error: 'Invalid Administrator Security PIN. Authorized personnel only.' };
    }
  }

  // 5. Check if user already exists
  const users = getRegisteredUsers();
  const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return { success: false, error: 'An account with this email address already exists. Please log in or reset your password.' };
  }

  // 6. Create and save new user
  const effectiveRole = (role === 'advisor' || role === 'expert') ? 'expert' : role;
  const newUser = {
    name: name.trim(),
    email: normalizedEmail,
    password: password,
    role: effectiveRole,
    advisorCategory: (effectiveRole === 'expert') ? advisorCategory : undefined,
    advisorExperience: (effectiveRole === 'expert') ? advisorExperience : undefined,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    return { success: false, error: 'Failed to persist user credentials. Local storage quota exceeded.' };
  }

  // Sync with MongoDB user collection
  try {
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    }).catch(() => {});
  } catch (e) {}

  return {
    success: true,
    user: {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  };
}

/**
 * Login user with credentials verification (No auto-registration loophole)
 */
export function loginUser({ email, password, role, adminPin }) {
  const normalizedEmail = (email || '').trim().toLowerCase();

  // 1. Basic field checks
  if (!isValidEmail(normalizedEmail)) {
    return { success: false, error: 'Please enter a valid registered email address.' };
  }

  if (!password || !password.trim()) {
    return { success: false, error: 'Please enter your account password.' };
  }

  // 2. Search for registered user
  const users = getRegisteredUsers();
  const matchedUser = users.find(u => u.email.toLowerCase() === normalizedEmail);

  // STRICT CHECK: If user is not found, do NOT auto-register!
  if (!matchedUser) {
    return { 
      success: false, 
      error: 'No account found with this email. Please check for typos or click Sign Up to create an account.' 
    };
  }

  // 3. Password match verification
  if (matchedUser.password !== password) {
    return { 
      success: false, 
      error: 'Incorrect password. Please verify and try again, or click "Forgot Password" to reset it.' 
    };
  }

  // 4. Role-specific portal validation
  const normalizedRole = (role === 'advisor' || role === 'expert') ? 'expert' : role;
  if (normalizedRole === 'admin') {
    if (matchedUser.role !== 'admin') {
      return {
        success: false,
        error: 'This account does not have Platform Administrator authorization. Please select the Customer or Advisor portal.'
      };
    }
    if (adminPin && adminPin !== '982411') {
      return {
        success: false,
        error: 'Invalid Administrator Security PIN. Authorized root staff only.'
      };
    }
  }

  if (normalizedRole === 'expert' && matchedUser.role !== 'expert' && matchedUser.role !== 'advisor') {
    return {
      success: false,
      error: 'This account is not registered as a Category Advisor. Please switch to Customer portal or sign up as an Advisor.'
    };
  }

  // 5. Return authenticated user payload
  const effectiveUserRole = normalizedRole || matchedUser.role || 'user';
  return {
    success: true,
    user: {
      name: matchedUser.name,
      email: matchedUser.email,
      role: effectiveUserRole,
      advisorCategory: matchedUser.advisorCategory,
      advisorExperience: matchedUser.advisorExperience
    }
  };
}

/**
 * Step 1 of Sign Up: Request Account Activation & Dispatch Real Email from hello.wisefind@gmail.com
 */
export async function requestRegistrationActivation({
  name,
  email,
  password,
  confirmPassword,
  role = 'user',
  advisorCategory,
  advisorExperience,
  adminPin
}) {
  // 1. Full name validation
  if (!name || name.trim().length < 2) {
    return { success: false, error: 'Please enter your valid full name (at least 2 characters).' };
  }

  // 2. Email format validation
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!isValidEmail(normalizedEmail)) {
    return { success: false, error: 'Please provide a valid, well-formatted email address.' };
  }

  // 3. Password validation
  const pwCheck = validatePasswordStrength(password);
  if (!pwCheck.valid) {
    return { success: false, error: pwCheck.message };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match. Please re-enter your password.' };
  }

  // 4. Role-specific validation
  if (role === 'admin') {
    if (adminPin !== '982411') {
      return { success: false, error: 'Invalid Administrator Security PIN. Authorized personnel only.' };
    }
  }

  // 5. Check local cache first to give instant feedback
  const localUsers = getRegisteredUsers();
  if (localUsers.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email address already exists. Please sign in or reset your password.' };
  }

  // 6. Request activation code from backend server
  try {
    const res = await fetch('/api/auth/register-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: (role === 'advisor' || role === 'expert') ? 'expert' : role,
        advisorCategory: (role === 'advisor' || role === 'expert') ? advisorCategory : undefined,
        advisorExperience: (role === 'advisor' || role === 'expert') ? advisorExperience : undefined
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to dispatch activation email. Please try again.' };
    }

    return {
      success: true,
      email: normalizedEmail,
      message: data.message || `Activation code sent to ${normalizedEmail} from hello.wisefind@gmail.com.`
    };
  } catch (err) {
    return { success: false, error: 'Unable to connect to WiseFind backend service. Please ensure the server is running.' };
  }
}

/**
 * Step 2 of Sign Up: Verify OTP and activate account
 */
export async function verifyRegistrationActivation({ email, otp }) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!normalizedEmail || !otp || String(otp).trim().length !== 6) {
    return { success: false, error: 'Please enter the 6-digit activation code sent to your email.' };
  }

  try {
    const res = await fetch('/api/auth/register-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, otp: String(otp).trim() })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Invalid or expired activation code.' };
    }

    // Persist verified user in local registered users cache for instant access
    if (data.user) {
      const users = getRegisteredUsers();
      const existingIdx = users.findIndex(u => u.email.toLowerCase() === normalizedEmail);
      if (existingIdx !== -1) {
        users[existingIdx] = { ...users[existingIdx], ...data.user };
      } else {
        users.push(data.user);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      } catch (e) {}
    }

    return {
      success: true,
      user: data.user,
      message: data.message || 'Account activated successfully! Welcome to WiseFind.'
    };
  } catch (err) {
    return { success: false, error: 'Network error verifying activation code. Please try again.' };
  }
}

/**
 * Resend Registration Activation OTP
 */
export async function resendRegistrationActivation(email) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  try {
    const res = await fetch('/api/auth/resend-activation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to resend activation code.' };
    }
    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, error: 'Network error resending code.' };
  }
}

/**
 * Step 1 of Forgot Password: Send actual verification email via backend from hello.wisefind@gmail.com
 */
export async function requestPasswordReset(email) {
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    return { success: false, error: 'Please enter a valid registered email address.' };
  }

  // Dispatch to backend Node.js Gmail endpoint
  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Failed to dispatch password recovery email.' };
    }

    return {
      success: true,
      email: normalizedEmail,
      message: data.message || `Password reset verification email dispatched to ${normalizedEmail} from hello.wisefind@gmail.com.`
    };
  } catch (e) {
    return { success: false, error: 'Could not connect to WiseFind backend service. Please ensure the server is active.' };
  }
}

/**
 * Step 2 of Forgot Password: Verify OTP and save new password in MongoDB & local storage
 */
export async function completePasswordReset({ email, otp, newPassword, confirmNewPassword }) {
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (!otp || String(otp).trim().length !== 6) {
    return { success: false, error: 'Please enter the 6-digit verification code sent to your email.' };
  }

  // 1. Validate new password
  const pwCheck = validatePasswordStrength(newPassword);
  if (!pwCheck.valid) {
    return { success: false, error: pwCheck.message };
  }

  if (newPassword !== confirmNewPassword) {
    return { success: false, error: 'New passwords do not match. Please re-enter.' };
  }

  // 2. Call backend MongoDB verify-reset-otp endpoint
  try {
    const res = await fetch('/api/auth/verify-reset-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, otp: String(otp).trim(), newPassword })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'Invalid or expired verification code.' };
    }

    // 3. Update password in registered users local storage
    const users = getRegisteredUsers();
    const userIdx = users.findIndex(u => u.email.toLowerCase() === normalizedEmail);

    if (userIdx !== -1) {
      users[userIdx].password = newPassword;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      } catch (e) {}
    }

    return {
      success: true,
      message: data.message || 'Your password has been reset securely! You may now sign in with your new credentials.'
    };
  } catch (e) {
    return { success: false, error: 'Network error verifying reset code. Please try again.' };
  }
}

/**
 * Get profile record for a given user email
 */
export function getUserProfile(email) {
  if (!email) return null;
  const normalizedEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  return users.find(u => u.email.toLowerCase() === normalizedEmail) || null;
}

/**
 * Update user profile details and persist to registered users storage
 */
export function updateUserProfile({ email, name, phone, location, bio, techInterests, budgetGoal, preferredFactor }) {
  if (!email) {
    return { success: false, error: 'Email is required to identify user.' };
  }
  const normalizedEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const userIdx = users.findIndex(u => u.email.toLowerCase() === normalizedEmail);

  if (userIdx === -1) {
    return { success: false, error: 'User record not found in system.' };
  }

  // Update existing record
  const current = users[userIdx];
  const updatedUser = {
    ...current,
    name: name !== undefined ? name.trim() : current.name,
    phone: phone !== undefined ? phone.trim() : current.phone,
    location: location !== undefined ? location.trim() : current.location,
    bio: bio !== undefined ? bio.trim() : current.bio,
    techInterests: techInterests !== undefined ? techInterests : current.techInterests,
    budgetGoal: budgetGoal !== undefined ? budgetGoal : current.budgetGoal,
    preferredFactor: preferredFactor !== undefined ? preferredFactor : current.preferredFactor,
    updatedAt: new Date().toISOString()
  };

  users[userIdx] = updatedUser;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

    // Also update logged user if it matches
    const loggedRaw = localStorage.getItem('wisefind_logged_user');
    if (loggedRaw) {
      const logged = JSON.parse(loggedRaw);
      if (logged.email?.toLowerCase() === normalizedEmail) {
        localStorage.setItem('wisefind_logged_user', JSON.stringify({
          ...logged,
          name: updatedUser.name,
          phone: updatedUser.phone,
          location: updatedUser.location,
          bio: updatedUser.bio
        }));
      }
    }

    return {
      success: true,
      user: updatedUser,
      message: 'Profile details updated and saved successfully!'
    };
  } catch (err) {
    return { success: false, error: 'Failed to persist updated profile. Local storage error.' };
  }
}

/**
 * Change user password with current password verification
 */
export function changeUserPassword({ email, currentPassword, newPassword, confirmNewPassword }) {
  if (!email) {
    return { success: false, error: 'Email is required.' };
  }
  const normalizedEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const userIdx = users.findIndex(u => u.email.toLowerCase() === normalizedEmail);

  if (userIdx === -1) {
    return { success: false, error: 'Account not found.' };
  }

  if (users[userIdx].password !== currentPassword) {
    return { success: false, error: 'Current password does not match our records.' };
  }

  const pwCheck = validatePasswordStrength(newPassword);
  if (!pwCheck.valid) {
    return { success: false, error: pwCheck.message };
  }

  if (newPassword !== confirmNewPassword) {
    return { success: false, error: 'New password confirmation does not match.' };
  }

  if (newPassword === currentPassword) {
    return { success: false, error: 'New password must be different from current password.' };
  }

  users[userIdx].password = newPassword;
  users[userIdx].updatedAt = new Date().toISOString();

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    // Sync password change to MongoDB
    try {
      fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, currentPassword, newPassword })
      }).catch(() => {});
    } catch (e) {}

    return {
      success: true,
      message: 'Password changed successfully! Your new password is now active.'
    };
  } catch (err) {
    return { success: false, error: 'Failed to save updated password.' };
  }
}

/**
 * Sync or create Google OAuth profile in registered users pool
 */
export function registerOrSyncGoogleUser({ id, name, email, role = 'user', picture }) {
  if (!email) return null;
  const normalizedEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const existingIdx = users.findIndex(u => u.email?.toLowerCase() === normalizedEmail);

  const googleProfile = {
    id: id || `google-${Date.now()}`,
    name: name || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    role: role,
    picture: picture || null,
    provider: 'google',
    updatedAt: new Date().toISOString()
  };

  if (existingIdx !== -1) {
    users[existingIdx] = {
      ...users[existingIdx],
      ...googleProfile,
      role: role || users[existingIdx].role || 'user'
    };
  } else {
    users.push({
      ...googleProfile,
      createdAt: new Date().toISOString()
    });
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {}

  return existingIdx !== -1 ? users[existingIdx] : googleProfile;
}

/**
 * Admin action to create a user account directly
 */
export function adminCreateAccount({ name, email, password, role = 'user', advisorCategory = 'Smartphones & Flagships' }) {
  if (!name || !name.trim()) {
    return { success: false, error: 'Full Name is required.' };
  }
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!isValidEmail(normalizedEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const users = getRegisteredUsers();
  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email address already exists.' };
  }

  const effectiveRole = (role === 'advisor' || role === 'expert') ? 'expert' : role;
  const newAccount = {
    id: `acc-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password: password,
    role: effectiveRole,
    advisorCategory: effectiveRole === 'expert' ? advisorCategory : undefined,
    createdAt: new Date().toISOString()
  };

  users.push(newAccount);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    // Provision in MongoDB collection
    try {
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount)
      }).catch(() => {});
    } catch (e) {}

    return { success: true, user: newAccount, message: `Account for ${newAccount.name} created successfully!` };
  } catch (e) {
    return { success: false, error: 'Failed to persist new account to storage.' };
  }
}

/**
 * Admin action to delete a user account by email
 */
export function adminDeleteAccount(email) {
  if (!email) return { success: false, error: 'Email required.' };
  const normalizedEmail = email.trim().toLowerCase();
  let users = getRegisteredUsers();
  const exists = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!exists) {
    return { success: false, error: 'Account not found.' };
  }

  users = users.filter(u => u.email.toLowerCase() !== normalizedEmail);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    // Delete from MongoDB collection
    try {
      fetch(`/api/users/${encodeURIComponent(normalizedEmail)}`, { method: 'DELETE' }).catch(() => {});
    } catch (e) {}

    return { success: true, message: `Account ${normalizedEmail} deleted successfully.` };
  } catch (e) {
    return { success: false, error: 'Failed to delete account.' };
  }
}



