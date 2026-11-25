'use client'

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as loadCocoSSD } from "@tensorflow-models/coco-ssd";
import { useDispatch } from "react-redux";
import { renderPredictions } from "@/utils/render-prediction";

export default function ObjectDetection() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionInProgress = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let isActive = true;
    let intervalId;
    let model;

    async function startDetection() {
      try {
        model = await loadCocoSSD();

        if (!isActive) return;
        setIsLoading(false);

        intervalId = window.setInterval(async () => {
          const video = webcamRef.current?.video;
          const canvas = canvasRef.current;

          if (
            !isActive ||
            detectionInProgress.current ||
            !video ||
            video.readyState !== 4 ||
            !canvas
          ) {
            return;
          }

          detectionInProgress.current = true;

          try {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const predictions = await model.detect(video, undefined, 0.6);
            if (isActive) {
              const context = canvas.getContext("2d");
              if (context) renderPredictions(predictions, context, dispatch);
            }
          } catch {
            if (isActive) {
              setError("Item detection stopped unexpectedly. Please refresh and try again.");
            }
          } finally {
            detectionInProgress.current = false;
          }
        }, 250);
      } catch {
        if (isActive) {
          setError("The object-detection model could not be loaded. Check your connection and refresh the page.");
          setIsLoading(false);
        }
      }
    }

    startDetection();

    return () => {
      isActive = false;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [dispatch]);

  if (error) {
    return (
      <div role="alert" className="p-4 text-center text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-gray-200">
      {isLoading ? (
        <p className="text-center text-sm font-medium text-slate-700">
          Loading item-recognition model…
        </p>
      ) : (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={false}
            className="h-full w-full object-cover"
            videoConstraints={{ facingMode: { ideal: "environment" } }}
            onUserMediaError={() => setError("Camera access is unavailable. Allow camera permission in your browser and refresh.")}
          />
          <canvas
            ref={canvasRef}
            aria-label="Live item detection results"
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
        </>
      )}
    </div>
  );
}
