import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/shared/Layout'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import Dashboard from '@/pages/Dashboard'
import Configuration from '@/pages/Configuration'
import BusinessMetrics from '@/pages/BusinessMetrics'
import NotFound from '@/pages/NotFound'

function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="config" element={<Configuration />} />
                        <Route path="metrics" element={<BusinessMetrics />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    )
}

export default App
