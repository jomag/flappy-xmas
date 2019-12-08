import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import { relative } from "path";

const style = {
  root: {
    position: "absolute" as "absolute",
    left: 0,
    top: 0,
    width: "640px",
    height: "480px",
    background: "#000",
    overflow: "hidden"
  }
};

const BirdSprite = ({ top, left }: { top: number; left: number }) => {
  return (
    <div
      style={{
        top,
        left,
        position: "absolute" as "absolute",
        backgroundColor: "#ff0",
        width: "64px",
        height: "64px"
      }}
    />
  );
};

function useInterval(callback: Function, delay: number) {
  const savedCallback: MutableRefObject<Function | undefined> = useRef<
    Function
  >();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    const tick = () => {
      savedCallback && savedCallback.current && savedCallback.current();
    };
    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

const Obstacle = ({
  top,
  left,
  height,
  width,
  text
}: {
  top: number;
  left: number;
  height: number;
  width: number;
  text: string;
}) => {
  return (
    <div
      style={{
        top,
        left,
        width,
        height,
        background: "#f00",
        position: "absolute"
      }}
    >
      {text}
    </div>
  );
};

type ObstacleData = {
  offsetX: number;
  top: boolean;
  height: number;
};

export default () => {
  const canvasWidth = 640;
  const canvasHeight = 480;
  const gravity = 0.01;

  const [playerTop, setPlayerTop] = useState(16);
  const [playerLeft, setPlayerLeft] = useState(canvasWidth / 2 - 32 / 2);
  const [playerSpeedY, setPlayerSpeedY] = useState(0);
  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
  const [levelProgress, setLevelProgress] = useState(0);

  const generateLevel = (obstacleCount: number): ObstacleData[] => {
    const startOffset = 600;
    const distance = 128;
    const list: ObstacleData[] = [];
    for (let i = 0; i < obstacleCount; i++) {
      const n = Math.random() * 0.8 + 0.1;
      const topHeight = (canvasHeight - distance) * n;
      const bottomHeight = canvasHeight - topHeight - distance;
      list.push({
        offsetX: startOffset + i * 300,
        top: true,
        height: topHeight
      });
      list.push({
        offsetX: startOffset + i * 300,
        top: false,
        height: bottomHeight
      });
    }
    return list;
  };

  const animate = (ms: number) => {
    const newSpeed = playerSpeedY + gravity;
    setPlayerTop(playerTop + ms * newSpeed);
    setPlayerSpeedY(newSpeed);
    setLevelProgress(levelProgress + 1);
  };

  useEffect(() => {
    setObstacles(generateLevel(10));
  }, []);

  useInterval(() => animate(17), 17);

  const handleKeyEvent = (evt: any) => {
    if (evt.key === "w" || evt.key === "W") {
      setPlayerSpeedY(-0.3);
    }
  };

  return (
    <div style={style.root} tabIndex={0} onKeyDown={handleKeyEvent}>
      <BirdSprite top={playerTop} left={playerLeft} />
      {obstacles.map((o, idx) => (
        <Obstacle
          key={idx}
          left={o.offsetX - levelProgress}
          top={o.top ? 0 : canvasHeight - o.height}
          height={o.height}
          width={100}
          text={idx.toString()}
        />
      ))}
    </div>
  );
};
