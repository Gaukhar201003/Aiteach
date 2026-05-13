/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { LessonPlanGenerator } from './pages/LessonPlanGenerator';
import { TaskGenerator } from './pages/TaskGenerator';
import { PromptBuilder } from './pages/PromptBuilder';
import { PromptLibrary } from './pages/PromptLibrary';
import { Theory } from './pages/Theory';
import { PracticalTasks } from './pages/PracticalTasks';
import { MyDocuments } from './pages/MyDocuments';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/generator" element={<LessonPlanGenerator />} />
            <Route path="/task-generator" element={<TaskGenerator />} />
            <Route path="/prompt-builder" element={<PromptBuilder />} />
            <Route path="/prompt-library" element={<PromptLibrary />} />
            <Route path="/theory" element={<Theory />} />
            <Route path="/practice" element={<PracticalTasks />} />
            <Route path="/documents" element={<MyDocuments />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

