#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const LINEAR_API_URL = 'https://api.linear.app/graphql';
const DEFAULT_PRDS_DIR = path.resolve('docs/prds');
const INDEX_FILE = 'prd-2026-07-14-00-indice-linear.md';

function usage() {
  return `
Usage:
  LINEAR_API_KEY=... npm run linear:teams
  LINEAR_API_KEY=... npm run linear:import-prds -- --team <team-key|team-id|team-name>
  LINEAR_API_KEY=... npm run linear:import-prds -- --team <team> --execute
  LINEAR_API_KEY=... npm run linear:import-prds -- --team <team> --update-existing --execute
  LINEAR_API_KEY=... npm run linear:import-prds -- --team <team> --assign-to "Nombre Apellido" --update-existing --execute
  npm run linear:import-prds -- --offline

Options:
  --list-teams          Lists available Linear teams and exits.
  --team <value>        Team key, id, or exact/lowercase name to create issues in.
  --assign-to <value>   Optional Linear assignee id, email, name, or display name.
  --project-id <id>     Optional Linear project id for all created issues.
  --prds-dir <path>     PRD root directory. Defaults to docs/prds.
  --offline             Prints the local import plan without calling Linear.
  --update-existing     Updates matching Linear issues instead of only skipping them.
  --fail-on-duplicate   Aborts if an existing Linear issue matches a PRD.
  --no-dedupe           Disables duplicate checks. Not recommended.
  --execute             Actually creates issues. Without this, runs a dry-run.
  --limit <number>      Imports only the first N issue folders, useful for testing.

Notes:
  - The script reads LINEAR_API_KEY from the environment.
  - It never writes the API key to disk.
  - Duplicate checks are enabled by default; use dry-run first anyway.
`;
}

