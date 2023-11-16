export function Debounce(func, delay) {
    let timerId;
    
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => func(...args), delay);
    };
  }