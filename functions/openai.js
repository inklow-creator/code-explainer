const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const requestBody = JSON.parse(event.body);

        // **التغيير هنا: استقبال رسالتي النظام والمستخدم**
        const systemMessage = requestBody.system_message; 
        const userMessage = requestBody.user_message; 

        if (!userMessage || !systemMessage) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing system or user message" })
            };
        }

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                // **إرسال الرسالتين بنفس هيكل الكود الأصلي**
                messages: [
                    { role: "system", content: systemMessage },
                    { role: "user", content: userMessage }
                ],
                temperature: 0.5
            })
        });

        const data = await response.json();

        if (data.error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: data.error.message })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
        };
    } catch (error) {
        console.error("Netlify Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error during processing." }),
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
        };
    }
};
