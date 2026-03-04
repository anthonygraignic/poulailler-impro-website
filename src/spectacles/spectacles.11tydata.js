export default {
  eleventyComputed: {
    start: (data) => {
      if (data.date && !data.start) {
        if (data.time) {
          const timeMatch = data.time.match(/(\d{1,2})[h:](\d{2})/);
          if (timeMatch) {
            const [, hours, minutes] = timeMatch;
            const dateStr =
              typeof data.date === "string"
                ? data.date
                : data.date.toISOString().split("T")[0];
            return `${dateStr}T${hours.padStart(2, "0")}:${minutes}:00`;
          }
        }
        return data.date;
      }
      return data.start;
    },
    location: (data) => {
      return data.location || data.place;
    },
    description: (data) => {
      return (
        data.description ||
        `${data.title || "Spectacle"} au Poulailler de l'impro`
      );
    },
    duration: (data) => {
      return data.duration || { hours: 1, minutes: 30 };
    },
  },
};
