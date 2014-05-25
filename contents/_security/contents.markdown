## Security Statement

Time Reports for JIRA OnDemand is [Atlassian Connect Add-On](https://developer.atlassian.com/static/connect/docs/) (Add-On) Software as a Service (SaaS) hosted on [Heroku](https://www.heroku.com) cloud platform. 

### Data Security

The Add-On only persists JIRA host details (i.e., client key, host public key and host base url) required for interoperability with JIRA. I.e. no client details passed or no end user details are persisted.

E.g. of information that is passed (but not persisted as it is) to Add-On:

    GET /timereports?tz=Europe%2FBerlin&loc=en-US&user_id=admin&user_key=admin&xdm_e=http%3A%2F%2Flocalhost%3A2990&xdm_c=channel-timereports&cp=%2Fjira&lic=none&jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjEzOTY5NjcyMjYsInN1YiI6ImFkbWluIiwiaXNzIjoiamlyYTpkODc5Y2M3Zi0yOTBhLTQ2NDctODM5Zi05MmJlNTI4NTc2NGEiLCJxc2giOiIzMWQ4YzZhMjUwZTA5MTY4ODNjNzMxZjRmN2UyZTdmNjdkMzNhMjBlMWUxMDM2YmM0ODg2OWNmMzU1ODgzNGQ4IiwiaWF0IjoxMzk2OTY3MDQ2fQ.egC3xw1Ul7Zx9uJ5KrxLMZ8ggSRCj5pMBcxKq9HRq_E 200 12ms

No further communication is happening between Add-On host and JIRA host.

Therafter all data (specicially Time Tracking data) is requested and processed by add-on client side code in End User Browser and is not passed anywhere else.

Here is the list of JIRA REST API used:

*   [/rest/api/2/search](https://docs.atlassian.com/jira/REST/6.2/#d2e2438) - issues and time tracking data.
*   [/rest/api/2/user](https://docs.atlassian.com/jira/REST/6.2/#d2e3764) - user data for timezone (not used at the moment).
*   [/rest/api/2/filter/favourite](https://docs.atlassian.com/jira/REST/6.2/#d2e1283) - filters for Filter reports' option.
*   [/rest/api/2/field](https://docs.atlassian.com/jira/REST/6.2/#d2e131) - fields for Field reports' option.
*   [/rest/api/2/user/picker](https://docs.atlassian.com/software/jira/docs/api/REST/6.2/#d2e3922) - users search for User reports' option.

Note, Add-On declares READ [scope](https://developer.atlassian.com/static/connect/docs/scopes/scopes.html) to access data as just described.

### Refernces

*   [Heroku Security](https://www.heroku.com/policy/security)
*   [Atlassian OnDemand Security](https://www.atlassian.com/hosted/security)
