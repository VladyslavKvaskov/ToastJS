let toastId = 0;
class Toast extends HTMLElement {
  constructor() {
    super();
    toastId++;
    this.identity = toastId;
    this.onclose = null;
  }

  delete() {
    if (typeof this.onclose === 'function') {
      this.onclose();
    }
    this.classList.add('hide');
    setTimeout(() => {
      this.remove();
    }, 1500);
  }


  onOutsideClick(callback) {
    this.dataset.id = this.identity;
    document.addEventListener('click', (e) => {
      if (!e.target.closest(`[data-id="${this.identity}"]`)) {
        callback();
      }
    });
  }
}

window.customElements.define('toast-message', Toast);

class Toaster {
  constructor(config) {
    this.timing = Number.isInteger(config.timing) ? parseInt(config.timing) : 5000;
    this.text = config.text || '';
    this.html = config.html || '';
    this.title = config.title || '';
    this.titleIcon = config.titleIcon || '';
    this.showTimer = config.showTimer || false;
    this.interactive = config.interactive || false;
    this.closeOnOutsideClick = (config.closeOnOutsideClick === false) ? false : true;
    this.showCloseBttn = config.showCloseBttn || false;

    this.status =
      config.status === 'success' || config.status === 'info' ||
      config.status === 'warning' || config.status === 'error' ?
      config.status : 'default';

    this.icon =
      config.icon === 'success' || config.icon === 'info' ||
      config.icon === 'warning' || config.icon === 'error' ?
      config.icon : 'default';

    this.position =
      config.position === 'left' || config.position === 'right' || config.position === 'bottom' ||
      config.position === 'center' || config.position === 'top-left' || config.position === 'top-right' ||
      config.position === 'bottom-left' || config.position === 'bottom-right' ?
      config.position : 'top';

    this.onOpen = (typeof config.onOpen === 'function') ? config.onOpen : '';
    this.onClose = (typeof config.onClose === 'function') ? config.onClose : '';


    const toastMessage = document.createElement('toast-message');

    toastMessage.innerHTML = `
      <div class="wrapper">
        ${(this.title || this.titleIcon || this.showCloseButton) ? `
            <div class="top-bar">
              <div class="title">
                <div class="title-and-icon">
                  ${this.titleIcon?`<span class="title-icon" style="background-image:url('${this.titleIcon}')" data-img-url="${this.titleIcon}"></span>`:''}
                  <span class="toast-title">${this.title}</span>
                </div>
                ${this.showCloseBttn ? '<button type="button" class="close-bttn"></button>' : ''}
              </div>
            </div>
          ` : ''}
        <div class="content">
          <div class="toast-main">${this.html || this.text}</div>
        </div>

        ${(this.showTimer && !this.interactive) ? `<div class="progress-bar" style="animation-duration: ${this.timing / 1000}s"></div>`:''}
      </div>
    `;

    if (this.onClose) {
      toastMessage.onclose = () => {
        this.onClose(toastMessage);
      }
    }

    const closeBttn = toastMessage.querySelector('.close-bttn');
    if (closeBttn) {
      closeBttn.addEventListener('click', () => {
        toastMessage.delete();
      });
    }

    const titleIcon = toastMessage.querySelector('.title-icon');


    toastMessage.dataset.status = this.status;
    toastMessage.dataset.icon = this.icon;
    toastMessage.dataset.position = this.position;

    this.cssClass = config.cssClass ? config.cssClass : '';
    if (Array.isArray(this.cssClass)) {
      for (let cssClass of this.cssClass) {
        if (typeof cssClass === 'string' || cssClass instanceof String) {
          toastMessage.classList.add(cssClass);
        }
      }
    } else if (typeof this.cssClass === 'string' || this.cssClass instanceof String) {
      toastMessage.classList.add(this.cssClass);
    }

    setTimeout(() => {
      toastMessage.classList.add(this.position);

    }, 50);

    if (this.onOpen) {
      this.onOpen(toastMessage);
    }

    document.body.append(toastMessage);

    if (!this.interactive) {
      setTimeout(() => {
        toastMessage.delete();
      }, this.timing);
    }
    if (this.closeOnOutsideClick) {
      toastMessage.onOutsideClick(() => {
        toastMessage.delete();
      });
    }

  }
}

function removeAllToasts() {
  for (const toastMsg of document.querySelectorAll('toast-message')) {
    toastMsg.delete();
  }
}



