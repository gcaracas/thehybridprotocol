export const splitPadding = ()=>{
     const addPaddingLeft = () => {
      const paddingLeftElement = document.getElementById("paddingLeft");
      const paddingLeftContainerElement = document.getElementById("paddingLeftContainer");
      if (paddingLeftElement && paddingLeftContainerElement) {
        paddingLeftElement.style.paddingLeft = `${
          (window.innerWidth - paddingLeftContainerElement.offsetWidth) / 2
        }px`;
      }
    };
    const addPaddingRight = () => {
      const paddingRightElement = document.getElementById("paddingRight");
      const paddingRightContainerElement = document.getElementById("paddingRightContainer");
      if (paddingRightElement && paddingRightContainerElement) {
        paddingRightElement.style.paddingRight = `${
          (window.innerWidth - paddingRightContainerElement.offsetWidth) / 2
        }px`;
      }
    };
    addPaddingLeft();
    addPaddingRight();
    window.addEventListener("resize", addPaddingLeft);
    window.addEventListener("resize", addPaddingRight);
}