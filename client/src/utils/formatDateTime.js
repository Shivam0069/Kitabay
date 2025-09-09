export const formatDateAndTime = (timeStamp) => {
  const date = new Date(timeStamp);
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getFullYear())}`;
  const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
  const result = `${formattedDate} ${formattedTime}`;
  return result;
};
export const formatDate = (timeStamp) => {
  const date = new Date(timeStamp);
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getFullYear())}`;

  return formattedDate;
};
