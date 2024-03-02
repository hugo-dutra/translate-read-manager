import React, { useEffect, useState } from 'react';
import { TextField, Button, CssBaseline, ThemeProvider, createTheme, Box, LinearProgress } from '@mui/material';

// Criar um tema escuro
const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App: React.FC = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  const handleLoadJson = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const data = JSON.parse(event.target.value);
    setJsonData(data);
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setCurrentSegmentIndex(0);
    setProgress(0);
    setOverallProgress(0);
    setTimeElapsed(0);
  };

  const togglePauseResume = () => {
    setIsPaused(!isPaused);
  };

  // Primeiro useEffect para gerenciar pausa/resumo e atualização do tempo transcorrido
  useEffect(() => {
    let interval: any;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  // Segundo useEffect atualizado para gerenciar o progresso do segmento e o progresso geral
  useEffect(() => {
    if (!isActive || !jsonData?.segments || isPaused) return;

    // Calcula o progresso com base no tempo total transcorrido e na duração total
    const totalTime = jsonData.segments.reduce((acc: number, segment: any) => acc + (segment.end - segment.start), 0);
    const currentProgress = (timeElapsed + 1) / totalTime * 100;
    setOverallProgress(currentProgress);

    // Atualiza o índice do segmento atual com base no tempo transcorrido
    let timeSum = 0;
    let newIndex = 0;
    for (let i = 0; i < jsonData.segments.length; i++) {
      timeSum += jsonData.segments[i].end - jsonData.segments[i].start;
      if (timeElapsed + 1 <= timeSum) {
        newIndex = i;
        break;
      }
    }
    setCurrentSegmentIndex(newIndex);

    // Calcula o progresso dentro do segmento atual
    const segmentTimeElapsed = timeElapsed + 1 - (timeSum - (jsonData.segments[newIndex].end - jsonData.segments[newIndex].start));
    const segmentProgress = (segmentTimeElapsed / (jsonData.segments[newIndex].end - jsonData.segments[newIndex].start)) * 100;
    setProgress(segmentProgress);

  }, [isActive, isPaused, timeElapsed, jsonData]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <TextField
          fullWidth
          label="Cole o JSON aqui"
          multiline
          rows={4}
          onBlur={(event: React.FocusEvent<HTMLTextAreaElement>) => handleLoadJson(event)}
          variant="outlined"
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleStart} sx={{ mr: 1 }}>
          Iniciar Leitura
        </Button>
        <Button variant="contained" color="secondary" onClick={togglePauseResume}>
          {isPaused ? 'Retomar' : 'Pausar'}
        </Button>
        {jsonData && jsonData.segments[currentSegmentIndex] && (
          <Box sx={{ mt: 2, mb: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Box sx={{ mt: 2, textAlign: 'justify', width: '200%' }}>
              {jsonData.segments[currentSegmentIndex].text}
            </Box>

          </Box>
        )}
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={overallProgress} color="secondary" />
          <Box sx={{ mt: 1 }}>{timeElapsed} segundos</Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
