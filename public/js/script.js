const updatePostCharCounter = () => {
  const charLength = document.querySelector('#post').value.length;
  document.querySelector('#charCounter').innerHTML = `${charLength}/250`;
  if (charLength >= 250) return false;
};

const updateCommentCharCounter = (id) => {

};

window.addEventListener('load', () => {
  document.querySelector('#post').addEventListener('input', updatePostCharCounter);

  const commentCounter = document.querySelectorAll('.commentCounter');
  commentCounter.forEach((item) => {
    item.addEventListener('input');
  });
});
