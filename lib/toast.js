/**
 * @file toast.js
 * @license MIT
 * @license_url https://github.com/VladyslavKvaskov/ToastJS/blob/main/LICENSE
 * @copyright Vlad Kvaskov 2020
 */

class Toast extends HTMLElement {
  constructor() {
    super();
    this.onclose = null;
    this.hideDuration = 500;
  }

  delete() {
    if (typeof this.onclose === 'function') {
      this.onclose();
    }
    this.style.transitionDuration = `${this.hideDuration / 1000}s`;
    // const toastProgressBar = this.querySelector('.progress-bar');
    // if (toastProgressBar) {
    //   toastProgressBar.style.animationDuration = `${(this.hideDuration - 2000) / 1000}s`;
    // }

    this.classList.add('hide');



    setTimeout(() => {
      this.remove();
    }, 1000 + this.hideDuration);
  }


  onOutsideClick(callback) {
    document.addEventListener('click', (e) => {
      if (e.target.closest(`toast-message`) !== this) {
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

    this.showDuration = (parseInt(config.showDuration)) ? config.showDuration : 500;
    this.hideDuration = (parseInt(config.hideDuration)) ? config.hideDuration : 500;

    this.onOpen = (typeof config.onOpen === 'function') ? config.onOpen : '';
    this.onClose = (typeof config.onClose === 'function') ? config.onClose : '';


    const toastMessage = document.createElement('toast-message');

    toastMessage.style.transitionDuration = `${this.showDuration / 1000}s`;

    toastMessage.hideDuration = this.hideDuration;

    toastMessage.innerHTML = `
      <div class="wrapper">
        ${(this.title || this.titleIcon || this.showCloseBttn) ? `
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
    --toast-outer-spacing: 2vmax;
    --toast-body-font-size: 0.9vmax;
    --toast-body-font-family: sans-serif;
    --toast-title-bg: #fff;
    --toast-success: #00C851;
    --toast-error: #ff4444;
    --toast-warning: #ffbb33;
    --toast-info: #33b5e5;
    --toast-default: #6c757d;
    --toast-padding: 1vmax;
    --toast-shadow-color: #6c757d;
    --z-index: 1000000;
  }

  @media (max-width: 1920px){
    toast-message {
      --toast-outer-spacing: 20px;
      --toast-body-font-size: 18px;
      --toast-padding: 20px;
    }
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
    border: 1px solid #999;
  }

  toast-message[data-status="success"]{
    border: 1px solid var(--toast-success);
  }
  toast-message[data-status="error"]{
    border: 1px solid var(--toast-error);
  }
  toast-message[data-status="info"]{
    border: 1px solid var(--toast-info);
  }
  toast-message[data-status="warning"]{
    border: 1px solid var(--toast-warning);
  }
  toast-message[data-status="default"]{
    border: 1px solid var(--toast-default);
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
    color: #fff;
  }


  toast-message .close-bttn {
    min-width: 25px;
    min-height: 25px;
    width: 1vmax;
    height: 1vmax;
    background-color: transparent;
    position: relative;
    transition: 0.3s;
    cursor: pointer;
  }

  toast-message .close-bttn::before, toast-message .close-bttn::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 0.1vmax;
    min-height: 2px;
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
    min-width: 25px;
    min-height: 25px;
    width: 1vmax;
    height: 1vmax;
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
    padding: 0.3vmax;
    user-select: none;
  }

  toast-message .title-and-icon {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }

  toast-message .toast-title {
    padding-left: 0.3vmax;
  }

  toast-message .content {
    padding: var(--toast-padding);
    font-family: var(--toast-body-font-family);
    background-color: #fff;
  }

  toast-message .progress-bar {
    background-color: #999;
    width: 100%;
    min-height: 3px;
    height: 0.3vmax;
    transform-origin: left;
    animation-name: toast-message-progress-bar;
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  toast-message[data-status="success"] .progress-bar{
    background-color: var(--toast-success);
  }
  toast-message[data-status="error"] .progress-bar{
    background-color: var(--toast-error);
  }
  toast-message[data-status="info"] .progress-bar{
    background-color: var(--toast-info);
  }
  toast-message[data-status="warning"] .progress-bar{
    background-color: var(--toast-warning);
  }
  toast-message[data-status="default"] .progress-bar{
    background-color: var(--toast-default);
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
    transform: translate(-50%, calc(-110% - var(--toast-outer-spacing)));
  }

  toast-message[data-position="left"] {
    transform: translate(calc(-100% - var(--toast-outer-spacing)), -50%);
    visibility: hidden;
  }

  toast-message[data-position="left"].hide {
    transform: translate(calc(-110% - var(--toast-outer-spacing)), -50%);
  }

  toast-message[data-position="right"] {
    transform: translate(calc(100% + var(--toast-outer-spacing)), -50%);
    visibility: hidden;
  }

  toast-message[data-position="right"].hide {
    transform: translate(calc(110% + var(--toast-outer-spacing)), -50%);
  }

  toast-message[data-position="bottom"] {
    transform: translate(-50%, calc(100% + var(--toast-outer-spacing)));
    visibility: hidden;
  }

  toast-message[data-position="bottom"].hide {
    transform: translate(-50%, calc(110% + var(--toast-outer-spacing)));
  }

  toast-message[data-position="top-left"] {
    transform: translate(calc(-100% - var(--toast-outer-spacing)), calc(-100% - var(--toast-outer-spacing)));
    visibility: hidden;
  }

  toast-message[data-position="top-left"].hide {
    transform: translate(calc(-110% - var(--toast-outer-spacing)), calc(-100% - var(--toast-outer-spacing)));
  }

  toast-message[data-position="top-right"] {
    transform: translate(calc(100% + var(--toast-outer-spacing)), calc(-100% - var(--toast-outer-spacing)));
    visibility: hidden;
  }

  toast-message[data-position="top-right"].hide {
    transform: translate(calc(110% + var(--toast-outer-spacing)), calc(-100% - var(--toast-outer-spacing)));
  }

  toast-message[data-position="bottom-left"] {
    transform: translate(calc(-100% - var(--toast-outer-spacing)), calc(100% + var(--toast-outer-spacing)));
    visibility: hidden;
  }

  toast-message[data-position="bottom-left"].hide {
    transform: translate(calc(-110% - var(--toast-outer-spacing)), calc(100% + var(--toast-outer-spacing)));
  }

  toast-message[data-position="bottom-right"] {
    transform: translate(calc(100% + var(--toast-outer-spacing)), calc(100% + var(--toast-outer-spacing)));
    visibility: hidden;
  }

  toast-message[data-position="bottom-right"].hide {
    transform: translate(calc(110% + var(--toast-outer-spacing)), calc(100% + var(--toast-outer-spacing)));
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
    visibility: visible;
  }

  toast-message.top-left {
    left: var(--toast-outer-spacing);
    top: var(--toast-outer-spacing);
    transform: translate(0, 0);
    visibility: visible;
  }

  toast-message.top-right {
    right: var(--toast-outer-spacing);
    top: var(--toast-outer-spacing);
    transform: translate(0, 0);
    visibility: visible;
  }

  toast-message.left {
    top: 50%;
    transform: translateY(-50%);
    left: var(--toast-outer-spacing);
    visibility: visible;
  }

  toast-message.right {
    right: var(--toast-outer-spacing);
    top: 50%;
    transform: translateY(-50%);
    visibility: visible;
  }

  toast-message.bottom-left {
    bottom: var(--toast-outer-spacing);
    left: var(--toast-outer-spacing);
    transform: translate(0, 0);
    visibility: visible;
  }

  toast-message.bottom {
    bottom: var(--toast-outer-spacing);
    left: 50%;
    transform: translateX(-50%);
    visibility: visible;
  }

  toast-message.bottom-right {
    bottom: var(--toast-outer-spacing);
    right: var(--toast-outer-spacing);
    transform: translate(0, 0);
    visibility: visible;
  }

  toast-message.center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    visibility: visible;
  }

  toast-message .close-bttn {
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