import { h } from 'preact'
import { Route, Router } from 'preact-router'
import Home from '../routes/home'

const App = () =>
  <div id="app">
    <Router>
      <Route path="/" component={Home} />
    </Router>
  </div>

export default App
