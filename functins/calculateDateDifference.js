export default function calculateDateDifference(date1, date2) {
    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(date2 - date1);
  
    // Convert the time difference to seconds, minutes, and hours
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
  
    return {
      seconds: seconds,
      minutes: minutes,
      hours: hours
    };
  }