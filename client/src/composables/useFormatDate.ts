import { format } from "date-fns";

export const formatDate = (date: Date | undefined): string => {
  if (!date) {
    return "Date not available";
  }
  return format(date, "dd-MM-yyyy");
};
