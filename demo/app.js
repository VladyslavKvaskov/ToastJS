const textArr = ['Hi there!', 'What\'s up?', 'How are you?', 'Cool toasts!!!'];
const statusArr = ['success',
  'info',
  'warning',
  'error',
  'default'
]
const positionArr = [
  'left',
  'right',
  'bottom',
  'center',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'top'
]

function showToaster() {
  const toastPosition = positionArr[getRndInteger(0, 9)];
  let toastElement = null;
  toastElement = new Toaster({
    status: statusArr[getRndInteger(0, 5)],
    title: 'ToastJS',
    // text: textArr[getRndInteger(0, 3)],
    html: `<div class="open"></div>`,
    timing: getRndInteger(3000, 15000),
    showDuration: 700,
    hideDuration: 1000,
    position: toastPosition,
    cssClass: ['newtoast1', 'newtoast2'],
    titleIcon: 'https://static.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico',
    showTimer: true,
    interactive: true,
    showCloseBttn: true,
    showConfirmBttn: true,
    showDenyBttn: true,
    showCancelBttn: true,
    confirmBttnText: 'Confirm',
    denyBttnText: 'Deny',
    cancelBttnText: 'Cancel',
    draggable: true,
    showResetBttn: true,
    confirmBttnClick: (toast) => {
      new Toaster({
        text: 'You\'ve confirmed the prompt',
        timing: 5000,
        showTimer: true,
        status: 'info',
        position: toastPosition,
        closeOnOutsideClick: true
      });

      toast.delete();
    },
    denyBttnClick: (toast) => {
      new Toaster({
        text: 'You\'ve denied the prompt.',
        timing: 5000,
        showTimer: true,
        status: 'error',
        position: toastPosition,
        closeOnOutsideClick: true
      });

      toast.delete();
    },
    cancelBttnClick: (toast) => {
      new Toaster({
        text: 'You\'ve cancelled the prompt.',
        timing: 5000,
        showTimer: true,
        position: toastPosition,
        closeOnOutsideClick: true
      });

      toast.delete();
    },
    onOpen: (toast) => {
      toast.querySelector('.open').innerHTML = textArr[getRndInteger(0, 3)];
      toast.addEventListener('click', () => {
        console.log(123);
      });
    },
    onClose: (toast) => {
      // showToaster();
    }
  }).getToastElement();

  toastElement.addEventListener('drag-toast', (e) => {
    console.log('drag');
  });

  toastElement.addEventListener('remove', (e) => {
    setTimeout(() => {
      toastElement.restore();
    }, 3000);
  });
}

showToaster();


function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}