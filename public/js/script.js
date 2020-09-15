const updatePostCharCounter = () => {
  const charLength = document.querySelector('#post').value.length;
  document.querySelector('#charCounter').innerHTML = `${charLength}/250`;
  if (charLength >= 250) return false;
  return true;
};

const updateCommentCharCounter = (id) => {
  const charLength = document.querySelector(`#comment${id}`).value.length;
  document.querySelector(`#commentCounter${id}`).innerHTML = `${charLength}/250`;
  if (charLength >= 250) return false;
  return true;
};

window.addEventListener('load', () => {
  console.log('test');
  document.querySelector('#post').addEventListener('input', updatePostCharCounter);
  updateCommentCharCounter(0);
  const commentCounter = document.querySelectorAll('.commentCounter');
  commentCounter.forEach((item) => {
    item.addEventListener('input');
  });
});
