export const hasPermission = (user, module, action) => {
  if (!user) return false;

  // 🔥 Admin full access
  if (user.isAdmin || user.role?.permissions?.ALL) {
    return true;
  }

  // 🔐 Normal role check
  return !!user.role?.permissions?.[module]?.[action];
};