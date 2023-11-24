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
        // const messages = JSON.parse(event.body);
        // console.log(messages)
        const openai = new OpenAI()
        const response = await openai.chat.completions.create({
            model: 'gpt-4-1106-preview',
            messages:[],
          });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message:response.choices[0].message.content,
          }),
        };
      } catch (error) {
        // Return an error response if there was an issue processing the request
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: error }),
        };
      }
    } else if (event.httpMethod === "POST") {
      try {
        const messages = JSON.parse(event.body).messages;
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
          body: JSON.stringify({ error: event.body }),
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