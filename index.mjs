import fetch from "node-fetch";

const run = async () => {
  const foundPaths = [];
  const queuedPaths = [];
  let firstRun = true;

  const initialDomain = process.argv[2];
  const matchRegex = /href=(?:['"])([^'"]+)/g;

  while (true) {
    let target;
    if (firstRun) {
      target = initialDomain;
      firstRun = false;
    } else {
      if (!queuedPaths.length) {
        break;
      }
      target = queuedPaths.shift();
    }
    console.log(target);
    const res = await fetch(target);
    const text = await res.text();

    Array.from(text.matchAll(matchRegex)).forEach((match) => {
      let candidate = decodeURIComponent(match[1]).replaceAll("&#x2F;", "/");
      if (candidate.startsWith("/")) {
        candidate = initialDomain + candidate;
      }
      if (
        candidate.startsWith(initialDomain) &&
        !foundPaths.includes(candidate)
      ) {
        foundPaths.push(candidate);
        queuedPaths.push(candidate);
      }
    });
  }
};

run();
