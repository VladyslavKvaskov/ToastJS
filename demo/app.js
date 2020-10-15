let textArr = ['Hi there!', 'What\'s up?', 'How are you?', 'Cool toasts!!!'];
let statusArr = ['success',
  'info',
  'warning',
  'error',
  'default'
]
let positionArr = [
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
  new Toaster({
    icon: 'success',
    status: statusArr[getRndInteger(0, 5)],
    title: 'title',
    // text: textArr[getRndInteger(0, 3)],
    html: '<div class="open"></div>',
    timing: getRndInteger(3000, 15000),
    position: positionArr[getRndInteger(0, 9)],
    cssClass: ['newtoast1', 'newtoast2'],
    titleIcon: 'https://static.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico',
    showTimer: true,
    interactive: false,
    closeOnOutsideClick: false,
    showCloseBttn: true,
    onOpen: (toastMessage) => {
      toastMessage.querySelector('.open').innerText = textArr[getRndInteger(0, 3)];
    },
    onClose: (toastMessage) => {
      toastMessage.querySelector('.open').innerText = 'Goodbye!';
    }
  });
  setTimeout(() => {
    showToaster();
  }, getRndInteger(3000, 15000));
}

showToaster();
showToaster();

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}