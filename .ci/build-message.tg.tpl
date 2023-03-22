Build #{{build.number}} `k3env/vcl-frontend` finished

Message: `{{commit.message}}`

Author: {{commit.author}} [{{commit.email}}](mailto:{{commit.email}})

{{#success build.status}}
🟢 build succeeded
{{else}}
🔴 build failed
{{/success}}

Detailed build info [here]({{build.link}})
