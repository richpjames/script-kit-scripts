// Name: daily log
// Schedule: 0 9 * * *
// Index: 0

import "@johnlindquist/kit";

const nonWorkTemplate = `# {{numberOfEntries}} {{today}}
  
## What happened
-

## What was good
-

## What I learned
-
  
## Picture of the day  
`;

const workTemplate = `# {{numberOfEntries}} {{today}}
  
## What happened
-

## What was good
-

## What I learned
-
`;

const dateFns = await npm("date-fns");
const { render } = await npm("mustache");
const logDir = await env("LOG_DIRECTORY");
const workLogDir = await env("WORK_LOG_DIRECTORY");
const today = dateFns.format(new Date(), "dd-MM-yy");

const getIndex = async (dirName) => {
  const notes = await readdir(dirName);

  const indexOfTodaysNote = notes.indexOf((note) => note.includes(today));

  if (indexOfTodaysNote >= 0)
    await div(`Note for today (${today}) already exists`);

  let numberOfEntries = 0;

  notes.forEach((note) => {
    if (note.endsWith(".md")) numberOfEntries++;
  });

  return numberOfEntries;
};

const getFileName = async (dirName, today) => {
  const index = await getIndex(dirName);

  return `${index} ${today}.md`;
};

const renderTemplate = (template, index, today) =>
  render(template, { index, today });

const makeLogEntry = async (dirName, today, template, type) => {
  const index = await getIndex(dirName);
  const fileName = await getFileName(dirName, today);
  const markdown = renderTemplate(template, index, today);
  await writeFile(`${dirName}/${fileName}`, markdown);
  await div(`wrote a new ${type} log file for ${fileName}`);
};

makeLogEntry(workLogDir, today, workTemplate, "work");
makeLogEntry(logDir, today, nonWorkTemplate, "not work");
