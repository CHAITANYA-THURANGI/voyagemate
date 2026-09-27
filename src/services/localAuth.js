// Professional local authentication using localStorage
// Includes Google Sign-in simulation

// User storage key
const USERS_KEY = 'voyagemate_users';
const CURRENT_USER_KEY = 'voyagemate_current_user';

// Simple hash function for demo (in production, use proper backend)
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

// Generate random avatar
const generateAvatar = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&length=1`;
};

// Initialize with empty users array
const initializeUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
  }
};

// Call initialize
initializeUsers();

// Get all users
const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Local Auth Functions
export const localAuth = {
  // Sign up new user
  signup: async (email, password, name) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        
        // Check if user exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          reject(new Error('An account with this email already exists'));
          return;
        }

        // Validate password strength
        if (password.length < 8) {
          reject(new Error('Password must be at least 8 characters long'));
          return;
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          password: simpleHash(password),
          phone: '',
          gender: '',
          dateOfBirth: '',
          avatar: generateAvatar(name),
          provider: 'email',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stats: {
            totalBookings: 0,
            totalSpent: 0,
            rewardPoints: 0
          },
          preferences: {
            notifications: true,
            emailUpdates: true,
            smsAlerts: false
          }
        };

        users.push(newUser);
        saveUsers(users);

        // Don't return password
        const { password: _, ...userWithoutPassword } = newUser;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        
        resolve(userWithoutPassword);
      }, 800);
    });
  },

  // Login with email/password
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const user = users.find(u => u.email === email && u.provider === 'email');

        if (!user) {
          reject(new Error('Invalid email or password'));
          return;
        }

        // Hash the input password and compare
        const hashedPassword = simpleHash(password);
        if (user.password !== hashedPassword) {
          reject(new Error('Invalid email or password'));
          return;
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        saveUsers(users);

        // Don't return password
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        
        resolve(userWithoutPassword);
      }, 800);
    });
  },

  // Login with Google
  loginWithGoogle: async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = getUsers();
          
          // Generate random Google-like email
          const randomId = Math.floor(Math.random() * 10000);
          const googleEmail = `user${randomId}@gmail.com`;
          const googleName = `User ${randomId}`;
          
          // Check if this Google user already exists
          let user = users.find(u => u.email === googleEmail && u.provider === 'google');
          
          if (!user) {
            // Create new Google user
            user = {
              id: `google_${Date.now()}`,
              name: googleName,
              email: googleEmail,
              password: null, // No password for Google users
              phone: '',
              gender: '',
              dateOfBirth: '',
              avatar: generateAvatar(googleName),
              provider: 'google',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              stats: {
                totalBookings: 0,
                totalSpent: 0,
                rewardPoints: 0
              },
              preferences: {
                notifications: true,
                emailUpdates: true,
                smsAlerts: false
              }
            };

            users.push(user);
            saveUsers(users);
          }

          // Update last login
          user.lastLogin = new Date().toISOString();
          saveUsers(users);

          // Don't return password (though it's null anyway)
          const { password: _, ...userWithoutPassword } = user;
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
          
          resolve(userWithoutPassword);
        } catch (error) {
          reject(new Error('Google sign-in failed'));
        }
      }, 800);
    });
  },

  // Logout
  logout: async () => {
    return new Promise((resolve) => {
      localStorage.removeItem(CURRENT_USER_KEY);
      resolve();
    });
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Update user profile
  updateProfile: async (userId, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }

        // Update user (don't update password through this method)
        const { password, ...updateData } = data;
        users[userIndex] = { 
          ...users[userIndex], 
          ...updateData, 
          updatedAt: new Date().toISOString() 
        };
        saveUsers(users);

        // Update current user if it's the same user
        const currentUser = localAuth.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          const { password: _, ...updatedUser } = users[userIndex];
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
        }

        const { password: _, ...updatedUser } = users[userIndex];
        resolve(updatedUser);
      }, 800);
    });
  },

  // Change password
  changePassword: async (userId, currentPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }

        // Check if user is email provider (Google users can't change password)
        if (users[userIndex].provider !== 'email') {
          reject(new Error('Password change not available for Google accounts'));
          return;
        }

        // Verify current password
        const hashedCurrent = simpleHash(currentPassword);
        if (users[userIndex].password !== hashedCurrent) {
          reject(new Error('Current password is incorrect'));
          return;
        }

        // Validate new password
        if (newPassword.length < 8) {
          reject(new Error('New password must be at least 8 characters long'));
          return;
        }

        // Update password
        users[userIndex].password = simpleHash(newPassword);
        users[userIndex].updatedAt = new Date().toISOString();
        saveUsers(users);

        resolve(true);
      }, 800);
    });
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem(CURRENT_USER_KEY);
  },

  // Delete account
  deleteAccount: async (userId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let users = getUsers();
        users = users.filter(u => u.id !== userId);
        saveUsers(users);
        
        // Clear current user if deleted
        const currentUser = localAuth.getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          localStorage.removeItem(CURRENT_USER_KEY);
        }
        
        resolve(true);
      }, 800);
    });
  }
};