import { useState } from 'react'
import Dashboard from './components/Dashboard/Dashboard'
import Upload from './components/Upload/Upload'
import {  Routes, Route } from "react-router-dom"

function App() {
  return (
    <div >
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tool/:tool" element={<Upload />} />
      </Routes>
    </div>
  )
}

export default App
