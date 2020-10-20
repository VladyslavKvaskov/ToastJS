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
      this.onclose = null;
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
let toastCoords = {};
if (localStorage.getItem('toast-coords')) {
  toastCoords = JSON.parse(localStorage.getItem('toast-coords'));
}

class Toaster {
  constructor(config) {
    let canDragToast = false;
    this.timing = Number.isInteger(config.timing) ? parseInt(config.timing) : 5000;
    this.text = typeof config.text === 'string' ? config.text : '';
    this.html = typeof config.html === 'string' ? config.html : '';
    this.title = typeof config.title === 'string' ? config.title : '';
    this.titleIcon = typeof config.titleIcon === 'string' ? config.titleIcon : '';
    this.showTimer = config.showTimer === true ? true : false;
    this.interactive = config.interactive === true ? true : false;
    this.closeOnOutsideClick = config.closeOnOutsideClick === true ? true : false;
    this.showCloseBttn = config.showCloseBttn === true ? true : false;
    this.draggable = config.draggable === true ? true : false;
    this.showConfirmBttn = config.showConfirmBttn === true ? true : false;
    this.showDenyBttn = config.showDenyBttn === true ? true : false;
    this.showCancelBttn = config.showCancelBttn === true ? true : false;

    this.confirmBttnText = typeof config.confirmBttnText === 'string' ? config.confirmBttnText : '';
    this.denyBttnText = typeof config.denyBttnText === 'string' ? config.denyBttnText : '';
    this.cancelBttnText = typeof config.cancelBttnText === 'string' ? config.cancelBttnText : '';

    this.confirmBttnClick = typeof config.confirmBttnClick === 'function' ? config.confirmBttnClick : '';
    this.denyBttnClick = typeof config.denyBttnClick === 'function' ? config.denyBttnClick : '';
    this.cancelBttnClick = typeof config.cancelBttnClick === 'function' ? config.cancelBttnClick : '';

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

    this.showDuration = Number.isInteger(config.showDuration) ? parseInt(config.showDuration) : 500;
    this.hideDuration = Number.isInteger(config.hideDuration) ? parseInt(config.hideDuration) : 500;

    this.onOpen = (typeof config.onOpen === 'function') ? config.onOpen : '';
    this.onClose = (typeof config.onClose === 'function') ? config.onClose : '';

    this.createRipple = (e, toast_bttn) => {
      // const toastBttn = e.currentTarget;
      const toastRipple = document.createElement('span');
      const rippleDiameter = Math.max(toast_bttn.clientWidth, toast_bttn.clientHeight);
      const rippleRadius = rippleDiameter / 2;
      const toastBttnBounds = toast_bttn.getBoundingClientRect();
      toastRipple.style.width = toastRipple.style.height = `${rippleDiameter}px`;
      toastRipple.style.left = `${e.clientX - toastBttnBounds.x - rippleRadius}px`;
      toastRipple.style.top = `${e.clientY - toastBttnBounds.y - rippleRadius}px`;
      toastRipple.classList.add("ripple");
      toastRipple.addEventListener('animationend', () => {
        toastRipple.remove();
      });

      toast_bttn.appendChild(toastRipple);
    }


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
                ${this.showCloseBttn ? '<button type="button" class="close-bttn ripple" data-ripple-target=".top-bar"></button>' : ''}
              </div>
            </div>
          ` : ''}
        <div class="content scrollbar">
          <div class="toast-main">${this.html || this.text}</div>
          ${(this.showConfirmBttn || this.showDenyBttn || this.showCancelBttn) ? `
            <div class="action-bttns">
              ${this.showConfirmBttn ? `<button type="button" class="confirm-bttn act-bttn ripple">${this.confirmBttnText?this.confirmBttnText:'ok'}</button>` : ''}
              ${this.showDenyBttn ? `<button type="button" class="deny-bttn act-bttn ripple">${this.denyBttnText?this.denyBttnText:'no'}</button>` : ''}
              ${this.showCancelBttn ? `<button type="button" class="cancel-bttn act-bttn ripple">${this.cancelBttnText?this.cancelBttnText:'cancel'}</button>` : ''}
            </div>
            `: ''}
        </div>

        ${(this.showTimer && !this.interactive) ? `<div class="progress-wrapper"><div class="progress-bar" style="animation-duration: ${this.timing / 1000}s"></div></div>`:''}
      </div>
    `;

    if (toastCoords[this.position]) {
      toastMessage.style.transform = 'none';
      toastMessage.style.transitionDuration = `${this.showDuration / 1000}s`;
      toastMessage.style.top = `${toastCoords[this.position].y}px`;
      toastMessage.style.left = `${toastCoords[this.position].x}px`;
      toastMessage.style.right = 'auto';
      toastMessage.style.bottom = 'auto';
    }

    for (const toastBttn of toastMessage.querySelectorAll('.ripple')) {
      toastBttn.addEventListener('click', (e) => {
        if (toastBttn.dataset?.rippleTarget) {
          const rippleElement = toastMessage.querySelector(toastBttn.dataset.rippleTarget);
          if (rippleElement) {
            this.createRipple(e, rippleElement);
          }
        } else {
          this.createRipple(e, toastBttn);
        }
      });
    }

    if (this.confirmBttnClick) {
      const confirmBttn = toastMessage.querySelector('.confirm-bttn');
      if (confirmBttn) {
        confirmBttn.addEventListener('click', () => {
          this.confirmBttnClick(toastMessage);
        });
      }
    }

    if (this.denyBttnClick) {
      const denyBttn = toastMessage.querySelector('.deny-bttn');
      if (denyBttn) {
        denyBttn.addEventListener('click', () => {
          this.denyBttnClick(toastMessage);
        });
      }
    }

    if (this.cancelBttnClick) {
      const cancelBttn = toastMessage.querySelector('.cancel-bttn');
      if (cancelBttn) {
        cancelBttn.addEventListener('click', () => {
          this.cancelBttnClick(toastMessage);
        });
      }
    }

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

    if (this.draggable) {
      let toastShiftX;
      let toastShiftY;

      toastMessage.addEventListener('mousedown', (e) => {
        const toastContent = toastMessage.querySelector('.content');
        if (toastContent) {
          if (!e.target.closest('.content') && !e.target.closest('.close-bttn') && e.target.closest('toast-message') === toastMessage) {
            const toastBounds = toastMessage.getBoundingClientRect();
            toastShiftX = e.clientX - toastBounds.left;
            toastShiftY = e.clientY - toastBounds.top;

            console.log(toastShiftY);
            canDragToast = true;
          } else {
            canDragToast = false;
          }
          console.log(canDragToast);
        }

        // console.log(e.target);
        // let toastCoords = {
        //   x: e.clientX,
        //   y: e.clientY
        // };


      });

      document.addEventListener('mouseup', (e) => {
        canDragToast = false;
      });

      document.addEventListener('mousemove', (e) => {
        if (canDragToast) {
          toastMessage.style.transitionDuration = '0s';
          const toastBounds = toastMessage.getBoundingClientRect();
          toastMessage.style.transform = 'none';
          const toastY = e.pageY - toastShiftY;
          const toastX = e.pageX - toastShiftX;
          toastMessage.style.top = `${toastY}px`;
          toastMessage.style.left = `${toastX}px`;

          toastCoords[this.position] = {
            x: toastX,
            y: toastY
          };

          localStorage.setItem('toast-coords', JSON.stringify(toastCoords));
          toastMessage.style.right = 'auto';
          toastMessage.style.bottom = 'auto';
        }
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
    } else if ((typeof this.cssClass === 'string' || this.cssClass instanceof String) && this.cssClass !== '') {
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
      setTimeout(() => {
        toastMessage.onOutsideClick(() => {
          toastMessage.delete();
        });
      }, 50);
    }

  }
}

function removeAllToasts() {
  for (const toastMsg of document.querySelectorAll('toast-message')) {
    toastMsg.delete();
  }
}



const cssTxt = `
  body{
    margin: 0;
    padding: 0;
  }
  toast-message * {
    box-sizing: border-box;
  }

  toast-message {
    --toast-outer-spacing: 2vmax;
    --toast-body-font-size: 0.9vmax;
    --toast-body-font-size-sm: 0.7vmax;
    --toast-body-font-family: sans-serif;
    --toast-title-bg: #fff;
    --toast-success: #00C851;
    --toast-error: #ff4444;
    --toast-warning: #ffbb33;
    --toast-info: #33b5e5;
    --toast-default: #6c757d;
    --toast-primary: #303f9f;
    --toast-blue: #007bff;
    --toast-secondary: #999;
    --toast-padding: 1vmax;
    --toast-shadow-color: #6c757d;
    --toast-default-gradient: linear-gradient(40deg, rgba(162,188,212,1), rgba(108,117,125,1), rgba(108,117,125,1));
    --toast-success-gradient: linear-gradient(40deg, rgba(210,255,107,1), rgba(28,212,77,1), rgba(28,212,77,1));
    --toast-warning-gradient: linear-gradient(40deg, rgba(252,232,0,1), rgba(255,127,68,1), rgba(255,127,68,1));
    --toast-info-gradient: linear-gradient(40deg, #45cafc, #303f9f, #303f9f);
    --toast-error-gradient: linear-gradient(40deg, rgba(255,201,140,1), rgba(255,68,68,1),rgba(255,68,68,1));
    --z-index: 1000000;
  }



  @media (max-width: 1920px){
    toast-message {
      --toast-outer-spacing: 20px;
      --toast-body-font-size: 18px;
      --toast-body-font-size-sm: 15px;
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
    will-change: transform, top, right, left, bottom;
    padding: 5px;
    border-radius: 10px;
    background-size: 200% 200%;
    background-position: 0% 100%;
    background-repeat: no-repeat;
    opacity: 0;
  }

  toast-message[data-status="success"] {
    background-color: var(--toast-success);
    background-image: var(--toast-success-gradient);
  }

  toast-message[data-status="error"] {
    background-color: var(--toast-error);
    background-image: var(--toast-error-gradient);
  }

  toast-message[data-status="warning"] {
    background-color: var(--toast-warning);
    background-image: var(--toast-warning-gradient);
  }

  toast-message[data-status="info"] {
    background-color: var(--toast-info);
    background-image: var(--toast-info-gradient);
  }

  toast-message[data-status="default"] {
    background-color: var(--toast-default);
    background-image: var(--toast-default-gradient);
  }

  toast-message[data-status="success"] .title, toast-message[data-status="warning"] .title{
    color: #000;
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
    margin-left: 0.3vmax;
    border-radius: 50%;
  }

  toast-message .close-bttn::before, toast-message .close-bttn::after {
    content: '';
    position: absolute;
    min-width: 15px;
    width: 0.7vmax;
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
    background-color: var(--toast-error);
  }

  toast-message .close-bttn:hover, toast-message .close-bttn:focus{
    background-color: #fff;
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
    background-color: transparent;
    color: #fff;
    min-height: 21px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 0.3vmax 0;
    user-select: none;
    margin-bottom: 5px;
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
    height: fit-content;
    max-height: calc(100vh - calc(var(--toast-outer-spacing) * 4));
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: 10px;
  }

  toast-message .progress-wrapper{
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 5px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    background-color: rgba(255, 255, 255, 0.5);
    position: relative;
  }

  toast-message .progress-wrapper::before{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: -1px 1px 3px rgba(0, 0, 0, 0.7) inset;
    z-index: 10;
  }

  toast-message .progress-bar {
    background-color: #999;
    width: 100%;
    min-height: 10px;
    height: 0.3vmax;
    transform-origin: left;
    will-change: transform;
    animation-name: toast-message-progress-bar;
    animation-timing-function: linear;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    position: relative;
    border-radius: 10px;
  }

  toast-message .progress-bar::after{
    content: '';
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;

    background-image: linear-gradient(
      -45deg,
      rgba(255, 255, 255, .2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, .2) 50%,
      rgba(255, 255, 255, .2) 75%,
      transparent 75%,
      transparent
    );

    z-index: 1;
    background-size: 50px 50px;
    animation: toast-message-progress-bar-strips 1s linear infinite;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    overflow: hidden;
    height: 100%;
    width: 100%;
  }

  toast-message[data-status="success"] .progress-bar{
    background-color: var(--toast-success);
    background-image: var(--toast-success-gradient);
  }
  toast-message[data-status="error"] .progress-bar{
    background-color: var(--toast-error);
    background-image: var(--toast-error-gradient);
  }
  toast-message[data-status="info"] .progress-bar{
    background-color: var(--toast-info);
    background-image: var(--toast-info-gradient);
  }
  toast-message[data-status="warning"] .progress-bar{
    background-color: var(--toast-warning);
    background-image: var(--toast-warning-gradient);
  }
  toast-message[data-status="default"] .progress-bar{
    background-color: var(--toast-default);
    background-image: var(--toast-default-gradient);
  }

  toast-message[data-position="top"] {
    transform: translate(-50%, calc(-100% - var(--toast-outer-spacing)));
    visibility: hidden;
    opacity: 0;
  }

  toast-message[data-position="top"].hide {
    transform: translate(-50%, calc(-110% - var(--toast-outer-spacing)));
  }

  toast-message[data-position="left"] {
    transform: translate(calc(-100% - var(--toast-outer-spacing)), -50%);
    visibility: hidden;
    opacity: 0;
  }

  toast-message[data-position="left"].hide {
    transform: translate(calc(-110% - var(--toast-outer-spacing)), -50%);
  }

  toast-message[data-position="right"] {
    transform: translate(calc(100% + var(--toast-outer-spacing)), -50%);
    visibility: hidden;
    opacity: 0;
  }

  toast-message[data-position="right"].hide {
    transform: translate(calc(110% + var(--toast-outer-spacing)), -50%);
  }

  toast-message[data-position="bottom"] {
    transform: translate(-50%, calc(100% + var(--toast-outer-spacing)));
    visibility: hidden;
    opacity: 0;
  }

  toast-message[data-position="bottom"].hide {
    transform: translate(-50%, calc(110% + var(--toast-outer-spacing)));
  }

  toast-message[data-position="top-left"] {
    transform: translate(calc(-100% - var(--toast-outer-spacing)), calc(-100% - var(--toast-outer-spacing)));
    visibility: hidden;
    opacity: 0;
  }

  toast-message[data-position="top-left"].hide {
    transform: translate(calc(-110% - var(--toast-outer-spacing)), calc(-100% - var(--toast-outer-spacing)));
  }

  toast-message[data-position="top-right"] {
    transform: translate(calc(100% + var(--toast-outer-spacing)), calc(-100% - var(--toast-outer-spacing)));
    visibility: hidden;
    opacity: 0;
  }

  toast-message[data-position="top-right"].hide {
    transform: translate(calc(110% + var(--toast-outer-spacing)), calc(-100% - var(--toast-outer-spacing)));
  }

  toast-message[data-position="bottom-left"] {
    transform: translate(calc(-100% - var(--toast-outer-spacing)), calc(100% + var(--toast-outer-spacing)));
    visibility: hidden;
    opacity: 0;
  }

  toast-message[data-position="bottom-left"].hide {
    transform: translate(calc(-110% - var(--toast-outer-spacing)), calc(100% + var(--toast-outer-spacing)));
  }

  toast-message[data-position="bottom-right"] {
    transform: translate(calc(100% + var(--toast-outer-spacing)), calc(100% + var(--toast-outer-spacing)));
    visibility: hidden;
    opacity: 0;
  }

  toast-message[data-position="bottom-right"].hide {
    transform: translate(calc(110% + var(--toast-outer-spacing)), calc(100% + var(--toast-outer-spacing)));
  }

  toast-message[data-position="center"] {
    transform: translate(-50%, -50%) scale(0);
    visibility: hidden;
    opacity: 0;
  }

  toast-message[data-position="center"].hide {
    transform: translate(-50%, -50%) scale(0);
  }

  toast-message.hide {
    opacity: 0 !important;
  }

  toast-message.top {
    left: 50%;
    transform: translateX(-50%);
    top: var(--toast-outer-spacing);
    visibility: visible;
    opacity: 1;
  }

  toast-message.top-left {
    left: var(--toast-outer-spacing);
    top: var(--toast-outer-spacing);
    transform: translate(0, 0);
    visibility: visible;
    opacity: 1;
  }

  toast-message.top-right {
    right: var(--toast-outer-spacing);
    top: var(--toast-outer-spacing);
    transform: translate(0, 0);
    visibility: visible;
    opacity: 1;
  }

  toast-message.left {
    top: 50%;
    transform: translateY(-50%);
    left: var(--toast-outer-spacing);
    visibility: visible;
    opacity: 1;
  }

  toast-message.right {
    right: var(--toast-outer-spacing);
    top: 50%;
    transform: translateY(-50%);
    visibility: visible;
    opacity: 1;
  }

  toast-message.bottom-left {
    bottom: var(--toast-outer-spacing);
    left: var(--toast-outer-spacing);
    transform: translate(0, 0);
    visibility: visible;
    opacity: 1;
  }

  toast-message.bottom {
    bottom: var(--toast-outer-spacing);
    left: 50%;
    transform: translateX(-50%);
    visibility: visible;
    opacity: 1;
  }

  toast-message.bottom-right {
    bottom: var(--toast-outer-spacing);
    right: var(--toast-outer-spacing);
    transform: translate(0, 0);
    visibility: visible;
    opacity: 1;
  }

  toast-message.center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    visibility: visible;
    opacity: 1;
  }

  toast-message button[type="button"] {
    appearance: button;
    -moz-appearance: button;
    -webkit-appearance: button;
    border: none;
    outline: none;
    cursor: pointer;
    transition: 0.3s;
    user-select: none;
    overflow: hidden;
    position: relative;
  }

  toast-message span.ripple {
    position: absolute; /* The absolute position we mentioned earlier */
    border-radius: 50%;
    transform: scale(0);
    animation: toast-message-ripple 600ms linear;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 300;
  }

  toast-message .confirm-bttn{
    background-color: var(--toast-primary);
    background-image: var(--toast-info-gradient);
    border-bottom: 0.1vmax solid var(--toast-primary) !important;
  }

  toast-message .deny-bttn{
    background-color: var(--toast-error);
    background-image: var(--toast-error-gradient);
    border-bottom: 0.1vmax solid var(--toast-error) !important;
  }

  toast-message .cancel-bttn{
    background-color: var(--toast-secondary);
    background-image: var(--toast-default-gradient);
    border-bottom: 0.1vmax solid var(--toast-default) !important;
  }

  toast-message .act-bttn{
    border-radius: 5px;
    padding: 5px;
    color: #fff;
    margin: 0.1vmax;
    text-align: center;
    min-width: 48px;
    background-size: 200% 200%;
    background-position: 0 100%;
  }



  toast-message .act-bttn:hover, toast-message .act-bttn:focus{
    background-position: 10% 50%;
  }

  toast-message .act-bttn:active{
    background-position: 100% 0;
  }

  toast-message .scrollbar::-webkit-scrollbar{
    width: 0.3vmax;
    height: 0.3vmax;
  }

  @media (max-width: 1920px){
    toast-message .act-bttn{
      margin: 3px;
    }
    toast-message .scrollbar::-webkit-scrollbar{
      width: 3px;
      height: 3px;
    }
  }

  toast-message .scrollbar::-webkit-scrollbar-thumb{
    background-color: var(--toast-default);
  }

  toast-message[data-status="success"] .scrollbar::-webkit-scrollbar-thumb{
    background-color: var(--toast-success);
    background-image: var(--toast-success-gradient);
  }

  toast-message[data-status="error"] .scrollbar::-webkit-scrollbar-thumb{
    background-color: var(--toast-error);
    background-image: var(--toast-error-gradient);
  }

  toast-message[data-status="warning"] .scrollbar::-webkit-scrollbar-thumb{
    background-color: var(--toast-warning);
    background-image: var(--toast-warning-gradient);
  }

  toast-message[data-status="info"] .scrollbar::-webkit-scrollbar-thumb{
    background-color: var(--toast-info);
    background-image: var(--toast-info-gradient);
  }

  toast-message[data-status="default"] .scrollbar::-webkit-scrollbar-thumb{
    background-color: var(--toast-default);
    background-image: var(--toast-default-gradient);
  }

  toast-message .action-bttns{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    margin: 1vmax 0 0 0;
  }

  @keyframes toast-message-progress-bar {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(-100%);
    }
  }

  @keyframes toast-message-progress-bar-strips {
    0% {
      background-position: 0 0;
    }

    100% {
      background-position: 50px 50px;
    }
  }

  @keyframes toast-message-ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
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