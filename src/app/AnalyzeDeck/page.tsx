"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

  const variantClasses = {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    destructive:
      "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
    outline:
      "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  }[variant];

  const sizeClasses = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  }[size];

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    />
  );
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card: React.FC<CardProps> = ({ className, ...props }) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
);

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader: React.FC<CardHeaderProps> = ({ className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
);

interface CardTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardTitle: React.FC<CardTitleProps> = ({ className, ...props }) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
);

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription: React.FC<CardDescriptionProps> = ({
  className,
  ...props
}) => <p className={`text-sm text-muted-foreground ${className}`} {...props} />;

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent: React.FC<CardContentProps> = ({ className, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

interface AnalysisResult {
  marketSize: string;
  productSummary: string;
  teamOverview: string;
  tractionSummary: string;
  redFlags?: string[];
  [key: string]: any;
}

interface ApiResponse {
  success: boolean;
  analysis?: AnalysisResult;
  error?: string;
  debug?: {
    rawResponse: string;
    cleanedResponse: string;
  };
  metadata?: {
    textExtracted: number;
    timestamp: string;
  };
}

const AnalyseDeckPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setSelectedFile(file);
        setError(null);
        setDebugInfo(null); // Clear previous debug info
      } else {
        setSelectedFile(null);
        setError("Please upload a PDF or DOCX file.");
      }
    } else {
      setSelectedFile(null);
      setError(null);
      setDebugInfo(null);
    }
  };

  const handleAnalyseClick = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a pitch deck to analyze.");
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    setDebugInfo(null);

    const formData = new FormData();
    formData.append("pitchDeck", selectedFile);

    try {
      const response = await fetch("/api/DeckAnalyzer", {
        method: "POST",
        body: formData,
      });

      const data: ApiResponse = await response.json();

      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        // Handle different types of errors
        if (data.debug) {
          setDebugInfo(data.debug);
          setError(`Analysis failed: ${data.error}. Debug information available.`);
        } else {
          setError(data.error || "Analysis failed for unknown reason.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Network error occurred while analyzing the document.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
      <motion.div
        className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 md:p-8 lg:p-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-4">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            AI-Powered Pitch Deck Analyzer
          </motion.span>
        </h1>
        <p className="text-md sm:text-lg text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload your startup pitch deck (PDF or DOCX) to get instant AI-powered
          insights on key metrics, market size, product, team, traction, and
          potential red flags.
        </p>

        {/* Upload Section */}
        <Card className="mb-10 p-6 md:p-8 bg-blue-50 border-blue-200">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl sm:text-2xl text-blue-800 text-center">
              Upload Your Pitch Deck
            </CardTitle>
            <CardDescription className="text-center text-blue-600">
              Securely upload your file for analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 p-0">
            <label
              htmlFor="pitchDeckUpload"
              className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 rounded-lg px-6 py-3 text-lg font-semibold shadow-md inline-flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span>{selectedFile ? "Change File" : "Choose File"}</span>
            </label>
            <Input
              id="pitchDeckUpload"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="sr-only"
            />
            {selectedFile && (
              <motion.p
                className="text-gray-700 text-sm md:text-base font-medium"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Selected:{" "}
                <span className="font-semibold text-blue-800">
                  {selectedFile.name}
                </span>
              </motion.p>
            )}

            {error && (
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-red-600 text-sm text-center font-medium bg-red-50 border border-red-200 rounded-lg p-3">
                  {error}
                </div>
                
                {/* Debug Information Toggle */}
                {debugInfo && (
                  <details className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      Show Debug Information
                    </summary>
                    <div className="mt-3 space-y-2 text-xs">
                      <div>
                        <strong>Raw AI Response:</strong>
                        <pre className="mt-1 bg-white border rounded p-2 overflow-x-auto text-gray-600">
                          {debugInfo.rawResponse}
                        </pre>
                      </div>
                      <div>
                        <strong>Cleaned Response:</strong>
                        <pre className="mt-1 bg-white border rounded p-2 overflow-x-auto text-gray-600">
                          {debugInfo.cleanedResponse}
                        </pre>
                      </div>
                    </div>
                  </details>
                )}
              </motion.div>
            )}

            <Button
              onClick={handleAnalyseClick}
              disabled={!selectedFile || isLoading}
              className="bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors duration-200 px-8 py-3 text-lg font-bold shadow-lg mt-4 w-full sm:w-auto"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing...
                </div>
              ) : (
                "Analyze Pitch Deck"
              )}
            </Button>
          </CardContent>
        </Card>

        {analysisResult && (
          <motion.div
            className="mt-10 pt-8 border-t border-gray-200"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
              Analysis Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(analysisResult).map(([key, value]) => {
                if (key === "redFlags" && Array.isArray(value)) {
                  return (
                    <motion.div key={key} variants={itemVariants}>
                      <Card className="bg-red-50 border-red-200">
                        <CardHeader>
                          <CardTitle className="text-xl text-red-700">
                            Red Flags
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside text-red-800 text-base">
                            {value.length > 0 ? (
                              value.map((flag, index) => (
                                <li key={index}>{flag}</li>
                              ))
                            ) : (
                              <li>No significant red flags identified.</li>
                            )}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                }

                if (typeof value === "string") {
                  const title = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());
                  return (
                    <motion.div key={key} variants={itemVariants}>
                      <Card className="bg-white border-blue-100">
                        <CardHeader>
                          <CardTitle className="text-xl text-blue-700">
                            {title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-800 text-base leading-relaxed">
                            {value}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                }
                return null;
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AnalyseDeckPage;
