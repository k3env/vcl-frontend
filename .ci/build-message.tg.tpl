Build #{{build.number}} {{repo.owner}}/{{repo.name}} finished

Message: `{{commit.message}}`

{{#success build.status}}
🟢 build succeeded
{{else}}
🔴 build failed
{{/success}}

Detailed build info [here]({{build.link}})

