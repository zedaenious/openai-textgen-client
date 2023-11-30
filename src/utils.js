import bot from '../assets/bot.svg';
import user from '../assets/user.svg';

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 10 );
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomMumber = Math.random();
  const hexString = randomMumber.toString(16);

  return `id-${timestamp}-${hexString}`;
}

function chatStripe(isAi, prompt, id) {
  return (
    `
      <div class="w-full p-3.5 ${isAi ? 'ai bg-ai' : 'user'}">
        <div class="chat w-full max-w-7xl mt-0 mb-0 ml-auto mr-auto flex flex-row items-start gap-2.5">
          <div class="bg-user w-8 h-8 rounded flex justify-center items-center">
            <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}"/>
          </div>
          <div class="${isAi && 'whitespace-pre-wrap'} message flex-1 max-w-full overflow-x-scroll font-sans text-base" id="${id}">
            ${prompt}
          </div>
        </div>
      </div>
    `
  )
}

export {
  typeText,
  generateUniqueId,
  chatStripe,
}