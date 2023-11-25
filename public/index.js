const OPENAI_API_URL = '/.netlify/functions/api';

const conversationArr = [
];

document.addEventListener('DOMContentLoaded', function() {
    var loader = document.getElementById('loader');
    var userInput = document.getElementById('userInput');

    document.getElementById('btn').addEventListener('click', function() {
        loader.style.display = 'block';
        conversationArr.push({
            role: 'user',
            content: userInput.value
        });

        userInput.value = '';
        fetchReply();
    });
});


async function fetchReply() {
    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: conversationArr })
        });
        const responseData = await response.json();
        conversationArr.push({role: 'assistant', content: responseData.message});
        renderAllResponses();
    } catch (error) {
        console.error('Error fetching response from server:', error);
    }
}

function typewriterEffect(text, element, speed = 50, callback) {
    let i = 0;
    const typeInterval = setInterval(function () {
        element.innerHTML += text.charAt(i);
        i++;
        if (i > text.length - 1) {
            clearInterval(typeInterval);
            if (callback) {
                callback();
            }
        }
    }, speed);
}

// Update your renderAllResponses function
function renderAllResponses() {
    var responseDiv = document.getElementById('response');
    var loader = document.getElementById('loader');

    // Hide loader once the response is received
    loader.style.display = 'none';

    responseDiv.innerHTML = '';

    conversationArr.forEach((message, index) => {
        if (message.role === 'assistant') {
            // Display loader while waiting for the response
            loader.style.display = 'none';
            // Render the assistant's formatted response
            const assistantResponse = document.createElement('div');
            assistantResponse.className = 'assistant-response';
            responseDiv.appendChild(assistantResponse);

            if (index === conversationArr.length - 1) {
                // Apply typewriter effect only to the last assistant response
                typewriterEffect(message.content, assistantResponse, 10, function() {
                    // Hide loader once the typewriter effect is complete
                    loader.style.display = 'none';
                });
            } else {
                assistantResponse.innerHTML = message.content;
            }
        } else {
            // Render user's and system's messages
            responseDiv.innerHTML += `
                <p><strong>Me:</strong> ${message.content}</p>
            `;
        }
    });
}