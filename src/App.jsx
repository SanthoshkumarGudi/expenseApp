import { AppRouter } from './routes/router';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Box } from '@mui/material';
import {AuthProvider} from './context/AuthContext'


function App() {
  return (
    <>
    <AuthProvider>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        {/* Navbar will now be inside Router via AppRouter */}
        <AppRouter />
       
      </Box>
    </AuthProvider>
    
      
     
     
     

    

    </>
  )
}

export default App;