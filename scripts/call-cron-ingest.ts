const ingestUrl = process.env.ZHIYU_INGEST_URL;
const cronSecret = process.env.CRON_SECRET;

async function main() {
  if (!ingestUrl) {
    throw new Error("ZHIYU_INGEST_URL is required.");
  }
  if (!cronSecret) {
    throw new Error("CRON_SECRET is required.");
  }

  const response = await fetch(ingestUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${cronSecret}`
    }
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Cron ingest failed with ${response.status}: ${body}`);
  }

  console.log(body);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
