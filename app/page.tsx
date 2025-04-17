"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import { useDropzone } from "react-dropzone"
import { FiUpload, FiFileText, FiSettings, FiCopy, FiTrash2, FiZap } from "react-icons/fi"
import { FaGithub, FaLinkedin, FaTwitter, FaMoon, FaSun, FaCheck, FaChevronRight, FaBrain } from "react-icons/fa"
import { MdHistory } from "react-icons/md"
import { IoMdClose } from "react-icons/io"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [showEntryModal, setShowEntryModal] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [wordCount, setWordCount] = useState<number>(0)
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [sentences, setSentences] = useState<string[]>([])
  const [history, setHistory] = useState<{ timestamp: string; sentences: string[]; params: any }[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const uploadSectionRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  // Settings
  const [numStates, setNumStates] = useState(3)
  const [iterations, setIterations] = useState(100)
  const [usePOSTags, setUsePOSTags] = useState(false)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false)
      setShowEntryModal(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/plain": [".txt"],
      "text/csv": [".csv"],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      setFile(file)

      // Count words in the file
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const words = text.split(/\s+/).filter((word) => word.length > 0)
        setWordCount(words.length)
      }
      reader.readAsText(file)

      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for training`,
      })
    },
  })

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const trainModel = () => {
    if (!file) return

    setIsTraining(true)
    setProgress(0)

    // Simulate training progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsTraining(false)

          // Generate mock sentences
          const newSentences = [
            "The quick brown fox jumps over the lazy dog.",
            "A stitch in time saves nine.",
            "All that glitters is not gold.",
            "Actions speak louder than words.",
            "Beauty is in the eye of the beholder.",
          ]

          setSentences(newSentences)

          // Add to history
          const now = new Date()
          setHistory((prev) => [
            {
              timestamp: now.toLocaleString(),
              sentences: newSentences,
              params: {
                states: numStates,
                iterations: iterations,
                usePOSTags: usePOSTags,
              },
            },
            ...prev,
          ])

          toast({
            title: "Model trained successfully",
            description: "Generated 5 new sentences",
          })

          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)

    toast({
      title: "Copied to clipboard",
      description: "Sentence has been copied to your clipboard",
    })

    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const deleteSentence = (index: number) => {
    setSentences((prev) => prev.filter((_, i) => i !== index))

    toast({
      title: "Sentence deleted",
      description: "The sentence has been removed",
    })
  }

  const removeFile = () => {
    setFile(null)
    setWordCount(0)

    toast({
      title: "File removed",
      description: "Upload a new file to continue",
    })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-100 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl px-4">
          <div className="space-y-8">
            {/* Hero skeleton */}
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-3/4 mx-auto bg-gray-800/50" />
              <Skeleton className="h-6 w-2/3 mx-auto bg-gray-800/50" />
              <Skeleton className="h-10 w-40 mx-auto bg-gray-800/50 rounded-full" />
            </div>

            {/* Upload section skeleton */}
            <Skeleton className="h-64 w-full bg-gray-800/50 rounded-xl" />

            {/* Output section skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-48 bg-gray-800/50" />
              <div className="space-y-3">
                <Skeleton className="h-20 w-full bg-gray-800/50 rounded-lg" />
                <Skeleton className="h-20 w-full bg-gray-800/50 rounded-lg" />
                <Skeleton className="h-20 w-full bg-gray-800/50 rounded-lg" />
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block relative">
              <div className="h-10 w-10 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-400 animate-pulse">Loading HMM Sentence Generator...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Entry Confirmation Modal */}
      <Dialog open={showEntryModal} onOpenChange={setShowEntryModal}>
        <DialogContent className="sm:max-w-md bg-gray-900/95 border-gray-800 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Welcome to the HMM Sentence Generator
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              This site uses AI to train on your uploaded text and generate new sentences.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-md bg-purple-500/10 border border-purple-500/20 text-sm">
            <h4 className="font-medium text-purple-400 mb-1">About Hidden Markov Models</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              HMMs are statistical models that assume a process to be a Markov process with hidden states. They're
              particularly useful for sequence modeling tasks like natural language generation.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 hover:text-gray-100"
              onClick={() => window.close()}
            >
              <IoMdClose className="mr-2 h-4 w-4" />
              Exit
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={() => setShowEntryModal(false)}
            >
              Continue
              <FaChevronRight className="ml-2 h-3 w-3" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Theme Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-300 dark:border-gray-700"
          >
            {theme === "dark" ? (
              <FaSun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
            ) : (
              <FaMoon className="h-[1.2rem] w-[1.2rem] text-gray-700" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 dark:bg-purple-600/20 rounded-full filter blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-10 right-10 w-72 h-72 bg-pink-600/10 dark:bg-pink-600/20 rounded-full filter blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          <div className="container relative z-10 mx-auto px-4 pt-32 pb-20 md:pt-40 md:pb-32 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block mb-4 px-4 py-1 rounded-full bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-700"
              >
                <div className="flex items-center space-x-2">
                  <FaBrain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Powered by Hidden Markov Models
                  </span>
                </div>
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:via-pink-500 dark:to-red-500">
                HMM Sentence Generator
              </h1>

              <div className="h-16 md:h-20 mb-8">
                <TypeAnimation
                  sequence={[
                    "Generating grammatically plausible sentences using AI and probability",
                    2000,
                    "Creating natural language patterns from your text data",
                    2000,
                    "Transforming text into new content with statistical models",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Number.POSITIVE_INFINITY}
                  className="text-xl md:text-2xl text-gray-700 dark:text-gray-300"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={scrollToUpload}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 text-lg"
                >
                  Upload Text File <FaChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              {/* File Upload Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
                ref={uploadSectionRef}
                id="upload-section"
              >
                <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-xl overflow-hidden">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <FiUpload className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                      Upload Training Data
                    </h2>

                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
                        isDragActive
                          ? "border-purple-500 bg-purple-500/5 dark:bg-purple-500/10"
                          : "border-gray-300 dark:border-gray-600 hover:border-purple-500 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <FiFileText className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                      {isDragActive ? (
                        <p className="text-purple-600 dark:text-purple-400">Drop the file here...</p>
                      ) : (
                        <div>
                          <p className="mb-2">Drag & drop a text file here, or click to select</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Accepts .txt or .csv files</p>
                        </div>
                      )}
                    </div>

                    {file && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-gray-100/80 dark:bg-gray-700/50 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-start space-x-3">
                          <FiFileText className="h-5 w-5 mt-1 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                          <div className="overflow-hidden">
                            <p className="truncate font-medium">{file.name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs bg-gray-200/50 dark:bg-gray-800/50">
                                {(file.size / 1024).toFixed(2)} KB
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-gray-200/50 dark:bg-gray-800/50">
                                {wordCount} words
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeFile()
                                }}
                                className="h-8 w-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove file</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Train Model Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-xl overflow-hidden">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <FiZap className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                      Train Model
                    </h2>

                    {isTraining ? (
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Training in progress...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress
                          value={progress}
                          className="h-2 bg-gray-200 dark:bg-gray-700"
                        />

                        <div className="space-y-3 py-2">
                          {progress < 30 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                              Tokenizing input text...
                            </p>
                          )}
                          {progress >= 30 && progress < 60 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                              Building Hidden Markov Model...
                            </p>
                          )}
                          {progress >= 60 && progress < 90 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                              Training state transitions...
                            </p>
                          )}
                          {progress >= 90 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                              Generating sentences...
                            </p>
                          )}

                          <div className="grid grid-cols-4 gap-2">
                            <Skeleton className="h-8 bg-gray-200/80 dark:bg-gray-700/50" />
                            <Skeleton className="h-8 bg-gray-200/80 dark:bg-gray-700/50" />
                            <Skeleton className="h-8 col-span-2 bg-gray-200/80 dark:bg-gray-700/50" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={trainModel}
                        disabled={!file}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
                      >
                        Train HMM Model
                      </Button>
                    )}

                    {!file && !isTraining && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                        Upload a file to train the model
                      </p>
                    )}

                    {file && !isTraining && (
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                          <span>States: {numStates}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                          <span>Iterations: {iterations}</span>
                        </div>
                        <div className="flex items-center space-x-2 col-span-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <span>POS Tagging: {usePOSTags ? "Enabled" : "Disabled"}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Settings Sheet */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-xl overflow-hidden">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <FiSettings className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                      Model Settings
                    </h2>

                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 bg-gray-100/50 hover:bg-gray-200/50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
                        >
                          Configure Parameters
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="bg-white/95 dark:bg-gray-900/95 border-gray-200 dark:border-gray-800 backdrop-blur-md">
                        <SheetHeader>
                          <SheetTitle className="text-gray-900 dark:text-white">Model Parameters</SheetTitle>
                          <SheetDescription className="text-gray-600 dark:text-gray-300">
                            Adjust the parameters for the Hidden Markov Model.
                          </SheetDescription>
                        </SheetHeader>

                        <div className="space-y-6 py-6">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="states" className="text-gray-700 dark:text-gray-300">
                                Number of States: {numStates}
                              </Label>
                            </div>
                            <Slider
                              id="states"
                              min={2}
                              max={10}
                              step={1}
                              value={[numStates]}
                              onValueChange={(value) => setNumStates(value[0])}
                              className="py-4"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Controls the complexity of the model. Higher values can capture more complex patterns.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="iterations" className="text-gray-700 dark:text-gray-300">
                                Iterations: {iterations}
                              </Label>
                            </div>
                            <Slider
                              id="iterations"
                              min={10}
                              max={500}
                              step={10}
                              value={[iterations]}
                              onValueChange={(value) => setIterations(value[0])}
                              className="py-4"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Number of training iterations. More iterations may improve model accuracy.
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="pos-tags" className="block mb-1 text-gray-700 dark:text-gray-300">
                                Use POS Tags
                              </Label>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Enable part-of-speech tagging for better grammatical structure.
                              </p>
                            </div>
                            <Switch id="pos-tags" checked={usePOSTags} onCheckedChange={setUsePOSTags} />
                          </div>

                          <div className="p-4 rounded-md bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-sm">
                            <h4 className="font-medium text-purple-700 dark:text-purple-400 mb-1">
                              About Hidden Markov Models
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                              HMMs are statistical models that assume a process to be a Markov process with hidden
                              states. They're particularly useful for sequence modeling tasks like natural language
                              generation. The equation P(X, Y) = Π P(Yi | Yi-1) * P(Xi | Yi) represents the joint
                              probability.
                            </p>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Output and History Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-xl h-full">
                <CardContent className="pt-6">
                  <Tabs defaultValue="output" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <TabsTrigger
                        value="output"
                        className="data-[state=active]:bg-white/50 dark:data-[state=active]:bg-gray-700/50"
                      >
                        Generated Sentences
                      </TabsTrigger>
                      <TabsTrigger
                        value="history"
                        className="flex items-center data-[state=active]:bg-white/50 dark:data-[state=active]:bg-gray-700/50"
                      >
                        <MdHistory className="mr-2 h-4 w-4" />
                        History
                      </TabsTrigger>
                      <TabsTrigger
                        value="about"
                        className="flex items-center data-[state=active]:bg-white/50 dark:data-[state=active]:bg-gray-700/50"
                      >
                        About Project
                      </TabsTrigger>
                      <TabsTrigger
                        value="algorithm"
                        className="flex items-center data-[state=active]:bg-white/50 dark:data-[state=active]:bg-gray-700/50"
                      >
                        <FaBrain className="mr-2 h-4 w-4" />
                        Algorithm
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="output" className="mt-4 focus-visible:outline-none focus-visible:ring-0">
                      {sentences.length > 0 ? (
                        <ScrollArea className="h-[600px] pr-4">
                          <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                          >
                            {sentences.map((sentence, index) => (
                              <motion.div key={index} variants={cardVariants} custom={index} layout className="group">
                                <Card className="bg-white/80 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300 overflow-hidden">
                                  <CardContent className="p-4">
                                    <p className="text-gray-800 dark:text-gray-200">{sentence}</p>
                                  </CardContent>
                                  <CardFooter className="p-2 flex justify-end bg-gray-50/80 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex space-x-2">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => deleteSentence(index)}
                                              className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10"
                                            >
                                              <FiTrash2 className="h-3 w-3 mr-1" /> Delete
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Delete sentence</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>

                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(sentence, index)}
                                        className="text-xs"
                                      >
                                        {copiedIndex === index ? (
                                          <>
                                            <FaCheck className="h-3 w-3 mr-1" /> Copied
                                          </>
                                        ) : (
                                          <>
                                            <FiCopy className="h-3 w-3 mr-1" /> Copy
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  </CardFooter>
                                </Card>
                              </motion.div>
                            ))}
                          </motion.div>
                        </ScrollArea>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[600px] text-center">
                          <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                            <div className="relative bg-gray-100/80 dark:bg-gray-700/30 p-6 rounded-full mb-4">
                              <FiFileText className="h-10 w-10 text-gray-400" />
                            </div>
                          </div>
                          <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">
                            No sentences generated yet
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 max-w-md">
                            Upload a text file and train the model to generate sentences.
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="history" className="mt-4 focus-visible:outline-none focus-visible:ring-0">
                      <AnimatePresence mode="wait">
                        {history.length > 0 ? (
                          <motion.div
                            key="history-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <ScrollArea className="h-[600px] pr-4">
                              <div className="space-y-8">
                                {history.map((entry, entryIndex) => (
                                  <motion.div
                                    key={entryIndex}
                                    className="space-y-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: entryIndex * 0.1, duration: 0.5 }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                          {entry.timestamp}
                                        </p>
                                      </div>
                                      <div className="flex space-x-2">
                                        <Badge variant="outline" className="text-xs bg-gray-100/80 dark:bg-gray-800/50">
                                          States: {entry.params.states}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs bg-gray-100/80 dark:bg-gray-800/50">
                                          Iterations: {entry.params.iterations}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="space-y-2 pl-4 border-l border-gray-300 dark:border-gray-700">
                                      {entry.sentences.map((sentence, sentenceIndex) => (
                                        <Card
                                          key={sentenceIndex}
                                          className="bg-white/80 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600"
                                        >
                                          <CardContent className="p-3">
                                            <p className="text-sm text-gray-800 dark:text-gray-200">{sentence}</p>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </ScrollArea>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="history-empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-[600px] text-center"
                          >
                            <div className="relative">
                              <div className="absolute inset-0 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                              <div className="relative bg-gray-100/80 dark:bg-gray-700/30 p-6 rounded-full mb-4">
                                <MdHistory className="h-10 w-10 text-gray-400" />
                              </div>
                            </div>
                            <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">
                              No history yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                              Your generation history will appear here.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </TabsContent>

                    <TabsContent value="about" className="mt-4 focus-visible:outline-none focus-visible:ring-0">
                      <ScrollArea className="h-[600px] pr-4">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">About the Project</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              The HMM Sentence Generator is a tool that uses Hidden Markov Models to generate
                              grammatically plausible sentences based on patterns learned from input text. This project
                              demonstrates how statistical models can be used for natural language generation.
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                              By uploading text data, you can train a custom model that learns the patterns and
                              structures of your text, then generates new sentences that follow similar grammatical
                              rules and word usage patterns.
                            </p>
                          </div>

                          <div className="p-4 rounded-lg bg-gray-100/80 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600">
                            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Tech Stack</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                                <span className="text-gray-700 dark:text-gray-300">Next.js 14 (App Router)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span className="text-gray-700 dark:text-gray-300">TailwindCSS</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span className="text-gray-700 dark:text-gray-300">shadcn/ui</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                <span className="text-gray-700 dark:text-gray-300">React Icons</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                                <span className="text-gray-700 dark:text-gray-300">Framer Motion</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                                <span className="text-gray-700 dark:text-gray-300">TypeScript</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Features</h4>
                            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                              <li className="flex items-start">
                                <FaCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                <span>Upload and analyze text files to train custom models</span>
                              </li>
                              <li className="flex items-start">
                                <FaCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                <span>Configure model parameters for different generation styles</span>
                              </li>
                              <li className="flex items-start">
                                <FaCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                <span>Generate grammatically plausible sentences based on input text</span>
                              </li>
                              <li className="flex items-start">
                                <FaCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                <span>View and manage generation history</span>
                              </li>
                              <li className="flex items-start">
                                <FaCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                <span>Copy and share generated sentences</span>
                              </li>
                            </ul>
                          </div>

                          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20">
                            <h4 className="text-lg font-semibold mb-2 text-purple-700 dark:text-purple-400">
                              How It Works
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300">
                              The HMM Sentence Generator works by analyzing patterns in your text data and building a
                              statistical model that captures the relationships between words. It then uses this model
                              to generate new sentences that follow similar patterns.
                            </p>
                          </div>
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="algorithm" className="mt-4 focus-visible:outline-none focus-visible:ring-0">
                      <ScrollArea className="h-[600px] pr-4">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                              Hidden Markov Model Algorithm
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              A Hidden Markov Model (HMM) is a statistical model that can be used to describe the
                              evolution of observable events that depend on internal factors, which are not directly
                              observable.
                            </p>
                          </div>

                          <div className="p-4 rounded-lg bg-gray-100/80 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600">
                            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Key Components</h4>
                            <div className="space-y-3">
                              <div>
                                <h5 className="font-medium text-gray-800 dark:text-gray-200">States</h5>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                  The hidden states in the model that represent underlying patterns in the data.
                                </p>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-800 dark:text-gray-200">Observations</h5>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                  The visible outputs (words or tokens) that we can observe.
                                </p>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-800 dark:text-gray-200">
                                  Transition Probabilities
                                </h5>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                  The probability of moving from one state to another.
                                </p>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-800 dark:text-gray-200">Emission Probabilities</h5>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                  The probability of observing a specific output from a given state.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20">
                            <h4 className="text-lg font-semibold mb-2 text-purple-700 dark:text-purple-400">
                              Mathematical Representation
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <h5 className="font-medium text-gray-800 dark:text-gray-200">Joint Probability</h5>
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-md mt-1 font-mono text-sm">
                                  P(X, Y) = Π P(Yi | Yi-1) * P(Xi | Yi)
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                  Where X is the sequence of observations and Y is the sequence of states.
                                </p>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-800 dark:text-gray-200">Training</h5>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                  The model is trained using algorithms like Baum-Welch (a variant of
                                  Expectation-Maximization) to find the optimal parameters.
                                </p>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-800 dark:text-gray-200">Generation</h5>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                  New sequences are generated by sampling from the learned probability distributions.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                              Application to Text Generation
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 mb-3">
                              For sentence generation, the HMM can be used in several ways:
                            </p>
                            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                              <li className="flex items-start">
                                <div className="h-5 w-5 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full text-purple-600 dark:text-purple-400 mr-2 mt-0.5">
                                  1
                                </div>
                                <span>Tokenize input text into words or n-grams</span>
                              </li>
                              <li className="flex items-start">
                                <div className="h-5 w-5 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full text-purple-600 dark:text-purple-400 mr-2 mt-0.5">
                                  2
                                </div>
                                <span>Learn transition probabilities between words or states</span>
                              </li>
                              <li className="flex items-start">
                                <div className="h-5 w-5 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full text-purple-600 dark:text-purple-400 mr-2 mt-0.5">
                                  3
                                </div>
                                <span>Optionally incorporate part-of-speech tags for better grammar</span>
                              </li>
                              <li className="flex items-start">
                                <div className="h-5 w-5 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full text-purple-600 dark:text-purple-400 mr-2 mt-0.5">
                                  4
                                </div>
                                <span>Generate new sentences by sampling from the model</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Social Links */}
        <div className="fixed bottom-4 left-4 z-40 flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaGithub className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>GitHub</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaTwitter className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Twitter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaLinkedin className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>LinkedIn</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  )
}
