export interface UserInfo {
  username: string | null;
  userId: string;
}

export function getUserInfo(): UserInfo {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("userId", userId);
  }
  return {
    userId: userId,
    username: localStorage.getItem("username"),
  };
}

export function setUsername(username: string) {
  localStorage.setItem("username", username);
}
