// 11/12/2023 
export const changeDateToString = (date: Date | null): string => {
   if (!date) return "-";

   const datetemp = new Date(date);

   const day = String(datetemp.getDate()).padStart(2, "0");
   const month = String(datetemp.getMonth() + 1).padStart(2, "0"); // Months are zero-based
   const year = String(datetemp.getFullYear());
   return `${day}/${month}/${year}`;
   }