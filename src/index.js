import bot from '../assets/bot.svg';
import user from '../assets/user.svg';

const form = document.querySelector('form');
const chat_container = document.querySelector('#chat_container');
let loadInterval;

function loader(element) {
  element.textContent = '';
  
  loadInterval = setInterval(() => {
    element.textContent += '.';
    if(element.textContent === '......'){
      element.textContent = '';
    }
  }, 200 );

  return '...';
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 2 );
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomMumber = Math.random();
  const hexString = randomMumber.toString(16);

  return `id-${timestamp}-${hexString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return (
    `
      <div class="w-full p-3.5 ${isAi ? 'ai bg-ai' : 'user'}">
        <div class="chat w-full max-w-7xl mt-0 mb-0 ml-auto mr-auto flex flex-row items-start gap-2.5">
          <div class="bg-user w-8 h-8 rounded flex justify-center items-center">
            <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}"/>
          </div>
          <div class="${isAi && 'whitespace-pre-wrap'} message flex-1 max-w-full overflow-x-scroll font-sans text-base" id="${uniqueId}">
            ${value}
          </div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user chat-stripe
  chat_container.innerHTML += chatStripe(false, data.get('prompt'), null);

  form.reset();

  // bot chat-stripe
  const uniqueId = generateUniqueId();

  chat_container.innerHTML += chatStripe(true, ' ', uniqueId);

  chat_container.scrollTop = chat_container.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  const response = await fetch('https://openai-textgen-server.vercel.app', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt'),
    }),
  });

  clearInterval(loadInterval);
  
  messageDiv.innerHTML = ' ';

  if(response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData)
  } else {
    const err = await response.text;

    messageDiv.innerHTML = 'Something went wrong';
    alert(err);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) {
    handleSubmit(e);
  }
})