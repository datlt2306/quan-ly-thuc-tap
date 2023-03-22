import 'antd/dist/antd.css';
import './App.css';
import { renderRoutes, routerData } from './Routes/router';
import { BrowserRouter, Routes } from 'react-router-dom';
import { Suspense } from 'react';

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Suspense fallback={<div>Loading ...</div>}>
					<Routes>{renderRoutes(routerData)}</Routes>
				</Suspense>
			</BrowserRouter>
		</div>
	);
}

export default App;
