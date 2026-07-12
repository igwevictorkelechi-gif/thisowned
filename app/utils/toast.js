import Swal from "sweetalert2";

// Non-blocking toast for success/info feedback. Errors should still use
// regular Swal modals so the user can read what went wrong.
export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1400,
  timerProgressBar: true,
  background: "#141414",
  color: "#ffffff",
  iconColor: "#e02e21",
});

export const successToast = (title) => Toast.fire({ icon: "success", title });
