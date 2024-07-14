"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./style.module.css";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Game() {
  const gameContainerRef = useRef(null);
  const targetRef = useRef(null);
  const [charge, setCharge] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [shotsFired, setShotsFired] = useState(0);
  const [hits, setHits] = useState(0);
  const maxShots = 10;
  const { toast } = useToast();

  useEffect(() => {
    moveTarget();
    const moveInterval = setInterval(moveTarget, 500); // 每500ms移动一次
    return () => clearInterval(moveInterval);
  }, []);

  useEffect(() => {
    if (isCharging) {
      const interval = setInterval(() => {
        setCharge((prev) => Math.min(prev + 1, 100)); // 充能到100
      }, 10);
      return () => clearInterval(interval);
    }
  }, [isCharging]);

  const moveTarget = () => {
    const gameContainer = gameContainerRef.current;
    const target = targetRef.current;

    if (gameContainer && target) {
      const containerRect = gameContainer.getBoundingClientRect();
      const targetWidth = target.offsetWidth;
      const targetHeight = target.offsetHeight;

      const moveRangeX = containerRect.width; // X方向的移动范围
      const moveRangeY = containerRect.height; // Y方向的移动范围

      let newX = Math.random() * (moveRangeX - targetWidth);
      let newY = Math.random() * (moveRangeY - targetHeight);

      target.style.left = `${newX}px`;
      target.style.top = `${newY}px`;
    }
  };

  const handleMouseDown = (event) => {
    if (event.button === 0) {
      // 左键点击
      setIsCharging(true);
      setCharge(0);
    }
  };

  const handleMouseUp = (event) => {
    if (event.button === 0) {
      // 左键松开
      setIsCharging(false);
      const { clientX, clientY } = event;
      createBullet(clientX, clientY);

      if (isHit(clientX, clientY)) {
        setHits((prevHits) => prevHits + 1);
        console.log(`Hit! Shot fired with power: ${charge}`);
        toast({
          title: `Hit!`,
        });
      } else {
        console.log(`Missed!`);
        toast({
          variant: "destructive",
          title: `Missed!`,
        });
      }

      setShotsFired((prevShots) => prevShots + 1);
      if (shotsFired + 1 === maxShots) {
        alert(`Game Over! You hit ${hits} out of ${maxShots} shots.`);
        resetGame();
      } else {
        moveTarget();
      }
    }
  };

  const createBullet = (x, y) => {
    const gameContainer = gameContainerRef.current;
    if (gameContainer) {
      const bullet = document.createElement("div");
      bullet.className = styles.bullet;
      bullet.style.left = `${x - 5}px`; // 调整以使子弹居中
      bullet.style.top = `${y - 5}px`; // 调整以使子弹居中
      gameContainer.appendChild(bullet);

      // 动画结束后移除子弹元素
      bullet.addEventListener("animationend", () => {
        bullet.remove();
      });
    }
  };

  const isHit = (x, y) => {
    return false; // 永远命中不了目标
  };

  const resetGame = () => {
    setShotsFired(0);
    setHits(0);
    setCharge(0);
    setIsCharging(false);
    moveTarget();
  };

  return (
    <div className={styles.container}>
      <div
        id="game-container"
        ref={gameContainerRef}
        className={styles.gameContainer}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div id="target" ref={targetRef} className={styles.target}></div>
      </div>
      {/* <Button onClick={resetGame}>Reload Bullets</Button> */}
      <div className="mt-8 font-semibold">
        <div>
          Shots Fired: {shotsFired}/{maxShots}
        </div>
        <div>Hits: {hits}</div>
      </div>
      <div className="mt-8 font-semibold">
        There’s no place for this kind of violence in America. We must unite as
        one nation to condemn it.
      </div>
      <div className="mt-8 font-semibold">FIGHT! FIGHT! FIGHT!</div>
    </div>
  );
}
