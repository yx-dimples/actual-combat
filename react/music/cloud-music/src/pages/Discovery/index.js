import { Route, Routes, Navigate } from 'react-router-dom'
import Index from '../Index'
import DJ from '../DJ'
import Mine from '../Mine'
import TabBar from '../../components/TabBar'

function Discovery() {
  return (
    <div className='discovery'>

      <TabBar />

      <Routes>
        <Route path="*" element={<Navigate to="index" />}></Route>
        <Route path="index" element={<Index />} />
        <Route path="dj" element={<DJ />} />
        <Route path="mine" element={<Mine />} />
      </Routes>


    </div>
  )
}

export default Discovery