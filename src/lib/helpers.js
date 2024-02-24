export const kebabToTitle = (str) => {
    return str !== "/"
        ? str
              .replace("/", "")
              .split("-")
              .map((word) => word[0].toUpperCase() + word.slice(1))
              .join(" ")
        : "";
};

export const formatSecondstoTime = (seconds) => {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var remainingSeconds = seconds % 60;

    if (remainingSeconds > 30) {
        minutes += 1;
    }

    if (minutes === 60) {
        hours += 1;
        minutes = 0;
    }

    var result = hours + " jam";

    if (minutes > 0) {
        result += " " + minutes + " menit";
    }

    return result;
};

export const splitString = (str, splitter) => {
    return str.split(splitter).slice(0, 4).join(", ");
};