function parseArgs(argv) {
  const args = {
    execute: false,
    listTeams: false,
    prdsDir: DEFAULT_PRDS_DIR,
    team: undefined,
    assignTo: undefined,
    projectId: undefined,
    limit: undefined,
    offline: false,
    updateExisting: false,
    failOnDuplicate: false,
    dedupe: true,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--execute') args.execute = true;
    else if (arg === '--list-teams') args.listTeams = true;
    else if (arg === '--team') args.team = argv[++i];
    else if (arg === '--assign-to') args.assignTo = argv[++i];
    else if (arg === '--project-id') args.projectId = argv[++i];
    else if (arg === '--prds-dir') args.prdsDir = path.resolve(argv[++i]);
    else if (arg === '--offline') args.offline = true;
    else if (arg === '--update-existing') args.updateExisting = true;
    else if (arg === '--fail-on-duplicate') args.failOnDuplicate = true;
    else if (arg === '--no-dedupe') args.dedupe = false;
    else if (arg === '--limit') args.limit = Number(argv[++i]);
    else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function getApiKey() {
  const key = process.env.LINEAR_API_KEY?.trim();
  if (!key) {
    throw new Error('Missing LINEAR_API_KEY. Export it in your shell before running this script.');
  }
  return key;
}

async function linearRequest(apiKey, query, variables = {}) {
  const response = await fetch(LINEAR_API_URL, {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.errors?.length) {
    const message = payload?.errors?.map((e) => e.message).join('; ') || response.statusText;
    throw new Error(`Linear API error: ${message}`);
  }
  return payload.data;
}

async function listTeams(apiKey) {
  const data = await linearRequest(apiKey, `
    query ListTeams {
      viewer { id name }
      organization { id name urlKey }
      teams(first: 100) {
        nodes { id key name }
      }
    }
  `);

  return data;
}

async function listUsers(apiKey) {
  const users = [];
  let after = null;

  do {
    const data = await linearRequest(apiKey, `
      query ListUsers($after: String) {
        users(first: 250, after: $after) {
          nodes { id name displayName email active }
          pageInfo { hasNextPage endCursor }
        }
      }
    `, { after });

    users.push(...data.users.nodes);
    after = data.users.pageInfo.hasNextPage ? data.users.pageInfo.endCursor : null;
  } while (after);

  return users;
}

function normalizeUserValue(value) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function resolveUser(users, wanted) {
  if (!wanted) return null;

  const normalized = normalizeUserValue(wanted);
  const activeUsers = users.filter((user) => user.active !== false);
  const matches = activeUsers.filter((user) =>
    user.id === wanted ||
    normalizeUserValue(user.email || '') === normalized ||
    normalizeUserValue(user.name || '') === normalized ||
    normalizeUserValue(user.displayName || '') === normalized
  );

  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    throw new Error(`Multiple Linear users match "${wanted}": ${matches.map((user) => `${user.name || user.displayName} <${user.email}>`).join(', ')}`);
  }

  const partialMatches = activeUsers.filter((user) =>
    normalizeUserValue(user.email || '').includes(normalized) ||
    normalizeUserValue(user.name || '').includes(normalized) ||
    normalizeUserValue(user.displayName || '').includes(normalized)
  );

  if (partialMatches.length === 1) return partialMatches[0];
  if (partialMatches.length > 1) {
    throw new Error(`Multiple Linear users partially match "${wanted}": ${partialMatches.map((user) => `${user.name || user.displayName} <${user.email}>`).join(', ')}`);
  }

  throw new Error(`Could not find active Linear user "${wanted}".`);
}

function resolveTeam(teams, wanted) {
  if (!wanted) {
    if (teams.length === 1) return teams[0];
    throw new Error(`Multiple Linear teams found. Pass --team with one of: ${teams.map((t) => `${t.key} (${t.name})`).join(', ')}`);
  }

  const normalized = wanted.toLowerCase();
  const team = teams.find((t) =>
    t.id === wanted ||
    t.key.toLowerCase() === normalized ||
    t.name.toLowerCase() === normalized
  );

  if (!team) {
    throw new Error(`Could not find Linear team "${wanted}". Available: ${teams.map((t) => `${t.key} (${t.name})`).join(', ')}`);
  }
  return team;
}

async function readMarkdown(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const titleMatch = content.match(/^# PRD:\s+(.+)$/m);
  return {
    title: titleMatch?.[1]?.trim() || path.basename(filePath, '.md'),
    description: content.trim(),
  };
}

function priorityToLinear(priority) {
  switch (priority) {
    case 'P0': return 1; // Urgent
    case 'P1': return 2; // High
    case 'P2': return 3; // Medium
    default: return 0; // No priority
  }
}

function markerFor(slug) {
  return `prodbooster-linear-prd:${slug}`;
}

function descriptionWithMarker(description, slug, parentSlug) {
  const lines = [
    description.trim(),
    '',
    `<!-- ${markerFor(slug)} -->`,
  ];
  if (parentSlug) lines.push(`<!-- prodbooster-linear-parent:${parentSlug} -->`);
  return lines.join('\n');
}

function normalizeTitle(title) {
  return title.trim().toLowerCase().replace(/\s+/g, ' ');
}

async function parseIndex(prdsDir) {
  const indexPath = path.join(prdsDir, INDEX_FILE);
  const priorities = new Map();
  const issueOrder = new Map();
  const subissueOrder = new Map();
  let content = '';

  try {
    content = await fs.readFile(indexPath, 'utf8');
  } catch {
    return { priorities, issueOrder, subissueOrder };
  }

  let currentIssue;
  let currentIssueIndex = 0;
  let currentSubissueIndex = 0;
  for (const line of content.split('\n')) {
    const issueMatch = line.match(/^###\s+(.+)$/);
    if (issueMatch) {
      currentIssue = issueMatch[1].trim();
      issueOrder.set(currentIssue, currentIssueIndex);
      currentIssueIndex += 1;
      currentSubissueIndex = 0;
      continue;
    }

    const parentPriority = line.match(/^- \*\*Prioridad:\*\*\s+(P\d)/);
    if (currentIssue && parentPriority) {
      priorities.set(currentIssue, parentPriority[1]);
      continue;
    }

    const subissue = line.match(/^\|\s*([^|\s][^|]*?)\s*\|\s*`[^`]+`\s*\|\s*(P\d)\s*\|/);
    if (subissue) {
      const subissueSlug = subissue[1].trim();
      priorities.set(subissueSlug, subissue[2]);
      if (currentIssue) {
        subissueOrder.set(`${currentIssue}/${subissueSlug}`, currentSubissueIndex);
        currentSubissueIndex += 1;
      }
    }
  }

  return { priorities, issueOrder, subissueOrder };
}

function slugFromSubissueFile(filename) {
  return filename
    .replace(/^prd-\d{4}-\d{2}-\d{2}-/, '')
    .replace(/\.md$/, '');
}

async function discoverPrds(prdsDir, index) {
  const entries = await fs.readdir(prdsDir, { withFileTypes: true });
  const issueDirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => {
      const orderA = index.issueOrder.get(a) ?? Number.MAX_SAFE_INTEGER;
      const orderB = index.issueOrder.get(b) ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB || a.localeCompare(b, 'es');
    });

  const issues = [];
  for (const issueSlug of issueDirs) {
    const issuePath = path.join(prdsDir, issueSlug, 'issue.md');
    const subissuesDir = path.join(prdsDir, issueSlug, 'subissues');
    const issue = await readMarkdown(issuePath);
    const subissueFiles = await fs.readdir(subissuesDir).catch(() => []);
    const subissues = [];

    const sortedSubissueFiles = subissueFiles
      .filter((name) => name.endsWith('.md'))
      .sort((a, b) => {
        const slugA = slugFromSubissueFile(a);
        const slugB = slugFromSubissueFile(b);
        const orderA = index.subissueOrder.get(`${issueSlug}/${slugA}`) ?? Number.MAX_SAFE_INTEGER;
        const orderB = index.subissueOrder.get(`${issueSlug}/${slugB}`) ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB || a.localeCompare(b, 'es');
      });

    for (const filename of sortedSubissueFiles) {
      const slug = slugFromSubissueFile(filename);
      subissues.push({
        slug,
        filePath: path.join(subissuesDir, filename),
        priority: index.priorities.get(slug) || 'P1',
        ...(await readMarkdown(path.join(subissuesDir, filename))),
      });
    }

    issues.push({
      slug: issueSlug,
      filePath: issuePath,
      priority: index.priorities.get(issueSlug) || 'P1',
      ...issue,
      subissues,
    });
  }

  return issues;
}

async function createIssue(apiKey, input) {
  const data = await linearRequest(apiKey, `
    mutation CreateIssue($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue { id identifier title url }
      }
    }
  `, { input });

  if (!data.issueCreate?.success || !data.issueCreate?.issue) {
    throw new Error(`Linear did not create issue "${input.title}".`);
  }

  return data.issueCreate.issue;
}

async function updateIssue(apiKey, id, input) {
  const data = await linearRequest(apiKey, `
    mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) {
      issueUpdate(id: $id, input: $input) {
        success
        issue {
          id
          identifier
          title
          url
          description
          parent { id title }
        }
      }
    }
  `, { id, input });

  if (!data.issueUpdate?.success || !data.issueUpdate?.issue) {
    throw new Error(`Linear did not update issue "${id}".`);
  }

  return data.issueUpdate.issue;
}

async function fetchExistingIssues(apiKey, teamId) {
  const issues = [];
  let after = null;

  do {
    const data = await linearRequest(apiKey, `
      query ExistingIssues($teamId: String!, $after: String) {
        team(id: $teamId) {
          issues(first: 250, after: $after) {
            nodes {
              id
              identifier
              title
              url
              description
              parent { id title }
            }
            pageInfo { hasNextPage endCursor }
          }
        }
      }
    `, { teamId, after });

    const connection = data.team?.issues;
    if (!connection) {
      throw new Error(`Could not read existing issues for Linear team ${teamId}.`);
    }

    issues.push(...connection.nodes);
    after = connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : null;
  } while (after);

  return issues;
}

function findDuplicate(existingIssues, { slug, title, parentId }) {
  const marker = markerFor(slug);
  const normalized = normalizeTitle(title);

  const markerMatch = existingIssues.find((issue) =>
    issue.description?.includes(marker) &&
    (parentId ? issue.parent?.id === parentId : !issue.parent)
  );
  if (markerMatch) return { issue: markerMatch, reason: 'marker' };

  const titleMatch = existingIssues.find((issue) =>
    normalizeTitle(issue.title) === normalized &&
    (parentId ? issue.parent?.id === parentId : !issue.parent)
  );
  if (titleMatch) return { issue: titleMatch, reason: 'title' };

  return null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.listTeams) {
    const apiKey = getApiKey();
    const teamsData = await listTeams(apiKey);
    console.log(`Organization: ${teamsData.organization.name} (${teamsData.organization.urlKey})`);
    for (const team of teamsData.teams.nodes) {
      console.log(`- ${team.key} | ${team.name} | ${team.id}`);
    }
    return;
  }

  const index = await parseIndex(args.prdsDir);
  const discovered = await discoverPrds(args.prdsDir, index);
  const issues = Number.isFinite(args.limit) ? discovered.slice(0, args.limit) : discovered;

  if (args.offline) {
    console.log(`Offline import plan: ${issues.length} parent issues, ${issues.reduce((count, issue) => count + issue.subissues.length, 0)} subissues.`);
    for (const issue of issues) {
      console.log(`[offline] parent ${issue.slug}: ${issue.title} (${issue.priority})`);
      for (const subissue of issue.subissues) {
        console.log(`  [offline] subissue ${subissue.slug}: ${subissue.title} (${subissue.priority})`);
      }
    }
    return;
  }

  const apiKey = getApiKey();
  const teamsData = await listTeams(apiKey);
  const teams = teamsData.teams.nodes;
  const team = resolveTeam(teams, args.team);
  const assignee = args.assignTo ? resolveUser(await listUsers(apiKey), args.assignTo) : null;
  const existingIssues = args.dedupe ? await fetchExistingIssues(apiKey, team.id) : [];

  console.log(`${args.execute ? 'Importing' : 'Dry-run'} ${issues.length} parent issues into Linear team ${team.key} (${team.name}).`);
  if (assignee) {
    console.log(`Assignee: ${assignee.name || assignee.displayName} <${assignee.email}>`);
  }
  if (args.dedupe) {
    console.log(`Duplicate check enabled: loaded ${existingIssues.length} existing issues from team ${team.key}.`);
  }

  for (const issue of issues) {
    const parentDescription = descriptionWithMarker(issue.description, issue.slug);
    const parentInput = {
      teamId: team.id,
      title: issue.title,
      description: parentDescription,
      priority: priorityToLinear(issue.priority),
      ...(assignee ? { assigneeId: assignee.id } : {}),
      ...(args.projectId ? { projectId: args.projectId } : {}),
    };
    const parentDuplicate = args.dedupe
      ? findDuplicate(existingIssues, { slug: issue.slug, title: issue.title })
      : null;

    if (!args.execute) {
      const duplicateText = parentDuplicate ? ` -> existing ${parentDuplicate.issue.identifier} by ${parentDuplicate.reason}` : '';
      console.log(`[dry-run] parent ${issue.slug}: ${issue.title} (${issue.priority})${duplicateText}`);
      if (parentDuplicate && args.updateExisting) {
        console.log(`  [dry-run] would update existing parent ${parentDuplicate.issue.identifier}`);
      }
      for (const subissue of issue.subissues) {
        const subDuplicate = parentDuplicate && args.dedupe
          ? findDuplicate(existingIssues, {
              slug: subissue.slug,
              title: subissue.title,
              parentId: parentDuplicate.issue.id,
            })
          : null;
        const subDuplicateText = subDuplicate ? ` -> existing ${subDuplicate.issue.identifier} by ${subDuplicate.reason}` : '';
        console.log(`  [dry-run] subissue ${subissue.slug}: ${subissue.title} (${subissue.priority})${subDuplicateText}`);
        if (subDuplicate && args.updateExisting) {
          console.log(`    [dry-run] would update existing subissue ${subDuplicate.issue.identifier}`);
        }
      }
      continue;
    }

    if (parentDuplicate && args.failOnDuplicate) {
      throw new Error(`Duplicate parent issue found for ${issue.slug}: ${parentDuplicate.issue.identifier} (${parentDuplicate.reason}).`);
    }

    const createdParent = parentDuplicate && args.updateExisting
      ? await updateIssue(apiKey, parentDuplicate.issue.id, {
          title: parentInput.title,
          description: parentInput.description,
          priority: parentInput.priority,
          ...(assignee ? { assigneeId: assignee.id } : {}),
        })
      : parentDuplicate
        ? parentDuplicate.issue
        : await createIssue(apiKey, parentInput);

    if (parentDuplicate && args.updateExisting) {
      parentDuplicate.issue.title = createdParent.title;
      parentDuplicate.issue.description = createdParent.description;
      console.log(`Updated existing parent ${createdParent.identifier}: ${createdParent.title} (${parentDuplicate.reason})`);
    } else if (parentDuplicate) {
      console.log(`Skipped existing parent ${createdParent.identifier}: ${createdParent.title} (${parentDuplicate.reason})`);
    } else {
      existingIssues.push({ ...createdParent, description: parentDescription, parent: null });
      console.log(`Created parent ${createdParent.identifier}: ${createdParent.title}`);
    }

    for (const subissue of issue.subissues) {
      const subDescription = descriptionWithMarker(subissue.description, subissue.slug, issue.slug);
      const subInput = {
        teamId: team.id,
        parentId: createdParent.id,
        title: subissue.title,
        description: subDescription,
        priority: priorityToLinear(subissue.priority),
        ...(assignee ? { assigneeId: assignee.id } : {}),
        ...(args.projectId ? { projectId: args.projectId } : {}),
      };
      const subDuplicate = args.dedupe
        ? findDuplicate(existingIssues, {
            slug: subissue.slug,
            title: subissue.title,
            parentId: createdParent.id,
          })
        : null;

      if (subDuplicate && args.failOnDuplicate) {
        throw new Error(`Duplicate subissue found for ${issue.slug}/${subissue.slug}: ${subDuplicate.issue.identifier} (${subDuplicate.reason}).`);
      }

      if (subDuplicate) {
        if (args.updateExisting) {
          const updatedSubissue = await updateIssue(apiKey, subDuplicate.issue.id, {
            title: subInput.title,
            description: subInput.description,
            priority: subInput.priority,
            ...(assignee ? { assigneeId: assignee.id } : {}),
          });
          subDuplicate.issue.title = updatedSubissue.title;
          subDuplicate.issue.description = updatedSubissue.description;
          console.log(`  Updated existing subissue ${updatedSubissue.identifier}: ${updatedSubissue.title} (${subDuplicate.reason})`);
        } else {
          console.log(`  Skipped existing subissue ${subDuplicate.issue.identifier}: ${subDuplicate.issue.title} (${subDuplicate.reason})`);
        }
        continue;
      }

      const createdSubissue = await createIssue(apiKey, subInput);
      existingIssues.push({
        ...createdSubissue,
        description: subDescription,
        parent: { id: createdParent.id, title: createdParent.title },
      });
      console.log(`  Created subissue ${createdSubissue.identifier}: ${createdSubissue.title}`);
    }
  }

  if (!args.execute) {
    console.log('Dry-run complete. Re-run with --execute to create or update issues in Linear.');
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  console.error(usage());
  process.exit(1);
});
