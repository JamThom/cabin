import { createRoot } from 'react-dom/client';
import App from './app';
import QueryClientAppProvider from './api/provider/query-client-provider';

const root = createRoot(document.getElementById('root')!);
root.render(
	<QueryClientAppProvider>
		<App />
	</QueryClientAppProvider>
);
