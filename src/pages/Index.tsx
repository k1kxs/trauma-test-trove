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

type UserData = {
  fullName: string;
  groupNumber: string;
};

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentScreen, setCurrentScreen] = useState<"login" | "welcome" | "test-type" | "selection" | "test">("login");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogin = (data: UserData) => {
    setUserData(data);
    setCurrentScreen("welcome");
  };

  const handleStartTest = () => {
    setCurrentScreen("test-type");
  };

  const handleTestTypeSelect = (type: "sections" | "comprehensive") => {
    if (type === "sections") {
      setCurrentScreen("selection");
    } else {
      setSelectedSection("comprehensive");
      setCurrentScreen("test");
    }
  };

  const handleSectionSelect = (section: string) => {
    setSelectedSection(section);
    setCurrentScreen("test");
  };

  const handleTestComplete = () => {
    setCurrentScreen("test-type");
    setSelectedSection(null);
  };

  const handleBack = () => {
    switch (currentScreen) {
      case "welcome":
        setCurrentScreen("login");
        setUserData(null);
        break;
      case "test-type":
        setCurrentScreen("welcome");
        break;
      case "selection":
        setCurrentScreen("test-type");
        break;
      case "test":
        if (selectedSection === "comprehensive") {
          setCurrentScreen("test-type");
        } else {
          setCurrentScreen("selection");
        }
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
          {currentScreen === "test-type" && (
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 backdrop-blur-sm bg-white/80 border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                  onClick={() => handleTestTypeSelect("comprehensive")}
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800">Комплексный тест (все разделы)</h3>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <Card
                  className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 backdrop-blur-sm bg-white/80 border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                  onClick={() => handleTestTypeSelect("sections")}
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800">Тест по разделам</h3>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
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