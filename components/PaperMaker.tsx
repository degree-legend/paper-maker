"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const PaperMaker = () => {
  const worker = useRef<Worker>(null);
  const [result, setResult] = useState<any>(null);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("../lib/worker.js", import.meta.url),
        {
          type: "module",
        },
      );
    }

    const onMessageReceived = (message: any) => {
      console.log({ message });
      switch (message.data.status) {
        case "initiate":
          setLoading(true);
          break;
        case "progress":
          setProgress(message.data.progress);
          setLoading(true);
          break;
        case "ready":
          setLoading(true);
          break;
        case "complete":
          setResult(message.data.output[0]);
          setLoading(false);
          break;
      }
    };

    worker.current.addEventListener("message", onMessageReceived);

    return () => {
      if (worker.current) {
        worker.current.removeEventListener("message", onMessageReceived);
      }
    };
  });

  const translation = useCallback((text: string) => {
    if (worker.current) {
      worker.current.postMessage({ text });
    }
  }, []);

  const handleBtnClick = () => {
    setLoading(true);
    translation(userInput);
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="md:w-2xl">
          <h1 className="text-5xl font-bold">论文复读机</h1>
          <p className="py-6">
            上知天文，下知地理。本科到博士都在用它。是复读机中的豪杰。
            <br />
            <strong>隐私保护，完全本地计算。</strong>
            <br />
          </p>
          <div className="flex flex-col gap-4">
            <textarea
              placeholder="请输入要转换的论文语句，如：分布式计算是使多台计算机协同工作以解决共同问题的方法。"
              className="textarea w-full textarea-primary"
              rows={10}
              onChange={(e) => setUserInput(e.target.value)}
            ></textarea>
            <div className="flex flex-col gap-1">
              <button
                className="btn btn-primary"
                disabled={loading}
                onClick={handleBtnClick}
              >
                {loading ? "请稍后..." : "转换"}
              </button>
              <em>
                第一次运行需要下载模型权重，可能需要一些时间，但后续调用将快得多。
              </em>
              {progress > 0 && progress < 100 && (
                <progress
                  className="progress"
                  value={progress}
                  max="100"
                ></progress>
              )}
            </div>
            {result && (
              <div className="mockup-code w-full text-left text-wrap">
                <p className="px-4">{result.translation_text}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperMaker;
