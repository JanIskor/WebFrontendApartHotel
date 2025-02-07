import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "store/store.ts";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename={"/frontend"}>
        <Provider store={store} >
            <App />
        </Provider>
    </BrowserRouter>
)

if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker
			.register('../public/serviceWorker.js')
			.then(() => console.log('service worker registered'))
			.catch(err => console.log('service worker not registered', err))
	})
}
