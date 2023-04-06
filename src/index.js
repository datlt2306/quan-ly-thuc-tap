import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from './app/store';
import persistor from './app/store';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

ReactDOM.render(
	<React.StrictMode>
		<GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>
					<PersistGate loading={null} persistor={persistor}>
						<BrowserRouter>
							<App />
						</BrowserRouter>
					</PersistGate>
				</QueryClientProvider>
			</Provider>
		</GoogleOAuthProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
