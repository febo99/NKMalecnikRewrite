const openTrainingModal = () => {
  const button = document.querySelector('#openTrainingModal');
  if (button) {
    if (button.classList.contains('show')) {
      const event = document.createEvent('MouseEvent');
      event.initEvent('click', true, false);
      button.dispatchEvent(event);
    }
  }
};

window.addEventListener('load', () => {
  openTrainingModal();
});
