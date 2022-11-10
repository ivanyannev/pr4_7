window.disableScroll = function () {
  const widthScroll = window.innerWidth - document.body.offsetWidth;

  document.body.style.cssText = `
        position: relative;
        overflow: hidden;
        heigth: 100vh;
        padding-right: ${widthScroll}px;
    `;
};
window.enableScroll = function () {
  document.body.style.cssText = ``;
};
