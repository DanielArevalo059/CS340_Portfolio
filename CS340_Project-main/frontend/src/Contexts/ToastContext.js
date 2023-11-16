import { createContext } from "react";

/**  @type {{success: (msg: string) => void, failure: (msg: string) => void}} */ 
const defaultValue = {}

export const ToastContext = createContext(defaultValue);