import moment from "moment";

// Calculate Elapsed Time
const calculateElapsedTime = (date: any) => {
    const minutesDifference = moment().diff(date, "minutes");
  
    const timeUnits = [
      { value: 525600, singular: "yr", plural: "yrs" },
      { value: 43800, singular: "mo", plural: "mos" },
      { value: 10080, singular: "wk", plural: "wks" },
      { value: 1440, singular: "day", plural: "days" },
      { value: 60, singular: "hr", plural: "hrs" },
      { value: 1, singular: "min", plural: "mins" },
    ];
  
    for (const unit of timeUnits) {
      if (minutesDifference >= unit.value) {
        const quantity = Math.floor(minutesDifference / unit.value);
        return `${quantity} ${quantity === 1 ? unit.singular : unit.plural}`;
      }
    }
  
    return "Just now";
  };

  export { calculateElapsedTime }