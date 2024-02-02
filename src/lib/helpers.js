export const kebabToTitle = (str) => {
    return str !== "/"
        ? str
              .replace("/", "")
              .split("-")
              .map((word) => word[0].toUpperCase() + word.slice(1))
              .join(" ")
        : "";
};
