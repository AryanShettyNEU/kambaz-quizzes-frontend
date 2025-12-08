export const formatToReadable = (str: string) => {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const getAvailabilityMsg = (quiz: any) => {
  const now = new Date();
  const start = new Date(quiz.availableDate);
  const end = new Date(quiz.dueDate);
  if (now > end) return "Closed";
  if (now < start) return `Not available until ${start.toLocaleDateString()}`;
  return "Available";
};

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().split("T")[0];
  } catch (e) {
    return "";
  }
};