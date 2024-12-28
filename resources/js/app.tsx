import '../css/app.css';
import './bootstrap';

import {createInertiaApp} from '@inertiajs/react';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {StrictMode} from "react";
import {Provider} from "react-redux";
import {store} from "@/Stores/store";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob('./Pages/**/*.tsx'),
    ),
  setup({el, App, props}) {
    if (import.meta.env.SSR) {
      hydrateRoot(el, <App {...props} />);
      return;
    }

    createRoot(el).render(
      <StrictMode>
        <Provider store={store}>
          <App {...props} />
        </Provider>
      </StrictMode>
    );
  },
  progress: {
    color: '#03045e',
  },
});
