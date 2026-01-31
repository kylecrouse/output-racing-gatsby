# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Output Racing League website - a Gatsby 5.x static site for racing league management, results, and statistics. Integrates data from MySQL database, iRacing API, and Contentful CMS.

## Commands

```bash
npm run develop     # Start dev server at http://localhost:8000
npm run build       # Production build
npm run clean       # Clear Gatsby cache (run if schema changes)
npm run deploy      # Deploy to AWS S3 with CloudFront invalidation
```

## Architecture

### Data Flow
```
iRacing API → /plugins/gatsby-source-iracing → IracingMember nodes
MySQL DB    → gatsby-source-mysql            → MysqlRace/Season/Participant nodes
Contentful  → gatsby-source-contentful       → ContentfulNews/ContentfulAsset nodes
            ↓
       GraphQL Schema (gatsby-node.js defines relationships)
            ↓
       Pages & Templates (use fragments from /src/graphql/fragments.js)
```

### Key Files

- **gatsby-node.js** - Dynamic page creation, schema customization, cross-source relationships via `@link` directives
- **gatsby-config.js** - Plugin configuration, MySQL queries, data source setup
- **/plugins/gatsby-source-iracing** - Custom plugin for iRacing API with OAuth auth and cookie persistence
- **/src/graphql/fragments.js** - Reusable GraphQL fragments (driverData, eventData, participantData, etc.)

### Directory Structure

- `/src/pages` - Static pages (index, news, rules, etc.)
- `/src/templates` - Dynamic page templates (drivers, standings, results, schedule)
- `/src/components` - React components (44 files)
- `/src/layouts` - Layout wrappers per series (output, echo, nightowl)
- `/plugins` - Custom Gatsby source plugins

### Multi-Series Support

Three series with distinct layouts: Output, Echo, Late Model (Nightowl). Each uses series-specific layout components and theming via CSS variables (--highlight-color, --highlight-opposite-color).

### Path Generation

URL slugs generated via `pathify()` function in gatsby-node.js:
```javascript
pathify(string) => string.replace(/[:-]/g, "").replace(/\s+/g, "-").toLowerCase()
```

### Data Relationships

Custom schema in gatsby-node.js links:
- `IracingMember` ↔ `MysqlDriver` (via cust_id)
- `MysqlParticipant` ↔ `MysqlDriver` & `MysqlRace`
- `MysqlRace` ↔ `ContentfulRace` (media, broadcasts)
- `MysqlSeason` ↔ `MysqlSeries` ↔ `MysqlSchedule`

## Environment Variables

Required in `.env`:
- Contentful: space ID, access token
- iRacing: email, password (for API authentication)
- MySQL: host, user, password, database (Digital Ocean hosted)
