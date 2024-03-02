import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Componentes styled
const TextArea = styled.textarea`
  width: 100%;
  margin-bottom: 20px;
`;

const Button = styled.button`
  margin-bottom: 20px;
`;

const ReadingContainer = styled.div`
  position: relative;
  text-align: left;
`;

const ProgressBar = styled.div<{ width: string }>`
  width: ${({ width }) => width};
  background-color: blue;
  height: 100%;
  position: absolute;
  z-index: -1;
`;

const SegmentText = styled.p`
  position: relative;
  z-index: 1;
`;

const CounterLabel = styled.label`
  display: block;
  margin-top: 20px;
`;

const App = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [currentSegment, setCurrentSegment] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleLoadJson = (jsonString: any) => {
    const data = JSON.parse(jsonString);
    setJsonData(data);
  };

  const handleStart = () => {
    setIsActive(true);
    setCounter(0);
    setProgress(0);
  };

  useEffect(() => {
    let interval: any = null;

    if (isActive) {
      interval = setInterval(() => {
        const now = counter;
        const segmentToShow = jsonData?.segments.find((segment: any) =>
          now >= segment.start && now <= segment.end
        );

        if (segmentToShow) {
          setCurrentSegment(segmentToShow);
          const segmentDuration = segmentToShow.end - segmentToShow.start;
          const elapsedTime = now - segmentToShow.start;
          const progressPercentage = (elapsedTime / segmentDuration) * 100;
          setProgress(progressPercentage);
        }

        setCounter((counter) => counter + 1);
      }, 1000);
    } else if (!isActive && counter !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, counter, jsonData]);

  return (
    <div>
      <TextArea onBlur={(e) => handleLoadJson(e.target.value)} placeholder="Cole o JSON aqui" />
      <Button onClick={handleStart}>Iniciar Leitura</Button>
      <div>
        {currentSegment && (
          <ReadingContainer>
            <ProgressBar width={`${progress}%`} />
            <SegmentText>Leia agora: {currentSegment.text}</SegmentText>
            <p>ID do Segmento: {currentSegment.id}</p>
          </ReadingContainer>
        )}
      </div>
      <CounterLabel>Contador: {counter} segundos</CounterLabel>
    </div>
  );
};

export default App;
