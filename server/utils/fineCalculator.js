export const calculateFine = (dueDate, bookPrice) => {
  const now = new Date();
  if (now <= dueDate) {
    return 0; // No fine if returned on or before due date
  }
  const diffTime = Math.abs(now - dueDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const finePerDay = bookPrice / 7 + 30; // Define fine per day
  return diffDays * finePerDay;
};
