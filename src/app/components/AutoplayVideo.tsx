'use client';
import React from 'react';
import { useRef } from 'react';

interface AutoplayVideoProps {
  src: string;
  classname?: string;
}

{
  /* <AutoplayVideo
       src= "maszAssets/masz-africa-logo-animation.mp4"
       classname=''
      /> */
}

function AutoplayVideo({ src, classname = '' }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play();
  };

  return (
    <div className={classname}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        controls={false}
        onMouseEnter={handleMouseEnter}
        onEnded={() => {
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }}
      />
    </div>
  );
}

export default AutoplayVideo;