const cssTxt = `
  toast-message * {
    box-sizing: border-box;
  }

  toast-message {
    --toast-outer-spacing: 20px;
    --toast-body-font-size: 18px;
    --toast-body-font-family: sans-serif;
    --toast-title-bg: #fff;
    --toast-success: #00C851;
    --toast-error: #ff4444;
    --toast-warning: #ffbb33;
    --toast-info: #33b5e5;
    --toast-default: #fff;
    --toast-padding: 20px;
    --toast-shadow-color: #999;
    --z-index: 1000000;
  }

  toast-message {
    position: fixed;
    min-width: 300px;
    max-width: 90%;
    margin: auto;
    font-size: var(--toast-body-font-size);
    transition: 0.5s;
    z-index: var(--z-index);
    /* border-radius: 7px;
    overflow: hidden; */
  }

  toast-message .wrapper {
    background-color: #fff;
  }

  toast-message[data-status="success"] .title {
    background-color: var(--toast-success);
    color: #fff;
  }

  toast-message[data-status="error"] .title {
    background-color: var(--toast-error);
    color: #fff;
  }

  toast-message[data-status="warning"] .title {
    background-color: var(--toast-warning);
  }

  toast-message[data-status="warning"] .close-bttn::before, toast-message[data-status="warning"] .close-bttn::after {
    background-color: #000;
  }

  toast-message[data-status="info"] .title {
    background-color: var(--toast-info);
    color: #fff;
  }

  toast-message[data-status="default"] .title {
    background-color: var(--toast-default);
  }

  toast-message[data-status="default"] .close-bttn::before, toast-message[data-status="default"] .close-bttn::after {
    background-color: #000;
  }

  toast-message .close-bttn {
    width: 25px;
    height: 25px;
    background-color: transparent;
    position: relative;
    transition: 0.3s;
    cursor: pointer;
  }

  toast-message .close-bttn::before, toast-message .close-bttn::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: #fff;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    /* left: 50%; */
    transform-origin: center;
    transition: 0.3s;
  }

  toast-message .close-bttn:hover::before, toast-message .close-bttn:hover::after, toast-message .close-bttn:focus::before, toast-message .close-bttn:focus::after {
    background-color: #fff;
  }

  toast-message .close-bttn:hover, toast-message .close-bttn:focus {
    background-color: var(--toast-error);
  }

  toast-message .close-bttn::before {
    transform: rotate(45deg);
  }

  toast-message .close-bttn::after {
    transform: rotate(-45deg);
  }

  toast-message .title-icon {
    width: 25px;
    height: 25px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: inline-block;
  }

  toast-message .title {
    font-family: var(--toast-body-font-family);
    background-color: var(--toast-title-bg);
    color: #000;
    min-height: 21px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 3px;
  }

  toast-message .title-and-icon {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }

  toast-message .toast-title {
    padding-left: 5px;
  }

  toast-message .content {
    padding: var(--toast-padding);
    font-family: var(--toast-body-font-family);
    background-color: #fff;
  }

  toast-message .progress-bar {
    background-color: #999;
    width: 100%;
    height: 3px;
    transform-origin: left;
    animation-name: toast-message-progress-bar;
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  @keyframes toast-message-progress-bar {
    0% {
      transform: scaleX(1);
    }

    100% {
      transform: scaleX(0);
    }
  }

  toast-message[data-position="top"] {
    transform: translate(-50%, calc(-100% - var(--toast-outer-spacing)));
    visibility: hidden;
  }

  toast-message[data-position="top"].hide {
    transform: translate(-50%, calc(-100% - var(--toast-outer-spacing)));
  }

  toast-message[data-position="left"] {
    transform: translate(calc(-100% - var(--toast-outer-spacing)), -50%);
    visibility: hidden;
  }

  toast-message[data-position="left"].hide {
    transform: translate(calc(-100% - var(--toast-outer-spacing)), -50%);
  }

  toast-message[data-position="right"] {
    transform: translate(calc(100% + var(--toast-outer-spacing)), -50%);
    visibility: hidden;
  }

  toast-message[data-position="right"].hide {
    transform: translate(calc(100% + var(--toast-outer-spacing)), -50%);
  }

  toast-message[data-position="bottom"] {
    transform: translate(-50%, calc(100% + var(--toast-outer-spacing)));
    visibility: hidden;
  }

  toast-message[data-position="bottom"].hide {
    transform: translate(-50%, calc(100% + var(--toast-outer-spacing)));
  }

  toast-message[data-position="top-left"] {
    transform: translate(calc(-100% - var(--toast-outer-spacing)), calc(-100% - var(--toast-outer-spacing)));
    visibility: hidden;
  }

  toast-message[data-position="top-left"].hide {
    transform: translate(calc(-100% - var(--toast-outer-spacing)), calc(-100% - var(--toast-outer-spacing)));
  }

  toast-message[data-position="top-right"] {
    transform: translate(calc(100% + var(--toast-outer-spacing)), calc(-100% - var(--toast-outer-spacing)));
    visibility: hidden;
  }

  toast-message[data-position="top-right"].hide {
    transform: translate(calc(100% + var(--toast-outer-spacing)), calc(-100% - var(--toast-outer-spacing)));
  }

  toast-message[data-position="bottom-left"] {
    transform: translate(calc(-100% - var(--toast-outer-spacing)), calc(100% + var(--toast-outer-spacing)));
    visibility: hidden;
  }

  toast-message[data-position="bottom-left"].hide {
    transform: translate(calc(-100% - var(--toast-outer-spacing)), calc(100% + var(--toast-outer-spacing)));
  }

  toast-message[data-position="bottom-right"] {
    transform: translate(calc(100% + var(--toast-outer-spacing)), calc(100% + var(--toast-outer-spacing)));
    visibility: hidden;
  }

  toast-message[data-position="bottom-right"].hide {
    transform: translate(calc(100% + var(--toast-outer-spacing)), calc(100% + var(--toast-outer-spacing)));
  }

  toast-message[data-position="center"] {
    transform: translate(-50%, -50%) scale(0);
    visibility: hidden;
  }

  toast-message[data-position="center"].hide {
    transform: translate(-50%, -50%) scale(0);
  }

  toast-message.top {
    left: 50%;
    transform: translateX(-50%);
    top: var(--toast-outer-spacing);
    box-shadow: 0 -3px 7px var(--toast-shadow-color);
    visibility: visible;
  }

  toast-message.top-left {
    left: var(--toast-outer-spacing);
    top: var(--toast-outer-spacing);
    transform: translate(0, 0);
    box-shadow: -3px -3px 7px var(--toast-shadow-color);
    visibility: visible;
  }

  toast-message.top-right {
    right: var(--toast-outer-spacing);
    top: var(--toast-outer-spacing);
    transform: translate(0, 0);
    box-shadow: 3px -3px 7px var(--toast-shadow-color);
    visibility: visible;
  }

  toast-message.left {
    top: 50%;
    transform: translateY(-50%);
    left: var(--toast-outer-spacing);
    box-shadow: -3px 0 7px var(--toast-shadow-color);
    visibility: visible;
  }

  toast-message.right {
    right: var(--toast-outer-spacing);
    top: 50%;
    transform: translateY(-50%);
    box-shadow: 3px 0 7px var(--toast-shadow-color);
    visibility: visible;
  }

  toast-message.bottom-left {
    bottom: var(--toast-outer-spacing);
    left: var(--toast-outer-spacing);
    transform: translate(0, 0);
    box-shadow: -3px 3px 7px var(--toast-shadow-color);
    visibility: visible;
  }

  toast-message.bottom {
    bottom: var(--toast-outer-spacing);
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 3px 7px var(--toast-shadow-color);
    visibility: visible;
  }

  toast-message.bottom-right {
    bottom: var(--toast-outer-spacing);
    right: var(--toast-outer-spacing);
    transform: translate(0, 0);
    box-shadow: 3px 3px 7px var(--toast-shadow-color);
    visibility: visible;
  }

  toast-message.center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 7px var(--toast-shadow-color);
    visibility: visible;
  }

  toast-message button {
    appearance: button;
    -moz-appearance: button;
    -webkit-appearance: button;
    border: none;
    outline: none;
  }
`;


const toastStyles = document.createElement('style');
toastStyles.type = 'text/css';


if (toastStyles.styleSheet) {
  toastStyles.styleSheet.cssText = cssTxt;
} else {
  toastStyles.appendChild(document.createTextNode(cssTxt));
}
document.querySelector('head').appendChild(toastStyles);