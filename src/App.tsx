import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/shared/Layout'
import Dashboard from '@/pages/Dashboard'
import Configuration from '@/pages/Configuration'
import BusinessMetrics from '@/pages/BusinessMetrics'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="config" element={<Configuration />} />
                    <Route path="metrics" element={<BusinessMetrics />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
