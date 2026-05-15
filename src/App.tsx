import Router from "../components/Router";

export default function App() {
  const speed = 0.8;
  const lineCount = 8;
  const amplitude = 0.12;
  const yOffset = 0.15;
  const opacity = 0.6;


  return (
    <Router
      speed={speed}
      lineCount={lineCount}
      amplitude={amplitude}
      yOffset={yOffset}
      opacity={opacity}
    />
  );
}
