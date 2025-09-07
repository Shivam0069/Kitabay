export const calculateFine = (dueDate, bookPrice) => {
  const now = new Date();

  // No fine if returned on or before due date
  if (now <= dueDate) {
    return 0;
  }

  const diffTime = now - dueDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const dailyRate = bookPrice / 7; // rate per day
  const finePerDay = dailyRate * 2; // fine = double daily rate
  let fine = diffDays * finePerDay;

  // Cap fine at 2x the borrowing rate (can tweak)
  const maxFine = bookPrice * 2;
  fine = Math.min(fine, maxFine);

  return Number(fine.toFixed(2));
};
