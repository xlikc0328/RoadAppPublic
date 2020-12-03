export const setStore = (keyword, content) => {
    if(!keyword) return;
    localStorage.setItem(keyword,JSON.stringify(content))
  }
export const getStore = keyword => {
    if (!keyword) return;
    return JSON.parse(localStorage.getItem(keyword))
  }
export const removeStore = keyword => {
    if (!keyword) return;
    localStorage.removeItem(keyword)
  }