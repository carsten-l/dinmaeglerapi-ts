# hono-api-starter
a basic rest api built with hono.js. It uses SQLite as the database, and prisma as the ORM.

The api uses the Zod-Validator middleware for validating incoming data.

In the process of creating this i have explored different ways of organising the files in the repo. 
I have looked at other code, and consulted the hono docs for inspiration on code organization.

The api has a set of endpoints that can be used as a template for a REST API.

Creating a subscriber deletes subscribers created outside the current calendar day
in the Europe/Copenhagen time zone. The deletion and creation are atomic.

## AI automation
The project contains a copilot instructions file that serves as guidelines for automated generation of schemas and endpoints.
