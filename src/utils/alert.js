import Swal from "sweetalert2";

export const showSuccess = (msg) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: msg,
    confirmButtonColor: "#3085d6",
  });
};

export const showError = (msg) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: msg,
    confirmButtonColor: "#d33",
  });
};

export const showWarning = (msg) => {
  Swal.fire({
    icon: "warning",
    title: "Warning",
    text: msg,
  });
};

export const showConfirm = async (msg) => {
  return Swal.fire({
    title: msg,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });
};