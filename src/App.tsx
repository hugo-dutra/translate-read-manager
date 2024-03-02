import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Definições de styled-components
const TextArea = styled.textarea``;
const Button = styled.button``;
const ProgressBar = styled.div<{ width: string }>`
  height: 20px;
  background-color: blue;
  width: ${({ width }) => width};
`;
const SegmentContainer = styled.div`
  position: relative;
`;

// Componente App
const App = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);

  // Função para iniciar o processo
  const handleStart = () => {
    setIsActive(true);
    setCurrentSegmentIndex(0); // Reinicia ao primeiro segmento
    setProgress(0); // Reinicia o progresso
  };

  useEffect(() => {
    if (!isActive || !jsonData) return;

    const segment = jsonData.segments[currentSegmentIndex];
    if (!segment) {
      setIsActive(false); // Se não houver mais segmentos, para o processo
      return;
    }

    // Calcula a duração do segmento atual em segundos
    const segmentDuration = segment.end - segment.start;
    const increment = 100 / (segmentDuration * 60); // Atualiza 60 vezes por segundo

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + increment;
        if (newProgress >= 100) {
          clearInterval(interval);
          setCurrentSegmentIndex((prevIndex) => prevIndex + 1); // Avança para o próximo segmento
          return 0; // Reinicia o progresso para o novo segmento
        }
        return newProgress;
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [isActive, jsonData, currentSegmentIndex]);

  // Função para carregar e parsear o JSON colado
  const handleLoadJson = (e:any) => {
    const data = JSON.parse(e.target.value);
    setJsonData(data);
  };

  return (
    <div>
      <TextArea onBlur={handleLoadJson} placeholder="Cole o JSON aqui" />
      <Button onClick={handleStart}>Iniciar Leitura</Button>
      {jsonData && jsonData.segments[currentSegmentIndex] && (
        <SegmentContainer>
          <ProgressBar width={`${progress}%`} />
          <p>Leia agora: {jsonData.segments[currentSegmentIndex].text}</p>
        </SegmentContainer>
      )}
    </div>
  );
};

export default App;
