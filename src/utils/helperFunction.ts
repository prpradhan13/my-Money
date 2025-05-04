import Toast from "react-native-toast-message";

export const errorToast = (errorMessage: string) => {
    Toast.show({
      type: "error",
      text1: errorMessage,
      position: "bottom",
    });
  };
  
  export const successToast = (successMessage: string) => {
    Toast.show({
      type: "success",
      text1: successMessage,
      position: "bottom",
    });
  };
  
  export const infoToast = (infoMessage: string) => {
    Toast.show({
      type: "info",
      text1: infoMessage,
      position: "bottom",
    });
  };