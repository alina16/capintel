import './App.css';
import { Chart } from './features/chart/Chart';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const StyledTypography = styled(Typography)(({ theme }) => ({
  textTransform: 'uppercase',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(4), 
}));

function App() {
  return (
    <div className="App">
      <Container maxWidth="sm">
        <StyledTypography variant="h4" gutterBottom>
          Capintel challenge
        </StyledTypography>  
        <Chart />
      </Container>
    </div>
  );
}

export default App;
