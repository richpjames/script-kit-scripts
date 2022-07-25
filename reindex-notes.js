import "@johnlindquist/kit";

const { rename } = await npm("file-manager-js");
const logDir = await env("LOG_DIRECTORY");

const notes = await readdir(logDir);

const mappedNotes = notes
  .filter((note) => note.endsWith(".md"))
  .map((note) => note.split(" "));

const sortedNotes = mappedNotes.sort((a, b) => a[0] - b[0]);

for (let i = 0; i < sortedNotes.length; i++) {
  const path = `${logDir}${sortedNotes[i][0]} ${sortedNotes[i][1]}`;
  await rename(path, `${logDir}${i + 1} ${sortedNotes[i][1]}`);
}

// await div(`${sortedNotes}`);
