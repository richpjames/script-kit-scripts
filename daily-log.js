// Name: daily log
// Schedule: 0 9 * * *

import "@johnlindquist/kit";

const dateFns = await npm("date-fns");
const { render } = await npm("mustache");
const today = dateFns.format(new Date(), "dd-MM-yy");

const logDir = await env("LOG_DIRECTORY");

const notes = await readdir(logDir);

const indexOfTodaysNote = notes.indexOf((note) => note.includes(today));

if (indexOfTodaysNote >= 0)
  await div(`Note for today (${today}) already exists`);

let numberOfEntries = 0;

notes.forEach((note) => {
  if (note.endsWith(".md")) numberOfEntries++;
});

const fileName = `${numberOfEntries} ${today}.md`;

const template = `# {{numberOfEntries}} {{today}}
  
## What happened
-

## What was good
-

## What I learned
-
  
## Picture of the day  
`;

const markdown = render(template, { numberOfEntries, today });

await writeFile(`${logDir}/${fileName}`, markdown);
await div(`wrote a new file for ${fileName}`);
