"use client"
import { TooltipTrigger,Tooltip, TooltipContent } from "./ui/tooltip"

export function FriendlyTime({dateString}: {dateString:string}) {
    let date = new Date()
    try{
        date = new Date(dateString)
    }catch(e){
        console.error("Invalid date format", e)
        return <div>{dateString}</div>
    }
    console.log("date", date)
    const time = new Date(date);
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);   
    const years = Math.floor(months / 12);
    let result = "";
    if (years > 0) {
        result = `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
        result = `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
        result = `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
        result = `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
        result = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
        result = `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }   
    return (
        <Tooltip>
        <TooltipTrigger>       <span className="hover">{result}</span></TooltipTrigger>
        <TooltipContent>
          <p>{dateString}</p>
        </TooltipContent>
      </Tooltip>
     

    )
}