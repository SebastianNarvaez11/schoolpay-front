import Swal from 'sweetalert2'

export const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export const ToastDelete = (msg) => Swal.mixin({
    text: msg,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText:'Cancelar',
    confirmButtonText: 'Sí, eliminalo!'
})

export const ToastConfirmPay = (msg) => Swal.mixin({
    text: msg,
    icon: 'success',
    showConfirmButton: true,
})

export const ToastErrorPay = (msg) => Swal.mixin({
    text: msg,
    icon: 'error',
    showConfirmButton: true,
})

export const ToastPendingPay = (msg) => Swal.mixin({
    text: msg,
    icon: 'warning',
    showConfirmButton: true,
})

export const ToastConfirmSendSms = (msg) => Swal.mixin({
    text: msg,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText:'Cancelar',
    confirmButtonText: 'Sí, envialos'
})
