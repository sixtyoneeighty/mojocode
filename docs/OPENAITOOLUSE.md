Using tools  
\===========

Use tools like remote MCP servers or web search to extend the model's capabilities.

When generating model responses, you can extend model capabilities using built-in \*\*tools\*\*. These tools help models access additional context and information from the web or your files. The example below uses the \[web search tool\](/docs/guides/tools-web-search) to use the latest information from the web to generate a model response.

Include web search results for the model response

\`\`\`javascript  
import OpenAI from "openai";  
const client \= new OpenAI();

const response \= await client.responses.create({  
    model: "gpt-4.1",  
    tools: \[ { type: "web\_search\_preview" } \],  
    input: "What was a positive news story from today?",  
});

console.log(response.output\_text);  
\`\`\`

\`\`\`python  
from openai import OpenAI  
client \= OpenAI()

response \= client.responses.create(  
    model="gpt-4.1",  
    tools=\[{"type": "web\_search\_preview"}\],  
    input="What was a positive news story from today?"  
)

print(response.output\_text)  
\`\`\`

\`\`\`bash  
curl "https://api.openai.com/v1/responses" \\  
    \-H "Content-Type: application/json" \\  
    \-H "Authorization: Bearer $OPENAI\_API\_KEY" \\  
    \-d '{  
        "model": "gpt-4.1",  
        "tools": \[{"type": "web\_search\_preview"}\],  
        "input": "what was a positive news story from today?"  
    }'  
\`\`\`

You can include several built-in tools from the available tools list below and let the model decide which tools to use based on the conversation.

Available tools  
\---------------

Here's an overview of the tools available in the OpenAI platform—select one of them for further guidance on usage.

\[

Function calling

Call custom code to give the model access to additional data and capabilities.

\](/docs/guides/function-calling)\[

Web search

Include data from the Internet in model response generation.

\](/docs/guides/tools-web-search)\[

Remote MCP servers

Give the model access to new capabilities via Model Context Protocol (MCP) servers.

\](/docs/guides/tools-remote-mcp)\[

File search

Search the contents of uploaded files for context when generating a response.

\](/docs/guides/tools-file-search)\[

Image Generation

Generate or edit images using GPT Image.

\](/docs/guides/tools-image-generation)\[

Code interpreter

Allow the model to execute code in a secure container.

\](/docs/guides/tools-code-interpreter)\[

Computer use

Create agentic workflows that enable a model to control a computer interface.

\](/docs/guides/tools-computer-use)

Usage in the API  
\----------------

When making a request to generate a \[model response\](/docs/api-reference/responses/create), you can enable tool access by specifying configurations in the \`tools\` parameter. Each tool has its own unique configuration requirements—see the \[Available tools\](\#available-tools) section for detailed instructions.

Based on the provided \[prompt\](/docs/guides/text), the model automatically decides whether to use a configured tool. For instance, if your prompt requests information beyond the model's training cutoff date and web search is enabled, the model will typically invoke the web search tool to retrieve relevant, up-to-date information.

You can explicitly control or guide this behavior by setting the \`tool\_choice\` parameter \[in the API request\](/docs/api-reference/responses/create).

\#\#\# Function calling

In addition to built-in tools, you can define custom functions using the \`tools\` array. These custom functions allow the model to call your application's code, enabling access to specific data or capabilities not directly available within the model.

Web search  
\==========

Allow models to search the web for the latest information before generating a response.

Using the \[Responses API\](/docs/api-reference/responses), you can enable web search by configuring it in the \`tools\` array in an API request to generate content. Like any other tool, the model can choose to search the web or not based on the content of the input prompt.

Web search tool example

\`\`\`javascript  
import OpenAI from "openai";  
const client \= new OpenAI();

const response \= await client.responses.create({  
    model: "gpt-4.1",  
    tools: \[ { type: "web\_search\_preview" } \],  
    input: "What was a positive news story from today?",  
});

console.log(response.output\_text);  
\`\`\`

\`\`\`python  
from openai import OpenAI  
client \= OpenAI()

response \= client.responses.create(  
    model="gpt-4.1",  
    tools=\[{"type": "web\_search\_preview"}\],  
    input="What was a positive news story from today?"  
)

print(response.output\_text)  
\`\`\`

\`\`\`bash  
curl "https://api.openai.com/v1/responses" \\  
    \-H "Content-Type: application/json" \\  
    \-H "Authorization: Bearer $OPENAI\_API\_KEY" \\  
    \-d '{  
        "model": "gpt-4.1",  
        "tools": \[{"type": "web\_search\_preview"}\],  
        "input": "what was a positive news story from today?"  
    }'  
\`\`\`

Web search tool versions

The current default version of the web search tool is:

\`web\_search\_preview\`

Which points to a dated version:

\`web\_search\_preview\_2025\_03\_11\`

As the tool evolves, future dated snapshot versions will be documented in the \[API reference\](/docs/api-reference/responses/create).

You can also force the use of the \`web\_search\_preview\` tool by using the \`tool\_choice\` parameter, and setting it to \`{type: "web\_search\_preview"}\` \- this can help ensure lower latency and more consistent results.

Output and citations  
\--------------------

Model responses that use the web search tool will include two parts:

\*   A \`web\_search\_call\` output item with the ID of the search call.  
\*   A \`message\` output item containing:  
    \*   The text result in \`message.content\[0\].text\`  
    \*   Annotations \`message.content\[0\].annotations\` for the cited URLs

By default, the model's response will include inline citations for URLs found in the web search results. In addition to this, the \`url\_citation\` annotation object will contain the URL, title and location of the cited source.

When displaying web results or information contained in web results to end users, inline citations must be made clearly visible and clickable in your user interface.

\`\`\`json  
\[  
  {  
    "type": "web\_search\_call",  
    "id": "ws\_67c9fa0502748190b7dd390736892e100be649c1a5ff9609",  
    "status": "completed"  
  },  
  {  
    "id": "msg\_67c9fa077e288190af08fdffda2e34f20be649c1a5ff9609",  
    "type": "message",  
    "status": "completed",  
    "role": "assistant",  
    "content": \[  
      {  
        "type": "output\_text",  
        "text": "On March 6, 2025, several news...",  
        "annotations": \[  
          {  
            "type": "url\_citation",  
            "start\_index": 2606,  
            "end\_index": 2758,  
            "url": "https://...",  
            "title": "Title..."  
          }  
        \]  
      }  
    \]  
  }  
\]  
\`\`\`

User location  
\-------------

To refine search results based on geography, you can specify an approximate user location using country, city, region, and/or timezone.

\*   The \`city\` and \`region\` fields are free text strings, like \`Minneapolis\` and \`Minnesota\` respectively.  
\*   The \`country\` field is a two-letter \[ISO country code\](https://en.wikipedia.org/wiki/ISO\_3166-1), like \`US\`.  
\*   The \`timezone\` field is an \[IANA timezone\](https://timeapi.io/documentation/iana-timezones) like \`America/Chicago\`.

Customizing user location

\`\`\`python  
from openai import OpenAI  
client \= OpenAI()

response \= client.responses.create(  
    model="gpt-4.1",  
    tools=\[{  
        "type": "web\_search\_preview",  
        "user\_location": {  
            "type": "approximate",  
            "country": "GB",  
            "city": "London",  
            "region": "London",  
        }  
    }\],  
    input="What are the best restaurants around Granary Square?",  
)

print(response.output\_text)  
\`\`\`

\`\`\`javascript  
import OpenAI from "openai";  
const openai \= new OpenAI();

const response \= await openai.responses.create({  
    model: "gpt-4.1",  
    tools: \[{  
        type: "web\_search\_preview",  
        user\_location: {  
            type: "approximate",  
            country: "GB",  
            city: "London",  
            region: "London"  
        }  
    }\],  
    input: "What are the best restaurants around Granary Square?",  
});  
console.log(response.output\_text);  
\`\`\`

\`\`\`bash  
curl "https://api.openai.com/v1/responses" \\  
    \-H "Content-Type: application/json" \\  
    \-H "Authorization: Bearer $OPENAI\_API\_KEY" \\  
    \-d '{  
        "model": "gpt-4.1",  
        "tools": \[{  
            "type": "web\_search\_preview",  
            "user\_location": {  
                "type": "approximate",  
                "country": "GB",  
                "city": "London",  
                "region": "London"  
            }  
        }\],  
        "input": "What are the best restaurants around Granary Square?"  
    }'  
\`\`\`

Search context size  
\-------------------

When using this tool, the \`search\_context\_size\` parameter controls how much context is retrieved from the web to help the tool formulate a response. The tokens used by the search tool do \*\*not\*\* affect the context window of the main model specified in the \`model\` parameter in your response creation request. These tokens are also \*\*not\*\* carried over from one turn to another — they're simply used to formulate the tool response and then discarded.

Choosing a context size impacts:

\*   \*\*Cost\*\*: Pricing of our search tool varies based on the value of this parameter. Higher context sizes are more expensive. See tool pricing \[here\](/docs/pricing).  
\*   \*\*Quality\*\*: Higher search context sizes generally provide richer context, resulting in more accurate, comprehensive answers.  
\*   \*\*Latency\*\*: Higher context sizes require processing more tokens, which can slow down the tool's response time.

Available values:

\*   \*\*\`high\`\*\*: Most comprehensive context, highest cost, slower response.  
\*   \*\*\`medium\`\*\* (default): Balanced context, cost, and latency.  
\*   \*\*\`low\`\*\*: Least context, lowest cost, fastest response, but potentially lower answer quality.

Again, tokens used by the search tool do \*\*not\*\* impact main model's token usage and are not carried over from turn to turn. Check the \[pricing page\](/docs/pricing) for details on costs associated with each context size.

Customizing search context size

\`\`\`python  
from openai import OpenAI  
client \= OpenAI()

response \= client.responses.create(  
    model="gpt-4.1",  
    tools=\[{  
        "type": "web\_search\_preview",  
        "search\_context\_size": "low",  
    }\],  
    input="What movie won best picture in 2025?",  
)

print(response.output\_text)  
\`\`\`

\`\`\`javascript  
import OpenAI from "openai";  
const openai \= new OpenAI();

const response \= await openai.responses.create({  
    model: "gpt-4.1",  
    tools: \[{  
        type: "web\_search\_preview",  
        search\_context\_size: "low",  
    }\],  
    input: "What movie won best picture in 2025?",  
});  
console.log(response.output\_text);  
\`\`\`

\`\`\`bash  
curl "https://api.openai.com/v1/responses" \\  
    \-H "Content-Type: application/json" \\  
    \-H "Authorization: Bearer $OPENAI\_API\_KEY" \\  
    \-d '{  
        "model": "gpt-4.1",  
        "tools": \[{  
            "type": "web\_search\_preview",  
            "search\_context\_size": "low"  
        }\],  
        "input": "What movie won best picture in 2025?"  
    }'  
\`\`\`

Usage notes  
\-----------

||  
|ResponsesChat CompletionsAssistants|Same as tiered rate limits for underlying model used with the tool.|PricingZDR and data residency|

\#\#\#\# Limitations

\*   Web search is currently not supported in the \[\`gpt-4.1-nano\`\](/docs/models/gpt-4.1-nano) model.  
\*   The \[\`gpt-4o-search-preview\`\](/docs/models/gpt-4o-search-preview) and \[\`gpt-4o-mini-search-preview\`\](/docs/models/gpt-4o-mini-search-preview) models used in Chat Completions only support a subset of API parameters \- view their model data pages for specific information on rate limits and feature support.  
\*   When used as a tool in the \[Responses API\](/docs/api-reference/responses), web search has the same tiered rate limits as the models above.  
\*   Web search is limited to a context window size of 128000 (even with \[\`gpt-4.1\`\](/docs/models/gpt-4.1) and \[\`gpt-4.1-mini\`\](/docs/models/gpt-4.1-mini) models).  
\*   \[Refer to this guide\](/docs/guides/your-data) for data handling, residency, and retention information.

Remote MCP  
\==========

Allow models to use remote MCP servers to perform tasks.

\[Model Context Protocol\](https://modelcontextprotocol.io/introduction) (MCP) is an open protocol that standardizes how applications provide tools and context to LLMs. The MCP tool in the Responses API allows developers to give the model access to tools hosted on \*\*Remote MCP servers\*\*. These are MCP servers maintained by developers and organizations across the internet that expose these tools to MCP clients, like the Responses API.

Calling a remote MCP server with the Responses API is straightforward. For example, here's how you can use the \[DeepWiki\](https://deepwiki.com/) MCP server to ask questions about nearly any public GitHub repository.

A Responses API request with MCP tools enabled

\`\`\`bash  
curl https://api.openai.com/v1/responses \\  
  \-H "Content-Type: application/json" \\  
  \-H "Authorization: Bearer $OPENAI\_API\_KEY" \\  
  \-d '{  
  "model": "gpt-4.1",  
  "tools": \[  
    {  
      "type": "mcp",  
      "server\_label": "deepwiki",  
      "server\_url": "https://mcp.deepwiki.com/mcp",  
      "require\_approval": "never"  
    }  
  \],  
  "input": "What transport protocols are supported in the 2025-03-26 version of the MCP spec?"  
}'  
\`\`\`

\`\`\`javascript  
import OpenAI from "openai";  
const client \= new OpenAI();

const resp \= await client.responses.create({  
    model: "gpt-4.1",  
    tools: \[  
        {  
            type: "mcp",  
            server\_label: "deepwiki",  
            server\_url: "https://mcp.deepwiki.com/mcp",  
            require\_approval: "never",  
        },  
    \],  
    input: "What transport protocols are supported in the 2025-03-26 version of the MCP spec?",  
});

console.log(resp.output\_text);  
\`\`\`

\`\`\`python  
from openai import OpenAI

client \= OpenAI()

resp \= client.responses.create(  
    model="gpt-4.1",  
    tools=\[  
        {  
            "type": "mcp",  
            "server\_label": "deepwiki",  
            "server\_url": "https://mcp.deepwiki.com/mcp",  
            "require\_approval": "never",  
        },  
    \],  
    input="What transport protocols are supported in the 2025-03-26 version of the MCP spec?",  
)

print(resp.output\_text)  
\`\`\`

It is very important that developers trust any remote MCP server they use with the Responses API. A malicious server can exfiltrate sensitive data from anything that enters the model's context. Carefully review the \[Risks and Safety\](\#risks-and-safety) section below before using this tool.

The MCP ecosystem  
\-----------------

We are still in the early days of the MCP ecosystem. Some popular remote MCP servers today include \[Cloudflare\](https://developers.cloudflare.com/agents/guides/remote-mcp-server/), \[Hubspot\](https://developers.hubspot.com/mcp), \[Intercom\](https://developers.intercom.com/docs/guides/mcp), \[Paypal\](https://developer.paypal.com/tools/mcp-server/), \[Pipedream\](https://pipedream.com/docs/connect/mcp/openai/), \[Plaid\](https://plaid.com/docs/mcp/), \[Shopify\](https://shopify.dev/docs/apps/build/storefront-mcp), \[Stripe\](https://docs.stripe.com/mcp), \[Square\](https://developer.squareup.com/docs/mcp), \[Twilio\](https://github.com/twilio-labs/function-templates/tree/main/mcp-server) and \[Zapier\](https://zapier.com/mcp). We expect many more servers—and registries making it easy to discover these servers—to launch in the coming months. The MCP protocol itself is also early, and we expect to add many more updates to our MCP tool as the protocol evolves.

How it works  
\------------

The MCP tool works only in the \[Responses API\](/docs/api-reference/responses/create), and is available across all our new models (gpt-4o, gpt-4.1, and our reasoning models). When you're using the MCP tool, you only pay for \[tokens\](/docs/pricing) used when importing tool definitions or making tool calls—there are no additional fees involved.

\#\#\# Step 1: Getting the list of tools from the MCP server

The first thing the Responses API does when you attach a remote MCP server to the \`tools\` array, is attempt to get a list of tools from the server. The Responses API supports remote MCP servers that support either the Streamable HTTP or the HTTP/SSE transport protocol.

If successful in retrieving the list of tools, a new \`mcp\_list\_tools\` output item will be visible in the Response object that is created for each MCP server. The \`tools\` property of this object will show the tools that were successfully imported.

\`\`\`json  
{  
  "id": "mcpl\_682d4379df088191886b70f4ec39f90403937d5f622d7a90",  
  "type": "mcp\_list\_tools",  
  "server\_label": "deepwiki",  
  "tools": \[  
    {  
      "name": "read\_wiki\_structure",  
      "input\_schema": {  
        "type": "object",  
        "properties": {  
          "repoName": {  
            "type": "string",  
            "description": "GitHub repository: owner/repo (e.g. \\"facebook/react\\")"  
          }  
        },  
        "required": \[  
          "repoName"  
        \],  
        "additionalProperties": false,  
        "annotations": null,  
        "description": "",  
        "$schema": "http://json-schema.org/draft-07/schema\#"  
      }  
    },  
    // ... other tools  
  \]  
}  
\`\`\`

As long as the \`mcp\_list\_tools\` item is present in the context of the model, we will not attempt to pull a refreshed list of tools from an MCP server. We recommend you keep this item in the model's context as part of every conversation or workflow execution to optimize for latency.

\#\#\#\# Filtering tools

Some MCP servers can have dozens of tools, and exposing many tools to the model can result in high cost and latency. If you're only interested in a subset of tools an MCP server exposes, you can use the \`allowed\_tools\` parameter to only import those tools.

Constrain allowed tools

\`\`\`bash  
curl https://api.openai.com/v1/responses \\  
  \-H "Content-Type: application/json" \\  
  \-H "Authorization: Bearer $OPENAI\_API\_KEY" \\  
  \-d '{  
  "model": "gpt-4.1",  
  "tools": \[  
    {  
      "type": "mcp",  
      "server\_label": "deepwiki",  
      "server\_url": "https://mcp.deepwiki.com/mcp",  
      "require\_approval": "never",  
      "allowed\_tools": \["ask\_question"\]  
    }  
  \],  
  "input": "What transport protocols does the 2025-03-26 version of the MCP spec (modelcontextprotocol/modelcontextprotocol) support?"  
}'  
\`\`\`

\`\`\`javascript  
import OpenAI from "openai";  
const client \= new OpenAI();

const resp \= await client.responses.create({  
    model: "gpt-4.1",  
    tools: \[{  
        type: "mcp",  
        server\_label: "deepwiki",  
        server\_url: "https://mcp.deepwiki.com/mcp",  
        require\_approval: "never",  
        allowed\_tools: \["ask\_question"\],  
    }\],  
    input: "What transport protocols does the 2025-03-26 version of the MCP spec (modelcontextprotocol/modelcontextprotocol) support?",  
});

console.log(resp.output\_text);  
\`\`\`

\`\`\`python  
from openai import OpenAI

client \= OpenAI()

resp \= client.responses.create(  
    model="gpt-4.1",  
    tools=\[{  
        "type": "mcp",  
        "server\_label": "deepwiki",  
        "server\_url": "https://mcp.deepwiki.com/mcp",  
        "require\_approval": "never",  
        "allowed\_tools": \["ask\_question"\],  
    }\],  
    input="What transport protocols does the 2025-03-26 version of the MCP spec (modelcontextprotocol/modelcontextprotocol) support?",  
)

print(resp.output\_text)  
\`\`\`

\#\#\# Step 2: Calling tools

Once the model has access to these tool definitions, it may choose to call them depending on what's in the model's context. When the model decides to call an MCP tool, we make an request to the remote MCP server to call the tool, take it's output and put that into the model's context. This creates an \`mcp\_call\` item which looks like this:

\`\`\`json  
{  
  "id": "mcp\_682d437d90a88191bf88cd03aae0c3e503937d5f622d7a90",  
  "type": "mcp\_call",  
  "approval\_request\_id": null,  
  "arguments": "{\\"repoName\\":\\"modelcontextprotocol/modelcontextprotocol\\",\\"question\\":\\"What transport protocols does the 2025-03-26 version of the MCP spec support?\\"}",  
  "error": null,  
  "name": "ask\_question",  
  "output": "The 2025-03-26 version of the Model Context Protocol (MCP) specification supports two standard transport mechanisms: \`stdio\` and \`Streamable HTTP\` ...",  
  "server\_label": "deepwiki"  
}  
\`\`\`

As you can see, this includes both the arguments the model decided to use for this tool call, and the \`output\` that the remote MCP server returned. All models can choose to make multiple (MCP) tool calls in the Responses API, and so, you may see several of these items generated in a single Response API request.

Failed tool calls will populate the error field of this item with MCP protocol errors, MCP tool execution errors, or general connectivity errors. The MCP errors are documented in the MCP spec \[here\](https://modelcontextprotocol.io/specification/2025-03-26/server/tools\#error-handling).

\#\#\#\# Approvals

By default, OpenAI will request your approval before any data is shared with a remote MCP server. Approvals help you maintain control and visibility over what data is being sent to an MCP server. We highly recommend that you carefully review (and optionally, log) all data being shared with a remote MCP server. A request for an approval to make an MCP tool call creates a \`mcp\_approval\_request\` item in the Response's output that looks like this:

\`\`\`json  
{  
  "id": "mcpr\_682d498e3bd4819196a0ce1664f8e77b04ad1e533afccbfa",  
  "type": "mcp\_approval\_request",  
  "arguments": "{\\"repoName\\":\\"modelcontextprotocol/modelcontextprotocol\\",\\"question\\":\\"What transport protocols are supported in the 2025-03-26 version of the MCP spec?\\"}",  
  "name": "ask\_question",  
  "server\_label": "deepwiki"  
}  
\`\`\`

You can then respond to this by creating a new Response object and appending an \`mcp\_approval\_response\` item to it.

Approving the use of tools in an API request

\`\`\`bash  
curl https://api.openai.com/v1/responses \\  
  \-H "Content-Type: application/json" \\  
  \-H "Authorization: Bearer $OPENAI\_API\_KEY" \\  
  \-d '{  
  "model": "gpt-4.1",  
  "tools": \[  
    {  
      "type": "mcp",  
      "server\_label": "deepwiki",  
      "server\_url": "https://mcp.deepwiki.com/mcp"  
    }  
  \],  
  "previous\_response\_id": "resp\_682d498bdefc81918b4a6aa477bfafd904ad1e533afccbfa",  
  "input": \[{  
    "type": "mcp\_approval\_response",  
    "approve": true,  
    "approval\_request\_id": "mcpr\_682d498e3bd4819196a0ce1664f8e77b04ad1e533afccbfa"  
  }\]  
}'  
\`\`\`

\`\`\`javascript  
import OpenAI from "openai";  
const client \= new OpenAI();

const resp \= await client.responses.create({  
    model: "gpt-4.1",  
    tools: \[{  
        type: "mcp",  
        server\_label: "deepwiki",  
        server\_url: "https://mcp.deepwiki.com/mcp",  
    }\],  
    previous\_response\_id: "resp\_682d498bdefc81918b4a6aa477bfafd904ad1e533afccbfa",  
    input: \[{  
        type: "mcp\_approval\_response",  
        approve: true,  
        approval\_request\_id: "mcpr\_682d498e3bd4819196a0ce1664f8e77b04ad1e533afccbfa"  
    }\],  
});

console.log(resp.output\_text);  
\`\`\`

\`\`\`python  
from openai import OpenAI

client \= OpenAI()

resp \= client.responses.create(  
    model="gpt-4.1",  
    tools=\[{  
        "type": "mcp",  
        "server\_label": "deepwiki",  
        "server\_url": "https://mcp.deepwiki.com/mcp",  
    }\],  
    previous\_response\_id="resp\_682d498bdefc81918b4a6aa477bfafd904ad1e533afccbfa",  
    input=\[{  
        "type": "mcp\_approval\_response",  
        "approve": True,  
        "approval\_request\_id": "mcpr\_682d498e3bd4819196a0ce1664f8e77b04ad1e533afccbfa"  
    }\],  
)

print(resp.output\_text)  
\`\`\`

Here we're using the \`previous\_response\_id\` parameter to chain this new Response, with the previous Response that generated the approval request. But you can also pass back the \[outputs from one response, as inputs into another\](/docs/guides/conversation-state\#manually-manage-conversation-state) for maximum control over what enter's the model's context.

If and when you feel comfortable trusting a remote MCP server, you can choose to skip the approvals for reduced latency. To do this, you can set the \`require\_approval\` parameter of the MCP tool to an object listing just the tools you'd like to skip approvals for like shown below, or set it to the value \`'never'\` to skip approvals for all tools in that remote MCP server.

Never require approval for some tools

\`\`\`bash  
curl https://api.openai.com/v1/responses \\  
  \-H "Content-Type: application/json" \\  
  \-H "Authorization: Bearer $OPENAI\_API\_KEY" \\  
  \-d '{  
  "model": "gpt-4.1",  
  "tools": \[  
    {  
      "type": "mcp",  
      "server\_label": "deepwiki",  
      "server\_url": "https://mcp.deepwiki.com/mcp",  
      "require\_approval": {  
          "never": {  
            "tool\_names": \["ask\_question", "read\_wiki\_structure"\]  
          }  
      }  
    }  
  \],  
  "input": "What transport protocols does the 2025-03-26 version of the MCP spec (modelcontextprotocol/modelcontextprotocol) support?"  
}'  
\`\`\`

\`\`\`javascript  
import OpenAI from "openai";  
const client \= new OpenAI();

const resp \= await client.responses.create({  
    model: "gpt-4.1",  
    tools: \[  
        {  
            type: "mcp",  
            server\_label: "deepwiki",  
            server\_url: "https://mcp.deepwiki.com/mcp",  
            require\_approval: {  
                never: {  
                    tool\_names: \["ask\_question", "read\_wiki\_structure"\]  
                }  
            }  
        },  
    \],  
    input: "What transport protocols does the 2025-03-26 version of the MCP spec (modelcontextprotocol/modelcontextprotocol) support?",  
});

console.log(resp.output\_text);  
\`\`\`

\`\`\`python  
from openai import OpenAI

client \= OpenAI()

resp \= client.responses.create(  
    model="gpt-4.1",  
    tools=\[  
        {  
            "type": "mcp",  
            "server\_label": "deepwiki",  
            "server\_url": "https://mcp.deepwiki.com/mcp",  
            "require\_approval": {  
                "never": {  
                    "tool\_names": \["ask\_question", "read\_wiki\_structure"\]  
                }  
            }  
        },  
    \],  
    input="What transport protocols does the 2025-03-26 version of the MCP spec (modelcontextprotocol/modelcontextprotocol) support?",  
)

print(resp.output\_text)  
\`\`\`

Authentication  
\--------------

Unlike the DeepWiki MCP server, most other MCP servers require authentication. The MCP tool in the Responses API gives you the ability to flexibly specify headers that should be included in any request made to a remote MCP server. These headers can be used to share API keys, oAuth access tokens, or any other authentication scheme the remote MCP server implements.

The most common header used by remote MCP servers is the \`Authorization\` header. This is what passing this header looks like:

Use Stripe MCP tool

\`\`\`bash  
curl https://api.openai.com/v1/responses \\  
  \-H "Content-Type: application/json" \\  
  \-H "Authorization: Bearer $OPENAI\_API\_KEY" \\  
  \-d '{  
  "model": "gpt-4.1",  
  "input": "Create a payment link for $20",  
  "tools": \[  
    {  
      "type": "mcp",  
      "server\_label": "stripe",  
      "server\_url": "https://mcp.stripe.com",  
      "headers": {  
        "Authorization": "Bearer $STRIPE\_API\_KEY"  
      }  
    }  
  \]  
}'  
\`\`\`

\`\`\`javascript  
import OpenAI from "openai";  
const client \= new OpenAI();

const resp \= await client.responses.create({  
    model: "gpt-4.1",  
    input: "Create a payment link for $20",  
    tools: \[  
        {  
            type: "mcp",  
            server\_label: "stripe",  
            server\_url: "https://mcp.stripe.com",  
            headers: {  
                Authorization: "Bearer $STRIPE\_API\_KEY"  
            }  
        }  
    \]  
});

console.log(resp.output\_text);  
\`\`\`

\`\`\`python  
from openai import OpenAI

client \= OpenAI()

resp \= client.responses.create(  
    model="gpt-4.1",  
    input="Create a payment link for $20",  
    tools=\[  
        {  
            "type": "mcp",  
            "server\_label": "stripe",  
            "server\_url": "https://mcp.stripe.com",  
            "headers": {  
                "Authorization": "Bearer $STRIPE\_API\_KEY"  
            }  
        }  
    \]  
)

print(resp.output\_text)  
\`\`\`

To prevent the leakage of sensitive keys, the Responses API does not store the values of \*\*any\*\* string you provide in the \`headers\` object. These values will also not be visible in the Response object created. Additionally, because some remote MCP servers generate authenticated URLs, we also discard the \_path\_ portion of the \`server\_url\` in our responses (i.e. \`example.com/mcp\` becomes \`example.com\`). Because of this, you must send the full path of the MCP \`server\_url\` and any relevant \`headers\` in every Responses API creation request you make.

Risks and safety  
\----------------

The MCP tool permits you to connect OpenAI to services that have not been verified by OpenAI and allows OpenAI to access, send and receive data, and take action in these services. All MCP servers are third-party services that are subject to their own terms and conditions.

If you come across a malicious MCP server, please report it to \`security@openai.com\`.

\#\#\#\# Connecting to trusted servers

Pick official servers hosted by the service providers themselves (e.g. we recommend connecting to the Stripe server hosted by Stripe themselves on mcp.stripe.com, instead of a Stripe MCP server hosted by a third party). Because there aren't too many official remote MCP servers today, you may be tempted to use a MCP server hosted by an organization that doesn't operate that server and simply proxies request to that service via your API. If you must do this, be extra careful in doing your due diligence on these "aggregators", and carefully review how they use your data.

\#\#\#\# Log and review data being shared with third party MCP servers.

Because MCP servers define their own tool definitions, they may request for data that you may not always be comfortable sharing with the host of that MCP server. Because of this, the MCP tool in the Responses API defaults to requiring approvals of each MCP tool call being made. When developing your application, review the type of data being shared with these MCP servers carefully and robustly. Once you gain confidence in your trust of this MCP server, you can skip these approvals for more performant execution.

We also recommend logging any data sent to MCP servers. If you're using the Responses API with \`store=true\`, these data are already logged via the API for 30 days unless Zero Data Retention is enabled for your organization. You may also want to log these data in your own systems and perform periodic reviews on this to ensure data is being shared per your expectations.

Malicious MCP servers may include hidden instructions (prompt injections) designed to make OpenAI models behave unexpectedly. While OpenAI has implemented built-in safeguards to help detect and block these threats, it's essential to carefully review inputs and outputs, and ensure connections are established only with trusted servers.

MCP servers may update tool behavior unexpectedly, potentially leading to unintended or malicious behavior.

\#\#\#\# Implications on Zero Data Retention and Data Residency

The MCP tool is compatible with Zero Data Retention and Data Residency, but it's important to note that MCP servers are third-party services, and data sent to an MCP server is subject to their data retention and data residency policies.

In other words, if you're an organization with Data Residency in Europe, OpenAI will limit inference and storage of Customer Content to take place in Europe up until the point communication or data is sent to the MCP server. It is your responsibility to ensure that the MCP server also adheres to any Zero Data Retention or Data Residency requirements you may have. Learn more about Zero Data Retention and Data Residency \[here\](/docs/guides/your-data).

Usage notes  
\-----------

||  
|ResponsesChat CompletionsAssistants|Tier 1200 RPMTier 2 and 31000 RPMTier 4 and 52000 RPM|PricingZDR and data residency|

Image generation  
\================

Allow models to generate or edit images.

The image generation tool allows you to generate images using a text prompt, and optionally image inputs. It leverages the \[GPT Image model\](/docs/models/gpt-image-1), and automatically optimizes text inputs for improved performance.

To learn more about image generation, refer to our dedicated \[image generation guide\](/docs/guides/image-generation?image-generation-model=gpt-image-1\&api=responses).

Usage  
\-----

When you include the \`image\_generation\` tool in your request, the model can decide when and how to generate images as part of the conversation, using your prompt and any provided image inputs.

The \`image\_generation\_call\` tool call result will include a base64-encoded image.

Generate an image

\`\`\`javascript  
import OpenAI from "openai";  
const openai \= new OpenAI();

const response \= await openai.responses.create({  
    model: "gpt-4.1-mini",  
    input: "Generate an image of gray tabby cat hugging an otter with an orange scarf",  
    tools: \[{type: "image\_generation"}\],  
});

// Save the image to a file  
const imageData \= response.output  
  .filter((output) \=\> output.type \=== "image\_generation\_call")  
  .map((output) \=\> output.result);

if (imageData.length \> 0\) {  
  const imageBase64 \= imageData\[0\];  
  const fs \= await import("fs");  
  fs.writeFileSync("otter.png", Buffer.from(imageBase64, "base64"));  
}  
\`\`\`

\`\`\`python  
from openai import OpenAI  
import base64

client \= OpenAI() 

response \= client.responses.create(  
    model="gpt-4.1-mini",  
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",  
    tools=\[{"type": "image\_generation"}\],  
)

\# Save the image to a file  
image\_data \= \[  
    output.result  
    for output in response.output  
    if output.type \== "image\_generation\_call"  
\]  
      
if image\_data:  
    image\_base64 \= image\_data\[0\]  
    with open("otter.png", "wb") as f:  
        f.write(base64.b64decode(image\_base64))  
\`\`\`

You can \[provide input images\](/docs/guides/image-generation?image-generation-model=gpt-image-1\#edit-images) using file IDs or base64 data.

To force the image generation tool call, you can set the parameter \`tool\_choice\` to \`{"type": "image\_generation"}\`.

\#\#\# Tool options

You can configure the following output options as parameters for the \[image generation tool\](/docs/api-reference/responses/create\#responses-create-tools):

\*   Size: Image dimensions (e.g., 1024x1024, 1024x1536)  
\*   Quality: Rendering quality (e.g. low, medium, high)  
\*   Format: File output format  
\*   Compression: Compression level (0-100%) for JPEG and WebP formats  
\*   Background: Transparent or opaque

\`size\`, \`quality\`, and \`background\` support the \`auto\` option, where the model will automatically select the best option based on the prompt.

For more details on available options, refer to the \[image generation guide\](/docs/guides/image-generation\#customize-image-output).

\#\#\# Revised prompt

When using the image generation tool, the mainline model (e.g. \`gpt-4.1\`) will automatically revise your prompt for improved performance.

You can access the revised prompt in the \`revised\_prompt\` field of the image generation call:

\`\`\`json  
{  
  "id": "ig\_123",  
  "type": "image\_generation\_call",  
  "status": "completed",  
  "revised\_prompt": "A gray tabby cat hugging an otter. The otter is wearing an orange scarf. Both animals are cute and friendly, depicted in a warm, heartwarming style.",  
  "result": "..."  
}  
\`\`\`

\#\#\# Prompting tips

Image generation works best when you use terms like "draw" or "edit" in your prompt.

For example, if you want to combine images, instead of saying "combine" or "merge", you can say something like "edit the first image by adding this element from the second image".

Multi-turn editing  
\------------------

You can iteratively edit images by referencing previous response or image IDs. This allows you to refine images across multiple turns in a conversation.

Using previous response ID

Multi-turn image generation

\`\`\`javascript  
import OpenAI from "openai";  
const openai \= new OpenAI();

const response \= await openai.responses.create({  
  model: "gpt-4.1-mini",  
  input:  
    "Generate an image of gray tabby cat hugging an otter with an orange scarf",  
  tools: \[{ type: "image\_generation" }\],  
});

const imageData \= response.output  
  .filter((output) \=\> output.type \=== "image\_generation\_call")  
  .map((output) \=\> output.result);

if (imageData.length \> 0\) {  
  const imageBase64 \= imageData\[0\];  
  const fs \= await import("fs");  
  fs.writeFileSync("cat\_and\_otter.png", Buffer.from(imageBase64, "base64"));  
}

// Follow up

const response\_fwup \= await openai.responses.create({  
  model: "gpt-4.1-mini",  
  previous\_response\_id: response.id,  
  input: "Now make it look realistic",  
  tools: \[{ type: "image\_generation" }\],  
});

const imageData\_fwup \= response\_fwup.output  
  .filter((output) \=\> output.type \=== "image\_generation\_call")  
  .map((output) \=\> output.result);

if (imageData\_fwup.length \> 0\) {  
  const imageBase64 \= imageData\_fwup\[0\];  
  const fs \= await import("fs");  
  fs.writeFileSync(  
    "cat\_and\_otter\_realistic.png",  
    Buffer.from(imageBase64, "base64")  
  );  
}  
\`\`\`

\`\`\`python  
from openai import OpenAI  
import base64

client \= OpenAI()

response \= client.responses.create(  
    model="gpt-4.1-mini",  
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",  
    tools=\[{"type": "image\_generation"}\],  
)

image\_data \= \[  
    output.result  
    for output in response.output  
    if output.type \== "image\_generation\_call"  
\]

if image\_data:  
    image\_base64 \= image\_data\[0\]

    with open("cat\_and\_otter.png", "wb") as f:  
        f.write(base64.b64decode(image\_base64))

\# Follow up

response\_fwup \= client.responses.create(  
    model="gpt-4.1-mini",  
    previous\_response\_id=response.id,  
    input="Now make it look realistic",  
    tools=\[{"type": "image\_generation"}\],  
)

image\_data\_fwup \= \[  
    output.result  
    for output in response\_fwup.output  
    if output.type \== "image\_generation\_call"  
\]

if image\_data\_fwup:  
    image\_base64 \= image\_data\_fwup\[0\]  
    with open("cat\_and\_otter\_realistic.png", "wb") as f:  
        f.write(base64.b64decode(image\_base64))  
\`\`\`

Using image ID

Multi-turn image generation

\`\`\`javascript  
import OpenAI from "openai";  
const openai \= new OpenAI();

const response \= await openai.responses.create({  
  model: "gpt-4.1-mini",  
  input:  
    "Generate an image of gray tabby cat hugging an otter with an orange scarf",  
  tools: \[{ type: "image\_generation" }\],  
});

const imageGenerationCalls \= response.output.filter(  
  (output) \=\> output.type \=== "image\_generation\_call"  
);

const imageData \= imageGenerationCalls.map((output) \=\> output.result);

if (imageData.length \> 0\) {  
  const imageBase64 \= imageData\[0\];  
  const fs \= await import("fs");  
  fs.writeFileSync("cat\_and\_otter.png", Buffer.from(imageBase64, "base64"));  
}

// Follow up

const response\_fwup \= await openai.responses.create({  
  model: "gpt-4.1-mini",  
  input: \[  
    {  
      role: "user",  
      content: \[{ type: "input\_text", text: "Now make it look realistic" }\],  
    },  
    {  
      type: "image\_generation\_call",  
      id: imageGenerationCalls\[0\].id,  
    },  
  \],  
  tools: \[{ type: "image\_generation" }\],  
});

const imageData\_fwup \= response\_fwup.output  
  .filter((output) \=\> output.type \=== "image\_generation\_call")  
  .map((output) \=\> output.result);

if (imageData\_fwup.length \> 0\) {  
  const imageBase64 \= imageData\_fwup\[0\];  
  const fs \= await import("fs");  
  fs.writeFileSync(  
    "cat\_and\_otter\_realistic.png",  
    Buffer.from(imageBase64, "base64")  
  );  
}  
\`\`\`

\`\`\`python  
import openai  
import base64

response \= openai.responses.create(  
    model="gpt-4.1-mini",  
    input="Generate an image of gray tabby cat hugging an otter with an orange scarf",  
    tools=\[{"type": "image\_generation"}\],  
)

image\_generation\_calls \= \[  
    output  
    for output in response.output  
    if output.type \== "image\_generation\_call"  
\]

image\_data \= \[output.result for output in image\_generation\_calls\]

if image\_data:  
    image\_base64 \= image\_data\[0\]

    with open("cat\_and\_otter.png", "wb") as f:  
        f.write(base64.b64decode(image\_base64))

\# Follow up

response\_fwup \= openai.responses.create(  
    model="gpt-4.1-mini",  
    input=\[  
        {  
            "role": "user",  
            "content": \[{"type": "input\_text", "text": "Now make it look realistic"}\],  
        },  
        {  
            "type": "image\_generation\_call",  
            "id": image\_generation\_calls\[0\].id,  
        },  
    \],  
    tools=\[{"type": "image\_generation"}\],  
)

image\_data\_fwup \= \[  
    output.result  
    for output in response\_fwup.output  
    if output.type \== "image\_generation\_call"  
\]

if image\_data\_fwup:  
    image\_base64 \= image\_data\_fwup\[0\]  
    with open("cat\_and\_otter\_realistic.png", "wb") as f:  
        f.write(base64.b64decode(image\_base64))  
\`\`\`

Streaming  
\---------

The image generation tool supports streaming partial images as the final result is being generated. This provides faster visual feedback for users and improves perceived latency.

You can set the number of partial images (1-3) with the \`partial\_images\` parameter.

Stream an image

\`\`\`javascript  
import OpenAI from "openai";  
import fs from "fs";  
const openai \= new OpenAI();

const stream \= await openai.responses.create({  
  model: "gpt-4.1",  
  input:  
    "Draw a gorgeous image of a river made of white owl feathers, snaking its way through a serene winter landscape",  
  stream: true,  
  tools: \[{ type: "image\_generation", partial\_images: 2 }\],  
});

for await (const event of stream) {  
  if (event.type \=== "response.image\_generation\_call.partial\_image") {  
    const idx \= event.partial\_image\_index;  
    const imageBase64 \= event.partial\_image\_b64;  
    const imageBuffer \= Buffer.from(imageBase64, "base64");  
    fs.writeFileSync(\`river${idx}.png\`, imageBuffer);  
  }  
}  
\`\`\`

\`\`\`python  
from openai import OpenAI  
import base64

client \= OpenAI()

stream \= client.responses.create(  
    model="gpt-4.1",  
    input="Draw a gorgeous image of a river made of white owl feathers, snaking its way through a serene winter landscape",  
    stream=True,  
    tools=\[{"type": "image\_generation", "partial\_images": 2}\],  
)

for event in stream:  
    if event.type \== "response.image\_generation\_call.partial\_image":  
        idx \= event.partial\_image\_index  
        image\_base64 \= event.partial\_image\_b64  
        image\_bytes \= base64.b64decode(image\_base64)  
        with open(f"river{idx}.png", "wb") as f:  
            f.write(image\_bytes)  
\`\`\`

Supported models  
\----------------

The image generation tool is supported for the following models:

\*   \`gpt-4o\`  
\*   \`gpt-4o-mini\`  
\*   \`gpt-4.1\`  
\*   \`gpt-4.1-mini\`  
\*   \`gpt-4.1-nano\`  
\*   \`o3\`

The model used for the image generation process is always \`gpt-image-1\`, but these models can be used as the mainline model in the Responses API as they can reliably call the image generation tool when needed.g

Code Interpreter  
\================

Allow models to write and run Python to solve problems.

The Code Interpreter tool allows models to write and run Python code in a sandboxed environment to solve complex problems in domains like data analysis, coding, and math. Use it for:

\*   Processing files with diverse data and formatting  
\*   Generating files with data and images of graphs  
\*   Writing and running code iteratively to solve problems—for example, a model that writes code that fails to run can keep rewriting and running that code until it succeeds

Code Interpreter is available in the \[Responses API\](/docs/api-reference/responses) across all models.

Our latest reasoning models o3 and o4-mini are trained to use Code Interpreter to deeply understand images. They can crop, zoom in, rotate, and perform other image processing techniques to boost their visual intelligence.

Code Interpreter is charged at $0.03 per container creation. See the \[pricing page\](/docs/pricing) for information about usage cost.

While we call this tool Code Interpreter, the model knows it as the \`python\` tool. Models usually understand prompts that refer to the code interpreter tool. However, the most explicit way to invoke this tool is to ask for "the python tool" in your prompts.

Here's an example of calling the Responses API with a tool call to Code Interpreter:

Use the Responses API with Code Interpreter

\`\`\`bash  
curl https://api.openai.com/v1/responses \\  
  \-H "Content-Type: application/json" \\  
  \-H "Authorization: Bearer $OPENAI\_API\_KEY" \\  
  \-d '{  
    "model": "gpt-4.1",  
    "tools": \[{  
      "type": "code\_interpreter",  
      "container": { "type": "auto" }  
    }\],  
    "instructions": "You are a personal math tutor. When asked a math question, write and run code to answer the question.",  
    "input": "I need to solve the equation 3x \+ 11 \= 14\. Can you help me?"  
  }'  
\`\`\`

\`\`\`javascript  
import OpenAI from "openai";  
const client \= new OpenAI();

const resp \= await client.responses.create({  
  model: "gpt-4.1",  
  tools: \[  
    {  
      type: "code\_interpreter",  
      container: { type: "auto" }  
    }  
  \],  
  instructions: "You are a personal math tutor. When asked a math question, write and run code to answer the question.",  
  input: "I need to solve the equation 3x \+ 11 \= 14\. Can you help me?",  
});

console.log(resp.output\_text);  
\`\`\`

\`\`\`python  
from openai import OpenAI  
client \= OpenAI()

resp \= client.responses.create(  
  model="gpt-4.1",  
  tools=\[  
    {  
      "type": "code\_interpreter",  
      "container": { "type": "auto" }  
    }  
  \],  
  instructions="You are a personal math tutor. When asked a math question, write and run code to answer the question.",  
  input="I need to solve the equation 3x \+ 11 \= 14\. Can you help me?",  
)

print(resp.output\_text)  
\`\`\`

Containers  
\----------

The Code Interpreter tool requires a \[container object\](/docs/api-reference/containers/object). A container is a fully sandboxed virtual machine that the model can run Python code in. This container can contain files that you upload, or that it generates.

There are two ways to create containers:

1\.  Auto mode: as seen in the example above, you can do this by passing the \`"container": { "type": "auto", files: \["file-1", "file-2"\] }\` property in the tool configuration while creating a new Response object. This automatically creates a new container, or reuses an active container that was used by a previous \`code\_interpreter\_call\` item in the model's context. Look for the \`code\_interpreter\_call\` item in the output of this API request to find the \`container\_id\` that was generated or used.  
2\.  Explicit mode: here, you explicitly \[create a container\](/docs/api-reference/containers/createContainers) using the \`v1/containers\` endpoint, and assign its \`id\` as the \`container\` value in the tool configuration in the Response object. For example:

Use explicit container creation

\`\`\`bash  
curl https://api.openai.com/v1/containers \\  
  \-H "Authorization: Bearer $OPENAI\_API\_KEY" \\  
  \-H "Content-Type: application/json" \\  
  \-d '{  
        "name": "My Container"  
      }'

\# Use the returned container id in the next call:  
curl https://api.openai.com/v1/responses \\  
  \-H "Authorization: Bearer $OPENAI\_API\_KEY" \\  
  \-H "Content-Type: application/json" \\  
  \-d '{  
    "model": "gpt-4.1",  
    "tools": \[{  
      "type": "code\_interpreter",  
      "container": "cntr\_abc123"  
    }\],  
    "tool\_choice": "required",  
    "input": "use the python tool to calculate what is 4 \* 3.82. and then find its square root and then find the square root of that result"  
  }'  
\`\`\`

\`\`\`python  
from openai import OpenAI  
client \= OpenAI()

container \= client.containers.create(name="test-container")

response \= client.responses.create(  
    model="gpt-4.1",  
    tools=\[{  
        "type": "code\_interpreter",  
        "container": container.id  
    }\],  
    tool\_choice="required",  
    input="use the python tool to calculate what is 4 \* 3.82. and then find its square root and then find the square root of that result"  
)

print(response.output\_text)  
\`\`\`

\`\`\`javascript  
import OpenAI from "openai";  
const client \= new OpenAI();

const container \= await client.containers.create({ name: "test-container" });

const resp \= await client.responses.create({  
    model: "gpt-4.1",  
    tools: \[  
      {  
        type: "code\_interpreter",  
        container: container.id  
      }  
    \],  
    tool\_choice: "required",  
    input: "use the python tool to calculate what is 4 \* 3.82. and then find its square root and then find the square root of that result"  
});

console.log(resp.output\_text);  
\`\`\`

Note that containers created with the auto mode are also accessible using the \`v1/containers\` endpoint.

\#\#\# Expiration

We highly recommend you treat containers as ephemeral and store all data related to the use of this tool on your own systems. Expiration details:

\*   A container expires if it is not used for 20 minutes. When this happens, using the container in \`v1/responses\` will fail. You'll still be able to see a snapshot of the container's metadata at its expiry, but all data associated with the container will be discarded from our systems and not recoverable. You should download any files you may need from the container while it is active.  
\*   You can't move a container from an expired state to an active one. Instead, create a new container and upload files again. Note that any state in the old container's memory (like python objects) will be lost.  
\*   Any container operation, like retrieving the container, or adding or deleting files from the container, will automatically refresh the container's \`last\_active\_at\` time.

Work with files  
\---------------

When running Code Interpreter, the model can create its own files. For example, if you ask it to construct a plot, or create a CSV, it creates these images directly on your container. When it does so, it cites these files in the \`annotations\` of its next message. Here's an example:

\`\`\`json  
{  
  "id": "msg\_682d514e268c8191a89c38ea318446200f2610a7ec781a4f",  
  "content": \[  
    {  
      "annotations": \[  
        {  
          "file\_id": "cfile\_682d514b2e00819184b9b07e13557f82",  
          "index": null,  
          "type": "container\_file\_citation",  
          "container\_id": "cntr\_682d513bb0c48191b10bd4f8b0b3312200e64562acc2e0af",  
          "end\_index": 0,  
          "filename": "cfile\_682d514b2e00819184b9b07e13557f82.png",  
          "start\_index": 0  
        }  
      \],  
      "text": "Here is the histogram of the RGB channels for the uploaded image. Each curve represents the distribution of pixel intensities for the red, green, and blue channels. Peaks toward the high end of the intensity scale (right-hand side) suggest a lot of brightness and strong warm tones, matching the orange and light background in the image. If you want a different style of histogram (e.g., overall intensity, or quantized color groups), let me know\!",  
      "type": "output\_text",  
      "logprobs": \[\]  
    }  
  \],  
  "role": "assistant",  
  "status": "completed",  
  "type": "message"  
}  
\`\`\`

You can download these constructed files by calling the \[get container file content\](/docs/api-reference/container-files/retrieveContainerFileContent) method.

Any \[files in the model input\](/docs/guides/pdf-files) get automatically uploaded to the container. You do not have to explicitly upload it to the container.

\#\#\# Supported files

|File format|MIME type|  
|---|---|  
|.c|text/x-c|  
|.cs|text/x-csharp|  
|.cpp|text/x-c++|  
|.csv|text/csv|  
|.doc|application/msword|  
|.docx|application/vnd.openxmlformats-officedocument.wordprocessingml.document|  
|.html|text/html|  
|.java|text/x-java|  
|.json|application/json|  
|.md|text/markdown|  
|.pdf|application/pdf|  
|.php|text/x-php|  
|.pptx|application/vnd.openxmlformats-officedocument.presentationml.presentation|  
|.py|text/x-python|  
|.py|text/x-script.python|  
|.rb|text/x-ruby|  
|.tex|text/x-tex|  
|.txt|text/plain|  
|.css|text/css|  
|.js|text/javascript|  
|.sh|application/x-sh|  
|.ts|application/typescript|  
|.csv|application/csv|  
|.jpeg|image/jpeg|  
|.jpg|image/jpeg|  
|.gif|image/gif|  
|.pkl|application/octet-stream|  
|.png|image/png|  
|.tar|application/x-tar|  
|.xlsx|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|  
|.xml|application/xml or "text/xml"|  
|.zip|application/zip|

Usage notes  
\-----------

||  
|ResponsesChat CompletionsAssistants|100 RPM per org|PricingZDR and data residency|

