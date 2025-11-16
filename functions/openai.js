// functions/openai.js

const fetch = require('node-fetch');

exports.handler = async (event) => {
    // هذا المتغير سيتم ملؤه تلقائياً بالمفتاح السري من إعدادات Netlify
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (event.httpMethod !== 'POST' || !event.body) {
        return { statusCode: 405, body: 'الطريقة غير مسموح بها' };
    }

    try {
        const requestBody = JSON.parse(event.body);
        const userPrompt = requestBody.prompt;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                // استخدام المفتاح السري الآمن
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // يمكنك تغيير النموذج هنا
                messages: [{ role: "user", content: userPrompt }],
            }),
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            }
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'خطأ داخلي في الخادم الوسيط: ' + error.message }),
        };
    }
};