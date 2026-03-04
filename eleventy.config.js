import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import pluginRss from "@11ty/eleventy-plugin-rss";
import calendarPlugin from "@codegouvfr/eleventy-plugin-calendar";
import fs from "fs";
import path from "path";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import cssnano from "cssnano";

export default function (eleventyConfig) {
  // Compile Tailwind CSS before Eleventy processes files
  eleventyConfig.on("eleventy.before", async () => {
    const tailwindInputPath = path.resolve("./src/css/tailwind.css");
    const tailwindOutputPath = "./public/css/styles.css";

    const cssContent = fs.readFileSync(tailwindInputPath, "utf8");

    const outputDir = path.dirname(tailwindOutputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const result = await processor.process(cssContent, {
      from: tailwindInputPath,
      to: tailwindOutputPath,
    });

    fs.writeFileSync(tailwindOutputPath, result.css);
  });

  const processor = postcss([
    tailwindcss(),
    cssnano({
      preset: "default",
    }),
  ]);

  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addFilter("addCalendarPrefix", (events) => {
    return events.map((event) => ({
      ...event,
      data: {
        ...event.data,
        title: `Poulailler de l'impro - ${event.data.title}`,
      },
    }));
  });

  eleventyConfig.addPlugin(calendarPlugin, {
    defaultLocation: "France",
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addNunjucksGlobal(
    "upcomingEvent",
    (eventDate) => Date.parse(eventDate) > new Date().getTime(),
  );
  eleventyConfig.addFilter("past", function (collection) {
    return collection
      .filter((item) => Date.parse(item.data.date) < new Date())
      .sort(function (a, b) {
        return b.date - a.date;
      });
  });
  eleventyConfig.addFilter("upcoming", function (collection) {
    return collection
      .filter((item) => Date.parse(item.data.date) >= new Date())
      .sort(function (a, b) {
        return a.date - b.date;
      });
  });
  eleventyConfig.addFilter("limit", function (array, limit) {
    return array.slice(0, limit);
  });
  eleventyConfig.addFilter("toYear", function (date) {
    return new Date(Date.parse(date)).getFullYear();
  });
  eleventyConfig.addFilter(
    "betweenDates",
    function (collection, startDate, endDate) {
      const start = Date.parse(startDate);
      const end = Date.parse(endDate);
      return collection
        .filter((item) => {
          const itemDate = Date.parse(item.data.date);
          return itemDate >= start && itemDate <= end;
        })
        .sort(function (a, b) {
          return a.date - b.date;
        });
    },
  );
  eleventyConfig.addFilter("nextShow", (collection) => {
    const now = new Date();
    const upcoming = collection
      .filter((show) => new Date(show.data.date) >= now)
      .sort((a, b) => new Date(a.data.date) - new Date(b.data.date));

    return upcoming.length > 0 ? upcoming[0] : null;
  });

  return {
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts",
      output: "public",
    },
  };
}
