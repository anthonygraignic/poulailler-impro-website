module.exports = {
  eleventyComputed: {
    start: (data) => {
      // Map 'date' to 'start' for the calendar plugin
      if (data.date && !data.start) {
        // If time is provided, combine date and time
        if (data.time) {
          // Parse time (format: "20h30" or "20:30")
          const timeMatch = data.time.match(/(\d{1,2})[h:](\d{2})/);
          if (timeMatch) {
            const [, hours, minutes] = timeMatch;
            // Create ISO datetime string
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
      // Map 'place' to 'location' for the calendar plugin
      return data.location || data.place;
    },
    description: (data) => {
      // Ensure description is not null for ICS export
      return (
        data.description ||
        `${data.title || "Spectacle"} au Poulailler de l'impro`
      );
    },
    duration: (data) => {
      // Default duration of 1 hour and 30 minutes if not specified
      return data.duration || { hours: 1, minutes: 30 };
    },
  },
};
