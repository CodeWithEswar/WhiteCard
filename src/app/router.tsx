import { Navigate, Route, Routes } from 'react-router-dom'
import { LandingPage } from '../features/landing/pages/landing-page'
import { AppShell } from '../components/layout/app-shell'
import { DashboardPage } from '../pages/DashboardPage'
import { GovernmentDocsPage } from '../pages/GovernmentDocsPage'
import { StudentCertsPage } from '../pages/StudentCertsPage'
import { SearchPage } from '../pages/SearchPage'
import { RecentDocsPage } from '../pages/RecentDocsPage'
import { ExpiringDocsPage } from '../pages/ExpiringDocsPage'
import { DocumentDetailPage } from '../pages/DocumentDetailPage'
import { StorageBreakdownPage } from '../pages/StorageBreakdownPage'
import { SettingsPage } from '../pages/SettingsPage'
import { LoginPage } from '../features/auth/pages/login-page'
import { SignupPage } from '../features/auth/pages/signup-page'
import { AuthCallbackPage } from '../features/auth/pages/auth-callback-page'
import { PublicSharePage } from '../pages/PublicSharePage'
import { PrivacyPage } from '../features/legal/pages/privacy-page'
import { TermsPage } from '../features/legal/pages/terms-page'
import { ProtectedRoute } from '../features/auth/components/protected-route'
import { PublicOnlyRoute } from '../features/auth/components/public-only-route'

export function AppRouter() {
  return (
    <Routes>
      {/* 1. Public Landing & Informational */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* 2. Public-Only Authentication Routes (no-flash, redirect if already authed) */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />
      </Route>

      {/* OAuth Callback Completion */}
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* 3. Cryptographically Protected Public Share View (no app shell, no private nav) */}
      <Route path="/share/:token" element={<PublicSharePage />} />

      {/* 4. Authenticated & Protected Vault App Spaces */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppShell />}>
          {/* Vault Home / Overview */}
          <Route index element={<DashboardPage />} />

          {/* Government Documents Space & Sub-categories */}
          <Route path="government" element={<GovernmentDocsPage />} />
          <Route path="government/all" element={<Navigate to="/app/government" replace />} />
          <Route path="government/passports" element={<Navigate to="/app/government?category=passport" replace />} />
          <Route path="government/vehicle" element={<Navigate to="/app/government?category=vehicle" replace />} />

          {/* Student Certificates Space & Sub-categories */}
          <Route path="student" element={<StudentCertsPage />} />
          <Route path="student/all" element={<Navigate to="/app/student" replace />} />
          <Route path="student/degrees" element={<Navigate to="/app/student?category=degree" replace />} />
          <Route path="student/transcripts" element={<Navigate to="/app/student?category=transcript" replace />} />

          {/* Cross-space Search, Recent, and Expiring Views */}
          <Route path="search" element={<SearchPage />} />
          <Route path="recent" element={<RecentDocsPage />} />
          <Route path="expiring" element={<ExpiringDocsPage />} />

          {/* Document Detail / Preview */}
          <Route path="document/:documentId" element={<DocumentDetailPage />} />
          <Route path="documents/:id" element={<DocumentDetailPage />} />

          {/* Storage Observatory Breakdown */}
          <Route path="storage" element={<StorageBreakdownPage />} />

          {/* User Profile & Themes Settings */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 5. Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
