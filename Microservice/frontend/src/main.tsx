// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
	// <StrictMode>
	<Provider store={store}>
		<BrowserRouter>
			<Toaster />
			<App />
		</BrowserRouter>
	</Provider>
	// </StrictMode>
);
