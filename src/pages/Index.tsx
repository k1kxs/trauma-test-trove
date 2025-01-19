import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/components/Login";
import Welcome from "@/components/Welcome";
import TestSelection from "@/components/TestSelection";
import TestInterface from "@/components/TestInterface";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

type UserData = {
  fullName: string;
  groupNumber: string;
};

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentScreen, setCurrentScreen] = useState<"login" | "welcome" | "selection" | "test">("login");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogin = (data: UserData) => {
    setUserData(data);
    setCurrentScreen("welcome");
  };

  const handleStartTest = () => {
    setCurrentScreen("selection");
  };

  const handleSectionSelect = (section: string | null) => {
    setSelectedSection(section);
    setCurrentScreen("test");
  };

  const handleTestComplete = () => {
    setCurrentScreen("selection");
    setSelectedSection(null);
  };

  const handleBack = () => {
    switch (currentScreen) {
      case "welcome":
        setCurrentScreen("login");
        setUserData(null);
        break;
      case "selection":
        setCurrentScreen("welcome");
        break;
      case "test":
        setCurrentScreen("selection");
        setSelectedSection(null);
        break;
      default:
        break;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30 dark:from-background dark:via-purple-900/10 dark:to-blue-900/10"
    >
      <div className="max-w-md mx-auto p-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-6"
        >
          {(currentScreen === "login" || currentScreen === "welcome") && (
            <motion.img
              src="/lovable-uploads/f458007b-7024-435d-86b6-9a36ee668797.png"
              alt="ОрГМУ Логотип"
              className="w-48 h-auto mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
          )}

          {currentScreen === "login" && (
            <>
              <Login onLogin={handleLogin} />
              <div className="text-center text-sm text-gray-500/70 mt-8">
                <p>Авторы:</p>
                <p>Дмитриев Кирилл Александрович</p>
                <p>Захаров Марк Николаевич</p>
                <p>Сивков Кирилл Дмитриевич</p>
              </div>
            </>
          )}
          {currentScreen === "welcome" && (
            <Welcome 
              userName={userData?.fullName || ""} 
              onStartTest={handleStartTest} 
            />
          )}
          {currentScreen === "selection" && (
            <TestSelection onSectionSelect={handleSectionSelect} />
          )}
          {currentScreen === "test" && (
            <TestInterface 
              section={selectedSection} 
              onComplete={handleTestComplete} 
            />
          )}
          {currentScreen !== "login" && currentScreen !== "test" && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="w-full flex items-center justify-center gap-2 shadow-sm bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white border-gray-200 hover:border-300 shadow-sm hover:shadow-md transition-all duration-500"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Button>
          )}
        </motion.div>
      </div>
      <Toaster />
    </motion.div>
  );
};

export default Index;