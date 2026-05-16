export const adminEmails = ["auiauiaui128@gmail.com"];

export function isAdminEmail(email?: string | null) {
  return Boolean(email && adminEmails.includes(email));
}
