import { useState } from 'react'
import DashboardMain from './components/Dashboard_main/DashboardMain'
import Upload from './components/Upload/Upload'
import {  Routes, Route } from "react-router-dom"

function App() {
  return (
    <div >
      <Routes>
        <Route path="/" element={<DashboardMain />} />
        <Route path="/tool/:tool" element={<Upload />} />
      </Routes>
    </div>
  )
}

export default App
