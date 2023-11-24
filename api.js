import { OpenAI } from 'openai'

exports.handler = async (event, context) => {
    // Set headers to enable CORS
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, POST",
    };
  
    if (event.httpMethod === "GET") {
      try {
        // Process the GET request as needed
        const data = require("./db.json");
  
        // Return the data as the response
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(data),
        };
      } catch (error) {
        // Return an error response if there was an issue processing the request
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: "Failed to process GET request" }),
        };
      }
    } else if (event.httpMethod === "POST") {
      try {
        const requestBody = JSON.parse(event.body);
        const openai = new OpenAI()
        const response = await openai.chat.completions.create({
            model: 'gpt-4-1106-preview',
            messages,
          });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message:response.choices[0].message.content,
          }),
        };
      } catch (error) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Failed to process POST request" }),
        };
      }
    } else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }
  };