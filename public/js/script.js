window.addEventListener('load', () => {
  let welcome;
  const date = new Date();
  const hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  if (minute < 10) { minute = `0${minute}`; }
  if (second < 10) { second = `0${second}`; }
  if (hour < 12) { welcome = 'Dobro jutro'; } else { welcome = 'Dober večer'; }
  document.querySelector('.welcome').innerHTML = `${welcome}`;
});
