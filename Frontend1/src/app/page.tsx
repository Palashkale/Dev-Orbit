"use client";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_UPLOAD_URL = "http://localhost:3000";

export default function DeployPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [uploadId, setUploadId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const createStars = () => {
      const starBackground = document.querySelector(".star-background");
      if (!starBackground) return;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const starCount = Math.floor((screenWidth * screenHeight) / 1000);

      starBackground.innerHTML = "";

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        starBackground.appendChild(star);
      }
    };

    createStars();
    window.addEventListener("resize", createStars);

    return () => {
      window.removeEventListener("resize", createStars);
    };
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900 opacity-50" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMyMjIiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20" />
      <div className="star-background absolute inset-0 overflow-hidden" />
      <div className="w-full max-w-md perspective-1000 relative z-10">
        <Card className="w-full bg-gray-900 bg-opacity-50 border-gray-700 shadow-2xl backdrop-blur-sm transform transition-all duration-500 ease-out hover:scale-105 hover:rotate-y-5">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Deploy your GitHub Repository
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter the URL of your GitHub repository to deploy it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github-url" className="text-gray-300">
                  GitHub Repository URL
                </Label>
                <Input
                  id="github-url"
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button
                onClick={async () => {
                  setUploading(true);
                  const res = await axios.post(`${BACKEND_UPLOAD_URL}/deploy`, {
                    repoUrl: repoUrl,
                  });
                  setUploadId(res.data.id);
                  setUploading(false);
                  const interval = setInterval(async () => {
                    const response = await axios.get(
                      `${BACKEND_UPLOAD_URL}/status?id=${res.data.id}`,
                    );

                    if (response.data.status === "deployed") {
                      clearInterval(interval);
                      setDeployed(true);
                    }
                  }, 3000);
                }}
                disabled={uploadId !== "" || uploading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition-all duration-500 ease-out hover:scale-105"
                type="submit"
              >
                {uploadId
                  ? `Deploying (${uploadId})`
                  : uploading
                    ? "Uploading..."
                    : "Upload"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {deployed && (
        <div className="w-full max-w-md mt-8 perspective-1000 relative z-10">
          <Card className="w-full bg-gray-900 bg-opacity-50 border-gray-700 shadow-2xl backdrop-blur-sm transform transition-all duration-500 ease-out hover:scale-105 hover:rotate-y-5">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Deployment Status
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your website is successfully deployed!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="deployed-url" className="text-gray-300">
                    Deployed URL
                  </Label>
                  {copied && <span className="text-green-500">Copied!</span>}
                </div>
                <div className="flex space-x-2">
                  <Input
                    id="deployed-url"
                    readOnly
                    type="url"
                    value={`http://${uploadId}.bakastaa.com:3001/index.html`}
                    className="bg-gray-800 border-gray-600 text-white flex-1"
                  />
                  <Button
                    onClick={() =>
                      handleCopy(
                        `http://${uploadId}.bakastaa.com:3001/index.html`,
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-full"
                  >
                    Copy
                  </Button>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition-all duration-500 ease-out hover:scale-105"
                  variant="outline"
                >
                  <a
                    href={`http://${uploadId}.bakastaa.com:3001/index.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                  >
                    Visit Website
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
