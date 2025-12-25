import {
  Box,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress
} from '@mui/material';
import './App.css'
import { useState } from 'react'
import axios from 'axios';

function App() {

const [emailContent, setEmailContent] = useState('');
const [tone, setTone] = useState('');
const [generatedReply, setGeneratedReply] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () =>{
    setLoading(true);
    try{
      const response = await axios.post("http://localhost:8081/api/email/generate",{
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ?
        response.data : JSON.stringify(response.data)
      );
    }catch(error){

    }finally{
      setLoading(false);
    }
};

  return (
    <>
      <Container maxWidth="md" sx={{py:4}}>
        <Typography variant='h3' component="h1" gutterBottom>
          Email Reply Generator
        </Typography>

        <Box sx={{mx: 3}}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            label="Original Email Content"
            value={emailContent || ''}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{mb:2}}
          />

        <FormControl fullWidth sx={{mb:2}}>
  <InputLabel>Tone(Optional)</InputLabel>
  <Select
    value={tone || ""}
    label="Tone (Optional)"
    onChange={(e)=> setTone(e.target.value)}
  >
    <MenuItem value="None"><em>None</em></MenuItem>
    <MenuItem value="Professional">Professional</MenuItem>
    <MenuItem value="Casual">Casual</MenuItem>
    <MenuItem value="Friendly">Friendly</MenuItem>
  </Select>
</FormControl>


<Button sx={{mb:2}}
  variant="contained"
  onClick={handleSubmit}
  disabled={!emailContent.trim() || loading}
>
  {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Reply"}
</Button>
        </Box>


        <Box sx={{mx: 3}}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            value={generatedReply || ''}
           inputProps={{readOnly: true}}
            sx={{mb:2}}
          />

          <Button 
          variant='outlined'
          onClick={() => navigator.clipboard.writeText(generatedReply)
}
          > copy to clipboard  </Button>

          </Box>


      </Container>
    </>
  )
}

export default App
