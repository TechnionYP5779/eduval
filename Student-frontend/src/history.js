import createHistory from 'history/createBrowserHistory'

export default createHistory({
  forceRefresh: true
})

export const historyNoRefresh = createHistory({
  forceRefresh: false
})
