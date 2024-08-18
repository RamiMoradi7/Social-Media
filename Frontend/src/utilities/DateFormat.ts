export const dateFormat = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options);
};

export const lastLoginFormat = (date: Date): string => {
  const lastLogin = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - lastLogin.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) {
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m ago`;
  }

  const days = Math.floor(diffMinutes / 1440);
  return `${days}d ago`;
};
