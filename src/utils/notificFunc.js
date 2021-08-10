const notific = ({ dispatch, message, error, type }) => {
  const notification = {
    message: message || error,
    type: type ? 'success' : 'error',
  }
  dispatch('notification/setNotification', notification, {
    root: true,
  })
  dispatch('notification/showNotification', true, {
    root: true,
  })
}

export default notific
