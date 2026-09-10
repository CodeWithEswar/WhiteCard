import { BrowserRouter } from 'react-router-dom'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { ThemeProvider } from './providers/theme-provider'
import { AuthProvider } from './features/auth/auth-provider'
import { AppRouter } from './app/router'
import { AppBootstrap } from './app/app-bootstrap'
import { queryClient } from './lib/query-client'
import {
  syncStoragePersister,
  QUERY_CACHE_MAX_AGE,
  QUERY_CACHE_BUSTER,
  persistDehydrateOptions,
} from './lib/query-persistence'

export default function App() {
  return (
    <ThemeProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: syncStoragePersister,
          maxAge: QUERY_CACHE_MAX_AGE,
          buster: QUERY_CACHE_BUSTER,
          dehydrateOptions: persistDehydrateOptions,
        }}
      >
        <BrowserRouter>
          <AuthProvider>
            <AppBootstrap>
              <AppRouter />
            </AppBootstrap>
          </AuthProvider>
        </BrowserRouter>
      </PersistQueryClientProvider>
    </ThemeProvider>
  )
}
