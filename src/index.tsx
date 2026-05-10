import { createRoot } from 'react-dom/client';
import App from './app';
import enableApiMocks from './api/provider/enable-api-mocks';
import QueryClientAppProvider from './api/provider/query-client-provider';

async function bootstrap() {
	await enableApiMocks();
	const root = createRoot(document.getElementById('root')!);
	root.render(
		<QueryClientAppProvider>
			<App />
		</QueryClientAppProvider>
	);
}

bootstrap();
