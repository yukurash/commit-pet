'use strict';

// Fetch a user's contribution calendar via GitHub GraphQL.
// Returns [{ date, count }] for the past year. Uses global fetch (Node >=18).

async function fetchCalendar(username, token) {
  if (!token) throw new Error('GITHUB_TOKEN is required for live mode (pass --token or set GITHUB_TOKEN).');

  const query = `query($login:String!){
    user(login:$login){
      contributionsCollection{
        contributionCalendar{
          totalContributions
          weeks{ contributionDays{ date contributionCount } }
        }
      }
    }
  }`;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'commit-pet',
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GitHub API ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  if (json.errors && json.errors.length) {
    throw new Error('GraphQL error: ' + json.errors.map((e) => e.message).join('; '));
  }

  const cal = json.data && json.data.user && json.data.user.contributionsCollection.contributionCalendar;
  if (!cal) throw new Error(`No contribution data for user "${username}".`);

  const days = [];
  for (const w of cal.weeks) {
    for (const d of w.contributionDays) {
      days.push({ date: d.date, count: d.contributionCount });
    }
  }
  return days;
}

module.exports = { fetchCalendar };
