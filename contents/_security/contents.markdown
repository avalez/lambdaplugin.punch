## Security Statement

Lambda Add-On for JIRA OnDemand is [Atlassian Connect Add-On](https://developer.atlassian.com/static/connect/docs/) (Add-On) Software as a Service (SaaS). 

### Data Security

The Add-On is static, i.e. all data (specifically search results) is requested and processed by add-on client side in End User Browser and is not passed anywhere else.

Here is the list of JIRA REST API used:

*   [/rest/api/2/search](https://docs.atlassian.com/jira/REST/6.2/#d2e2438) - issues and time tracking data.
*   [/rest/api/2/filter/favourite](https://docs.atlassian.com/jira/REST/6.2/#d2e1283) - filters for Filter reports' option.

Note, Add-On declares READ [scope](https://developer.atlassian.com/static/connect/docs/scopes/scopes.html) to access data as just described.

Note, add-on logging service uses [Papertrail](https://papertrailapp.com) to log execution stack trace and cause details in case of unexpected internal error.

### Refernces

*   [Papertrail Software Services Agreement](https://papertrailapp.com/info/terms)
*   [Atlassian OnDemand Security](https://www.atlassian.com/hosted/security)
