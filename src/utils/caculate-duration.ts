export function caculateDuration(timeSent: Date | null): string {
   if (!timeSent) {
      return "Không xác định";
   }
   const temp = new Date(timeSent);

   const now = new Date();   

   const diff = now.getTime() - temp.getTime(); // Difference in milliseconds

   const seconds = Math.floor(diff / 1000);
   const minutes = Math.floor(seconds / 60);
   const hours = Math.floor(minutes / 60);
   const days = Math.floor(hours / 24);

   if (days > 0) {
      return `${days} ngày trước`;
   } else if (hours > 0) {
      return `${hours} giờ trước`;
   } else if (minutes > 0) {
      return `${minutes} phút trước`;
   } else {
      return `Vài giây`;
   }
}