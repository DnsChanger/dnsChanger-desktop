import ReactDOM from 'react-dom/client'
import { App } from './app'
import './index.css'
import { ErrorBoundary } from './component/error-boundary/error-boundary.component'

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
	<ErrorBoundary>
		<App />
	</ErrorBoundary>,
)
