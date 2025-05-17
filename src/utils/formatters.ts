// src/utils/formatters.ts
import { Job } from "../types/job";

/**
 * Calculate a hash based on the job ID for testing purposes
 */
export const calculateHash = (jobId: string | number): number => {
    const idString = String(jobId).trim();
    return Array(idString).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  };
  

  export const formatSalary = (amount: number): string => {
    if (amount < 1000) return `${amount}`; // Return as is for smaller values
    if (amount >= 10_000_000) return `${(amount / 10_000_000).toFixed(0)} Cr`;
    if (amount >= 100_000) return `${(amount / 100_000).toFixed(0)} L`;
    return `${(amount / 1_000).toFixed(0)} k`;
  };
  

  export const getSalaryRange = (salary: number): string => {
    let min = Math.floor(salary * 0.9);
    let max = Math.ceil(salary * 1.1);
  
    if (min === max) {
      min -= 1000;
      max += 1000;
    }
  
    if (formatSalary(min) === formatSalary(max)) {
      return `${formatSalary(min)}`;
    }

    return `${formatSalary(min)} - ${formatSalary(max)}`;
  };
  

//   export const getDaysAgo = (post_date: string): string => {
//     const postDate = new Date(post_date);
//     const currentDate = new Date();
  
// let years = currentDate.getUTCFullYear() - postDate.getUTCFullYear();
// let months = currentDate.getUTCMonth() - postDate.getUTCMonth();
// let days = currentDate.getUTCDate() - postDate.getUTCDate();
  
//     if (days < 0) {
//       months--;
//       const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
//       days += prevMonth.getDate();
//     }
  
//     if (months < 0) {
//       years--;
//       months += 12;
//     }
  
//     if (years > 0) {
//       return `Posted ${years} year${years > 1 ? 's' : ''} ago`;
//     } else if (months > 0) {
//       return `Posted ${months} month${months > 1 ? 's' : ''} ago`;
//     } else if (days > 0) {
//       return `Posted ${days} day${days > 1 ? 's' : ''} ago`;
//     } else {
//       return "Posted recently";
//     }
//   };

export const getDaysAgo = (post_date: string): string => {
  const postDate = new Date(post_date);
  const currentDate = new Date();

  let years = currentDate.getUTCFullYear() - postDate.getUTCFullYear();
  let months = currentDate.getUTCMonth() - postDate.getUTCMonth();
  let days = currentDate.getUTCDate() - postDate.getUTCDate();

  if (days < 0) {
    months--;

    // Get the number of days in the previous UTC month
    const prevMonthDate = new Date(Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      0 // Day 0 gives last day of previous month
    ));
    days += prevMonthDate.getUTCDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years > 0) {
    return `Posted ${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `Posted ${months} month${months > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `Posted ${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return "Posted recently";
  }
};

  
export const sortJobsByDate = (jobs: Job[]): Job[] => {
  return [...jobs].sort((a, b) => {
    const dateA = new Date(a.post_date).getTime(); // Handles UTC
    const dateB = new Date(b.post_date).getTime();
    return dateB - dateA; // Descending order: latest first
  });
};
  
  /**
   * Get color for workplace type chip
   */
  export const getWorkplaceTypeColor = (type: string): { background: string; color: string } => {
    const colors: Record<string, { background: string; color: string }> = {
      "Remote": { background: "rgba(33, 150, 243, 0.1)", color: "rgb(21, 101, 192)" },
      "Hybrid": { background: "rgba(156, 39, 176, 0.1)", color: "rgb(106, 27, 154)" },
      "On-site": { background: "rgba(255, 152, 0, 0.1)", color: "rgb(230, 81, 0)" },
    };
  
    return colors[type] || { background: "rgba(200, 200, 200, 0.1)", color: "rgb(100, 100, 100)" };
  };