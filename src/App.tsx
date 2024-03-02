import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled components
const TextArea = styled.textarea`
  width: 100%;
  margin-bottom: 20px;
`;

const Button = styled.button`
  margin-bottom: 20px;
`;

const ProgressBar = styled.div<{ width: any }>`
  height: 20px;
  background-color: blue;
  width: ${({ width }) => width};
`;

const OverallProgress = styled.div<{ width: any }>`
  height: 20px;
  background-color: red;
  width: ${({ width }) => width};
  margin-top: 20px; // Espaçamento entre a barra de progresso do segmento e a geral
`;

const SegmentContainer = styled.div`
  position: relative;
  text-align: justify;
  text-align-last: justify;
  &:after {
    content: '';
    display: inline-block;
    width: 100%;
  }
`;

const App: React.FC = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<any>(0);
  const [isActive, setIsActive] = useState<any>(false);
  const [progress, setProgress] = useState<any>('0%');
  const [overallProgress, setOverallProgress] = useState<any>('0%');

  const handleLoadJson = (event: any) => {
    const data = JSON.parse(event.target.value);
    setJsonData(data);
  };

  const handleStart = () => {
    setIsActive(true);
    setCurrentSegmentIndex(0); // Reset to first segment
    setProgress('0%');
    setOverallProgress('0%'); // Reset overall progress
  };

  useEffect(() => {
    if (!isActive || !jsonData?.segments) return;

    const segment = jsonData.segments[currentSegmentIndex];
    if (!segment) {
      setIsActive(false); // If no more segments, stop the process
      return;
    }

    const segmentDuration = segment.end - segment.start;
    const increment = 100 / (segmentDuration * 60); // Update 60 times per second for smooth progression

    const interval = setInterval(() => {
      setProgress((prevProgress: any) => {
        const newProgress = parseFloat(prevProgress) + increment;
        if (newProgress >= 100) {
          clearInterval(interval);
          setCurrentSegmentIndex((prevIndex: any) => prevIndex + 1); // Move to next segment
          return '0%'; // Reset progress for the new segment
        }
        return `${newProgress}%`;
      });
    }, 1000 / 60);

    // Update overall progress
    const overallIncrement = 100 / jsonData.segments.length;
    setOverallProgress(`${Math.min((currentSegmentIndex + 1) * overallIncrement, 100)}%`);

    return () => clearInterval(interval);
  }, [isActive, jsonData, currentSegmentIndex, progress]);

  return (
    <div>
      <TextArea onBlur={handleLoadJson} placeholder="Cole o JSON aqui" />
      <Button onClick={handleStart}>Iniciar Leitura</Button>
      {jsonData && jsonData.segments[currentSegmentIndex] && (
        <SegmentContainer>
          <ProgressBar width={progress} />
          <p>{jsonData.segments[currentSegmentIndex].text}</p>
        </SegmentContainer>
      )}
      <OverallProgress width={overallProgress} />
    </div>
  );
};

export default App;
